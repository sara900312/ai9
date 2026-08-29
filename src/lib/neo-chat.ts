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

/** Never invent a URL: fall back to the beauty storefront. */
const PRODUCT_CATEGORY_PATHS: Record<string, string> = {
  hair_care: "haircare",
  skin_care: "skincare",
  body_care: "bodycare",
  makeup: "makeup",
  perfume: "perfume",
};

export async function fetchProductUrl(id: number | string): Promise<string | null> {
  const anonKey = import.meta.env["VITE_NEOMART_SUPABASE_ANON_KEY"] as string | undefined;
  if (!anonKey) return null;

  const response = await fetch(
    `https://ykyzviqwscrjjkucorlp.supabase.co/rest/v1/products?select=id,category,slug&id=eq.${encodeURIComponent(String(id))}`,
    {
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
      },
    },
  );
  if (!response.ok) return null;

  const rows = (await response.json()) as Array<Record<string, unknown>>;
  const product = rows[0];
  if (!product) return null;

  const slug = typeof product.slug === "string" ? product.slug : null;
  const category = typeof product.category === "string" ? product.category : null;
  const categoryPath = category ? (PRODUCT_CATEGORY_PATHS[category] ?? category) : null;
  if (!slug || !categoryPath) return null;

  return `https://neomart.space/beauty/product/${encodeURIComponent(categoryPath)}/${encodeURIComponent(slug)}/${encodeURIComponent(String(id))}`;
}
