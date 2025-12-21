export type Role = "user" | "assistant";

export type ChunkType = "text" | "product_list" | "comparison" | "cart";

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  badge?: string;
}

export interface ProductListPayload {
  items: ProductItem[];
  ctaLabel?: string;
  note?: string;
}

export interface ComparisonEntry {
  id: string;
  headline: string;
  highlights: string[];
  specs: string[];
  price?: number;
  badge?: string;
}

export interface ProductComparisonPayload {
  title: string;
  entries: ComparisonEntry[];
}

export interface CartItemPayload {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface CartSummaryPayload {
  items: CartItemPayload[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  type: ChunkType;
  data?: ProductListPayload | ProductComparisonPayload | CartSummaryPayload;
  isStreaming?: boolean;
  createdAt: number;
}

export interface ChatHistoryItem {
  role: Role;
  content: string;
}

export interface ChatResponseChunk {
  type: ChunkType;
  message: string;
  data?: ProductListPayload | ProductComparisonPayload | CartSummaryPayload;
}

export interface StreamChatInput {
  message: string;
  history: ChatHistoryItem[];
  signal: AbortSignal;
}
