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
  slug?: string | null;
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

const PRODUCT_CATEGORY_PATHS: Record<string, string> = {
  hair_care: "haircare",
  skin_care: "skincare",
  body_care: "bodycare",
  makeup: "makeup",
  perfume: "perfume",
};

function slugFromName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function productUrl(product: NeoProduct): string | null {
  const categoryPath = product.category
    ? (PRODUCT_CATEGORY_PATHS[product.category] ?? product.category)
    : null;
  const slug = product.slug || slugFromName(product.name);
  if (!categoryPath || !slug) return null;

  return `https://neomart.space/beauty/product/${encodeURIComponent(categoryPath)}/${encodeURIComponent(slug)}/${encodeURIComponent(String(product.id))}`;
}
