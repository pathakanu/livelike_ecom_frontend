"use client";

import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Ask for deals, compare products, or build a cart..."
            className="h-14 pr-28 text-base"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-2 h-10 rounded-xl px-6 text-xs uppercase tracking-wide"
            disabled={!value.trim()}
            isLoading={isLoading}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
