"use client";

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
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const alignmentClass = isUser ? "justify-end" : "justify-start";
  const streamColors = {
    colorClass: isUser ? "text-white" : "text-slate-800",
    secondaryClass: isUser ? "text-white/70" : "text-slate-500",
    accentColor: isUser ? "#ffffff" : "#a855f7",
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
          className={cn(
            "shadow-xl",
            isUser
              ? "border-none bg-gradient-to-br from-purple-600 to-violet-600 text-white"
              : "bg-white text-slate-900 dark:bg-white dark:text-slate-900",
          )}
        >
          <CardContent className="p-5">
            {renderContent(message, streamColors, parsedProducts)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function renderContent(
  message: ChatMessageType,
  colors: {
    colorClass: string;
    secondaryClass: string;
    accentColor: string;
  },
  parsedProducts?: ParsedProductContent | null,
) {
  if (message.type === "text") {
    if (parsedProducts && parsedProducts.items.length > 0) {
      return (
        <div className="space-y-4">
          {parsedProducts.intro && (
            <p className={`text-sm ${colors.colorClass}`}>
              {parsedProducts.intro}
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {parsedProducts.items.map((item) => (
              <ProductCard key={item.id} product={item} ctaLabel="Shop now" />
            ))}
          </div>
        </div>
      );
    }

    return (
      <ChatStream
        content={message.content}
        isStreaming={message.isStreaming}
        colorClass={colors.colorClass}
        secondaryClass={colors.secondaryClass}
        accentColor={colors.accentColor}
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
      <div className="space-y-4">
        {message.content && (
          <p className="text-sm text-slate-500">
            {message.content}
          </p>
        )}
        <div className="space-y-4">
          {payload.items.map((item) => (
            <ProductCard key={item.id} product={item} ctaLabel={payload.ctaLabel} />
          ))}
        </div>
      </div>
    );
  }

  if (
    message.type === "comparison" &&
    message.data &&
    "entries" in message.data
  ) {
    const payload = message.data as ProductComparisonPayload;
    return (
      <div className="space-y-4">
        {message.content && (
          <p className="text-sm text-slate-500">
            {message.content}
          </p>
        )}
        <ProductComparison payload={payload} />
      </div>
    );
  }

  if (
    message.type === "cart" &&
    message.data &&
    "subtotal" in message.data
  ) {
    const payload = message.data as CartSummaryPayload;
    return (
      <div className="space-y-4">
        {message.content && (
          <p className="text-sm text-slate-500">
            {message.content}
          </p>
        )}
        <CartSummary payload={payload} />
      </div>
    );
  }

  return (
    <ChatStream
      content={message.content}
      isStreaming={message.isStreaming}
      colorClass={colors.colorClass}
      secondaryClass={colors.secondaryClass}
      accentColor={colors.accentColor}
    />
  );
}

type ParsedProductContent = {
  intro: string;
  items: ProductListPayload["items"];
};

function extractProductsFromText(content: string): ParsedProductContent {
  const items: ProductListPayload["items"] = [];
  const matches: Array<{ start: number; name: string; body: string }> = [];

  const numberedRegex = /(\d+)\.\s+\*\*(.+?)\*\*([\s\S]*?)(?=\n\d+\.\s+\*\*|$)/g;
  let match: RegExpExecArray | null;
  while ((match = numberedRegex.exec(content)) !== null) {
    matches.push({
      start: match.index,
      name: match[2].trim(),
      body: match[3],
    });
  }

  const headingRegex = /###\s+(.+?)\s*\n([\s\S]*?)(?=\n###\s+|\n\d+\.\s+\*\*|$)/g;
  while ((match = headingRegex.exec(content)) !== null) {
    matches.push({
      start: match.index,
      name: match[1].replace(/\*\*/g, "").trim(),
      body: match[2],
    });
  }

  matches
    .sort((a, b) => a.start - b.start)
    .forEach(({ start, name, body }) => {
      if (items.find((item) => item.name === name)) {
        return;
      }
      const price = extractCurrency(body);
      const description = extractField(body, "Description") || body.split("\n")[0]?.trim() || "";
      const rating = extractRating(body);
      const image = extractImage(body);
      const badge = extractBadge(body);

      items.push({
        id: `${start}-${name}`,
        name,
        description,
        price: price ?? 0,
        image,
        rating: rating ?? undefined,
        badge: badge ?? undefined,
      });
    });

  const intro = matches.length ? content.slice(0, matches[0].start).trim() : content.trim();

  return {
    intro,
    items,
  };
}

function extractCurrency(block: string): number | null {
  const priceMatch =
    block.match(/\*\*Price:\*\*[^$\d]*\$?\s*([\d.,]+)/i) ||
    block.match(/Price[^$\d]*\$?\s*([\d.,]+)/i) ||
    block.match(/\$([\d.,]+)/);
  if (!priceMatch) {
    return null;
  }
  const normalized = priceMatch[1].replace(/[^\d.,-]/g, "").replace(/,/g, "");
  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
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
  const markdownMatch =
    block.match(/!?\[[^\]]*]\((https?:[^)]+)\)/i) ||
    block.match(/https?:\/\/[^\s)]+(?:jpg|jpeg|png|webp)/i);
  if (markdownMatch) {
    return markdownMatch[1] || markdownMatch[0];
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
