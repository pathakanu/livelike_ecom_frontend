"use client";

import { Card, CardBody, Stack, Text, SimpleGrid } from "@chakra-ui/react";
import { useMemo } from "react";
import {
  CartSummaryPayload,
  ChatMessage as ChatMessageType,
  ProductComparisonPayload,
  ProductListPayload,
} from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import ProductComparison from "@/components/product/ProductComparison";
import CartSummary from "@/components/product/CartSummary";
import ChatStream from "./ChatStream";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const alignmentClass = isUser ? "justify-end" : "justify-start";
  const streamColors = {
    color: isUser ? "whiteAlpha.900" : "gray.800",
    secondary: isUser ? "whiteAlpha.700" : "gray.500",
    accent: isUser ? "whiteAlpha.900" : "purple.500",
  };
  const parsedProducts = useMemo(() => {
    if (message.type !== "text") {
      return null;
    }
    return extractProductsFromText(message.content);
  }, [message.content, message.type]);

  if (
    message.type === "text" &&
    !message.isStreaming &&
    !message.content.trim()
  ) {
    return null;
  }

  return (
    <div className={`flex w-full ${alignmentClass}`}>
      {!isUser && (
        <div className="mr-3 hidden h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white sm:flex">
          AI
        </div>
      )}
      <div className="max-w-2xl">
        <Card
          bg={isUser ? "purple.600" : "white"}
          color={isUser ? "white" : "gray.800"}
          borderRadius="2xl"
          boxShadow="xl"
        >
          <CardBody>
            {renderContent(message, streamColors, parsedProducts)}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function renderContent(
  message: ChatMessageType,
  colors: { color: string; secondary: string; accent: string },
  parsedProducts?: ParsedProductContent | null,
) {
  if (message.type === "text") {
    if (parsedProducts && parsedProducts.items.length > 0) {
      return (
        <Stack spacing={4}>
          {parsedProducts.intro && (
            <Text fontSize="sm" color={colors.color}>
              {parsedProducts.intro}
            </Text>
          )}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {parsedProducts.items.map((item) => (
              <ProductCard key={item.id} product={item} ctaLabel="Shop now" />
            ))}
          </SimpleGrid>
        </Stack>
      );
    }

    return (
      <ChatStream
        content={message.content}
        isStreaming={message.isStreaming}
        color={colors.color}
        secondaryColor={colors.secondary}
        accentColor={colors.accent}
      />
    );
  }

  if (
    message.type === "product_list" &&
    message.data &&
    "items" in message.data
  ) {
    const payload = message.data as ProductListPayload;
    return (
      <Stack spacing={4}>
        {message.content && (
          <Text fontSize="sm" color="gray.600">
            {message.content}
          </Text>
        )}
        <Stack spacing={4}>
          {payload.items.map((item) => (
            <ProductCard key={item.id} product={item} ctaLabel={payload.ctaLabel} />
          ))}
        </Stack>
      </Stack>
    );
  }

  if (
    message.type === "comparison" &&
    message.data &&
    "entries" in message.data
  ) {
    const payload = message.data as ProductComparisonPayload;
    return (
      <Stack spacing={4}>
        {message.content && (
          <Text fontSize="sm" color="gray.600">
            {message.content}
          </Text>
        )}
        <ProductComparison payload={payload} />
      </Stack>
    );
  }

  if (
    message.type === "cart" &&
    message.data &&
    "subtotal" in message.data
  ) {
    const payload = message.data as CartSummaryPayload;
    return (
      <Stack spacing={4}>
        {message.content && (
          <Text fontSize="sm" color="gray.600">
            {message.content}
          </Text>
        )}
        <CartSummary payload={payload} />
      </Stack>
    );
  }

  return (
    <ChatStream
      content={message.content}
      isStreaming={message.isStreaming}
      color={colors.color}
      secondaryColor={colors.secondary}
      accentColor={colors.accent}
    />
  );
}

type ParsedProductContent = {
  intro: string;
  items: ProductListPayload["items"];
};

function extractProductsFromText(content: string): ParsedProductContent {
  const regex = /(\d+)\.\s+\*\*(.+?)\*\*([\s\S]*?)(?=\n\d+\.\s+\*\*|$)/g;
  const items: ProductListPayload["items"] = [];
  let intro = "";
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const block = match[0];
    if (items.length === 0) {
      intro = content.slice(0, match.index).trim();
    }
    const name = match[2].trim();
    const price = extractCurrency(block);
    const description = extractField(block, "Description") || "";
    const rating = extractRating(block);
    const image = extractImage(block);
    const badge = extractBadge(block);

    items.push({
      id: `${match.index}-${name}`,
      name,
      description,
      price,
      image,
      rating: rating ?? undefined,
      badge: badge ?? undefined,
    });
  }

  return {
    intro: intro || content.trim(),
    items,
  };
}

function extractCurrency(block: string): number {
  const priceMatch =
    block.match(/\*\*Price:\*\*\s*\$?([\d.,]+)/i) ||
    block.match(/Price[:\s]*\$?([\d.,]+)/i);
  if (!priceMatch) {
    return 0;
  }
  return parseFloat(priceMatch[1].replace(/,/g, "")) || 0;
}

function extractField(block: string, field: string): string | null {
  const regex = new RegExp(`\\*\\*${field}:\\*\\*\\s*([^\\n]+)`, "i");
  const match = block.match(regex);
  if (match) {
    return match[1].trim();
  }
  return null;
}

function extractRating(block: string): number | null {
  const ratingMatch =
    block.match(/\*\*Rating:\*\*\s*([\d.]+)/i) ||
    block.match(/Rating[:\s]*([\d.]+)/i);
  if (!ratingMatch) {
    return null;
  }
  const rating = parseFloat(ratingMatch[1]);
  return Number.isNaN(rating) ? null : rating;
}

function extractImage(block: string): string {
  const imageMatch = block.match(/!\[[^\]]*]\((https?:[^)]+)\)/i);
  if (imageMatch) {
    return imageMatch[1];
  }
  return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop";
}

function extractBadge(block: string): string | null {
  const badgeMatch = block.match(/\*\*(Best|New|Top|Limited)[^*]*\*\*/i);
  if (badgeMatch) {
    return badgeMatch[1];
  }
  return null;
}
