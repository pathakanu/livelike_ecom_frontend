"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ChatContainer() {
  const { data: session } = useSession();
  const userKey = session?.user?.id;
  const displayName = session?.user?.name || session?.user?.username || "Shopper";
  const { messages, sendMessage, isLoading, error, clearError, resetConversation } =
    useChat(userKey);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const isEmpty = useMemo(() => messages.length === 0, [messages]);

  const handleSubmit = async () => {
    if (!draft.trim()) {
      return;
    }
    const value = draft;
    setDraft("");
    await sendMessage(value);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-black text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-purple-300">
              LiveLike Commerce Studio
            </p>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">
              AI Shopping Assistant
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Discover products, compare specs, and build carts with a single prompt.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-right sm:items-end">
            <p className="text-xs uppercase tracking-wide text-purple-200">
              Signed in as{" "}
              <span className="font-semibold text-white">{displayName}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetConversation}>
                Reset chat
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign out
              </Button>
            </div>
          </div>
        </header>

        {error && (
          <Alert variant="destructive" className="mb-4 border border-red-500/40">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="flex flex-col gap-3 text-red-100 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div
          className="flex-1 overflow-y-auto rounded-3xl bg-white/5 p-4 sm:p-6"
          ref={listRef}
        >
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-medium text-white">
                Ask for the perfect setup.
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-300">
                Try “Suggest a productivity laptop under $1500, then compare it with Apple
                options and prep my cart.”
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <ChatInput
            value={draft}
            onChange={setDraft}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
