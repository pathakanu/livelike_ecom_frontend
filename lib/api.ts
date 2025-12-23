import { ChatResponseChunk, StreamChatInput } from "./types";

const DECODER = new TextDecoder();
const CHAT_PROXY_PATH = "/api/chat";
const STATIC_SESSION_ID = "livelike-demo-session";

export async function streamChat(
  input: StreamChatInput,
  onChunk: (chunk: ChatResponseChunk) => void,
): Promise<void> {
  const response = await fetch(CHAT_PROXY_PATH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: input.sessionId ?? STATIC_SESSION_ID,
      message: input.message,
      history: input.history,
    }),
    signal: input.signal,
  });

  if (!response.ok) {
    const reason = await safeReadError(response);
    throw new Error(reason || "Failed to reach assistant");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Streaming is not supported in this environment");
  }

  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += DECODER.decode(value, { stream: true });
    buffer = extractChunks(buffer, onChunk);
  }

  const last = DECODER.decode();
  buffer += last;
  extractChunks(buffer, onChunk, true);
}

function extractChunks(
  buffer: string,
  onChunk: (chunk: ChatResponseChunk) => void,
  flush = false,
): string {
  let remaining = buffer;
  let newlineIndex = remaining.indexOf("\n");

  while (newlineIndex !== -1) {
    const raw = remaining.slice(0, newlineIndex).trim();
    remaining = remaining.slice(newlineIndex + 1);

    const normalized = normalizeLine(raw);
    if (normalized === null) {
      newlineIndex = remaining.indexOf("\n");
      continue;
    }

    try {
      const parsed = JSON.parse(normalized) as ChatResponseChunk;
      onChunk(parsed);
    } catch {
      // Ignore malformed chunks and keep streaming.
    }

    newlineIndex = remaining.indexOf("\n");
  }

  if (flush && remaining.trim()) {
    const normalized = normalizeLine(remaining.trim());
    if (!normalized) {
      return "";
    }

    try {
      const parsed = JSON.parse(normalized) as ChatResponseChunk;
      onChunk(parsed);
      return "";
    } catch {
      return "";
    }
  }

  return remaining;
}

function normalizeLine(line: string): string | null {
  if (!line) {
    return null;
  }

  if (line.startsWith("data:")) {
    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") {
      return null;
    }
    return payload;
  }

  if (line === "[DONE]") {
    return null;
  }

  if (line.startsWith("event:") || line.startsWith("retry:")) {
    return null;
  }

  return line;
}

async function safeReadError(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text;
  } catch {
    return "";
  }
}
