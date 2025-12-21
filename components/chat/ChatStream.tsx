"use client";

import { Spinner, Text, VStack, Skeleton } from "@chakra-ui/react";

interface ChatStreamProps {
  content: string;
  isStreaming?: boolean;
  color?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export default function ChatStream({
  content,
  isStreaming,
  color = "gray.800",
  secondaryColor = "gray.500",
  accentColor = "purple.500",
}: ChatStreamProps) {
  if (!content.trim() && isStreaming) {
    return (
      <VStack align="stretch" spacing={2}>
        <Skeleton height="16px" />
        <Skeleton height="16px" width="80%" />
        <Skeleton height="16px" width="60%" />
      </VStack>
    );
  }

  return (
    <VStack align="stretch" spacing={3}>
      {content
        .split("\n")
        .filter((segment) => segment.trim().length > 0)
        .map((segment, index) => (
          <Text
            key={`${segment}-${index}`}
            fontSize="sm"
            lineHeight="tall"
            color={color}
          >
            {segment.trim()}
          </Text>
        ))}
      {isStreaming && (
        <VStack align="start" spacing={1}>
          <Spinner size="xs" color={accentColor} />
          <Text fontSize="xs" color={secondaryColor}>
            Thinking about more details...
          </Text>
        </VStack>
      )}
    </VStack>
  );
}
