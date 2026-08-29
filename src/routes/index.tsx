import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { NeoChat } from "@/components/neomart/NeoChat";
import { NEOMART_LINKS } from "@/lib/neo-chat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEOMART AI — مساعدك الذكي لاكتشاف المنتجات" },
      {
        name: "description",
        content:
          "NEOMART AI مساعد ذكي يساعدك على اكتشاف منتجات العناية بالبشرة والشعر المناسبة لك من متجر NEOMART.",
      },
      { property: "og:title", content: "NEOMART AI — مساعدك الذكي لاكتشاف المنتجات" },
      {
        property: "og:description",
        content: "اسأل NEOMART AI عن أي منتج واحصل على توصيات حقيقية من متجر NEOMART.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { label: "الصفحة الرئيسية", href: NEOMART_LINKS.home },
  { label: "الفئات", href: NEOMART_LINKS.products },
  { label: "أداة التوصيات", href: NEOMART_LINKS.recommendations },
  { label: "الموقع الرئيسي", href: NEOMART_LINKS.main },
];

function Index() {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-background font-sans">
      <div className="bg-[#f27fb0] py-2 text-center text-xs font-normal text-black">
        مرحباً بكم في متجرنا
      </div>

      <header className="border-b border-primary/15 bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="mx-auto text-center text-2xl font-extrabold tracking-widest text-primary">
            NEOMART
          </h1>
          <div className="w-14" />
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 pb-3 text-sm text-foreground">
          {NAV.map((item, i) => (
            <span key={item.label} className="flex items-center gap-3">
              <a href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </a>
              {i < NAV.length - 1 ? <span className="text-border">|</span> : null}
            </span>
          ))}
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        <NeoChat />
      </main>

      <footer className="border-t-2 border-primary/70 bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-foreground">
            <a href="tel:+9647776845909" className="flex items-center gap-2 hover:text-primary">
              <Phone className="h-4 w-4" />
              +9647776845909
            </a>
            <a
              href="mailto:non-reply@neomart.space"
              className="flex items-center gap-2 hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              non-reply@neomart.space
            </a>
          </div>
          <div className="flex items-center gap-4 text-primary">
            <Instagram className="h-5 w-5" />
            <Facebook className="h-5 w-5" />
          </div>
        </div>
      </footer>
    </div>
  );
}
