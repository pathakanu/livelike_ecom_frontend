"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { streamChat } from "@/lib/api";
import {
  ChatHistoryItem,
  ChatMessage,
  ChatResponseChunk,
} from "@/lib/types";

const STORAGE_KEY = "shopping-assistant-history";
const STORAGE_VERSION_KEY = "shopping-assistant-build";

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;

export function useChat(userKey?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || initializedRef.current) {
      return;
    }

    try {
      const buildId =
        (window as typeof window & { __NEXT_DATA__?: { buildId?: string } })
          .__NEXT_DATA__?.buildId || "dev";
      const storedBuildId = window.localStorage.getItem(STORAGE_VERSION_KEY);
      if (storedBuildId !== buildId) {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.setItem(STORAGE_VERSION_KEY, buildId);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatMessage[];
        setMessages(parsed);
      }
    } catch {
      // Ignore hydration issues and start fresh.
    } finally {
      initializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !initializedRef.current) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const updateAssistantMessage = useCallback(
    (assistantId: string, updater: (message: ChatMessage) => ChatMessage) => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId ? updater(message) : message,
        ),
      );
    },
    [],
  );

  const appendAssistantArtifact = useCallback(
    (chunk: ChatResponseChunk) => {
      const artifact: ChatMessage = {
        id: createId(),
        role: "assistant",
        type: chunk.type,
        content: chunk.message,
        data: chunk.data,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, artifact]);
    },
    [],
  );

  const finalizeAssistant = useCallback(
    (assistantId: string) => {
      updateAssistantMessage(assistantId, (message) => ({
        ...message,
        isStreaming: false,
      }));
    },
    [updateAssistantMessage],
  );

  const buildHistory = useCallback(
    (list: ChatMessage[]): ChatHistoryItem[] =>
      list.map((message) => ({
        role: message.role,
        content:
          message.content ||
          (message.type === "product_list"
            ? "Shared product recommendations."
            : message.type === "comparison"
              ? "Shared product comparison."
              : message.type === "cart"
                ? "Shared cart summary."
                : ""),
      })),
    [],
  );

  const handleChunk = useCallback(
    (assistantId: string, chunk: ChatResponseChunk) => {
      if (chunk.type === "text") {
        updateAssistantMessage(assistantId, (message) => ({
          ...message,
          type: chunk.type,
          content: `${message.content}${chunk.message}`,
        }));
        return;
      }

      appendAssistantArtifact(chunk);
    },
    [appendAssistantArtifact, updateAssistantMessage],
  );

  const sendMessage = useCallback(
    async (prompt: string) => {
      const message = prompt.trim();
      if (!message) {
        return;
      }

      controllerRef.current?.abort();

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        type: "text",
        content: message,
        createdAt: Date.now(),
      };

      const historySnapshot = [...messages, userMessage];
      setMessages((prev) => [...prev, userMessage]);

      const assistantId = createId();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          type: "text",
          content: "",
          isStreaming: true,
          createdAt: Date.now(),
        },
      ]);

      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        await streamChat(
          {
            message,
            history: buildHistory(historySnapshot),
            signal: controller.signal,
            userKey,
          },
          (chunk) => handleChunk(assistantId, chunk),
        );
        finalizeAssistant(assistantId);
      } catch (err) {
        const fallback =
          err instanceof Error ? err.message : "Something went wrong";
        setError(fallback);
        updateAssistantMessage(assistantId, (previous) => ({
          ...previous,
          content:
            previous.content ||
            "I ran into an issue understanding that request. Please try again.",
          isStreaming: false,
        }));
      } finally {
        setIsLoading(false);
        controllerRef.current = null;
      }
    },
    [
      buildHistory,
      finalizeAssistant,
      handleChunk,
      messages,
      updateAssistantMessage,
      userKey,
    ],
  );

  const resetConversation = useCallback(() => {
    controllerRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clearError: () => setError(null),
    resetConversation,
  };
}
