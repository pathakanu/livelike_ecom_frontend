"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
      <div className={`text-sm leading-relaxed ${colorClass}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
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
