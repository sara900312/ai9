import { useEffect, useState } from "react";
import { ExternalLink, ShoppingBag } from "lucide-react";
import {
  fetchProductUrl,
  formatPrice,
  productUrl,
  type NeoProduct,
} from "@/lib/neo-chat";

const CATEGORY_LABELS: Record<string, string> = {
  hair_care: "العناية بالشعر",
  skin_care: "العناية بالبشرة",
  body_care: "العناية بالجسم",
  makeup: "مكياج",
  perfume: "عطور",
};

export function ProductCard({ product }: { product: NeoProduct }) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const price = formatPrice(
    product.is_discounted && product.discounted_price ? product.discounted_price : product.price,
  );
  const oldPrice = product.is_discounted ? formatPrice(product.price) : null;
  useEffect(() => {
    let active = true;
    void fetchProductUrl(product.id).then((url) => {
      if (active && url) setResolvedUrl(url);
    });
    return () => {
      active = false;
    };
  }, [product.id]);

  const url = resolvedUrl ?? productUrl(product);
  const category = product.category
    ? (CATEGORY_LABELS[product.category] ?? product.category)
    : null;

  return (
    <article className="flex gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      {product.main_image_url ? (
        <img
          src={product.main_image_url}
          alt={product.name}
          loading="lazy"
          className="h-24 w-24 shrink-0 rounded-xl bg-secondary object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-secondary">
          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h4 className="line-clamp-2 text-sm font-semibold text-foreground">{product.name}</h4>
        {product.short_description ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.short_description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {price ? <span className="text-sm font-bold text-primary">{price}</span> : null}
          {oldPrice ? (
            <span className="text-xs text-muted-foreground line-through">{oldPrice}</span>
          ) : null}
          {category ? (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
              {category}
            </span>
          ) : null}
          {product.brand ? (
            <span className="text-[11px] text-muted-foreground">{product.brand}</span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            شراء المنتج
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            عرض المنتج
          </a>
        </div>
      </div>
    </article>
  );
}
