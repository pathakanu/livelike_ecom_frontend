"use client";

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatStreamProps {
  content: string;
  isStreaming?: boolean;
  colorClass?: string;
  secondaryClass?: string;
}

export default function ChatStream({
  content,
  isStreaming,
  colorClass = "text-gray-800",
  secondaryClass = "text-gray-500",
}: ChatStreamProps) {
  if (!content.trim() && isStreaming) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {content
        .split("\n")
        .filter((segment) => segment.trim().length > 0)
        .map((segment, index) => (
          <p
            key={`${segment}-${index}`}
            className={`text-sm leading-relaxed ${colorClass}`}
          >
            {segment.trim()}
          </p>
        ))}
      {isStreaming && (
        <div className="flex items-center gap-2 text-xs">
          <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
          <p className={`tracking-wide ${secondaryClass}`}>
            Thinking about more details...
          </p>
        </div>
      )}
    </div>
  );
}
