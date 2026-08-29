export const NEOMART_LINKS = {
  home: "https://neomart.space/beauty/",
  products: "https://neomart.space/beauty/products",
  recommendations: "https://neomart.space/beauty/recommendations",
  main: "https://neomart.space/",
} as const;

const NEO_CHAT_URL = "https://emobathinfpylwjdcfbo.supabase.co/functions/v1/neo-chat";

export type NeoProduct = {
  id: number | string;
  name: string;
  short_description?: string | null;
  price?: number | null;
  discounted_price?: number | null;
  is_discounted?: boolean | null;
  main_image_url?: string | null;
  category?: string | null;
  brand?: string | null;
  published?: boolean | null;
  in_stock?: boolean | null;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  products?: NeoProduct[];
};

export type NeoChatResponse = {
  reply: string;
  products: NeoProduct[];
};

/** Sends the full conversation history to the NEOMART edge function. */
export async function sendToNeoChat(
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<NeoChatResponse> {
  const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (anonKey) {
    headers["apikey"] = anonKey;
    headers["authorization"] = `Bearer ${anonKey}`;
  }

  const response = await fetch(NEO_CHAT_URL, {
    method: "POST",
    headers,
    signal: signal ?? null,
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    throw new Error(`neo-chat request failed (${response.status})`);
  }

  const data = (await response.json()) as Partial<NeoChatResponse>;
  return {
    reply: typeof data.reply === "string" ? data.reply : "",
    products: Array.isArray(data.products) ? data.products : [],
  };
}

export function formatPrice(value?: number | null): string | null {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) return null;
  return `${value.toLocaleString("en-US")} د.ع`;
}

/** Never invent a URL: fall back to the beauty storefront. */
export function productUrl(_product: NeoProduct): string {
  return NEOMART_LINKS.home;
}
