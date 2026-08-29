import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  MessageSquarePlus,
  Droplets,
  RefreshCw,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { ProductCard } from "./ProductCard";
import { sendToNeoChat, type ChatMessage } from "@/lib/neo-chat";

const CAPABILITIES = [
  {
    icon: Droplets,
    title: "شنو أفضل منتجات للبشرة الدهنية؟",
    description: "خيارات مناسبة للبشرة الدهنية",
    question: "شنو أفضل منتجات للبشرة الدهنية؟",
  },
  {
    icon: Droplets,
    title: "شنو أفضل منتجات للبشرة الجافة؟",
    description: "خيارات مناسبة للبشرة الجافة",
    question: "شنو أفضل منتجات للبشرة الجافة؟",
  },
  {
    icon: Sparkles,
    title: "شنو أفضل منتجات لحب الشباب؟",
    description: "اكتشف المنتجات المناسبة",
    question: "شنو أفضل منتجات لحب الشباب؟",
  },
  {
    icon: Search,
    title: "شنو أفضل منتجات للرؤوس السوداء؟",
    description: "اكتشف المنتجات المناسبة",
    question: "شنو أفضل منتجات للرؤوس السوداء؟",
  },
];

export function NeoChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const lastSentRef = useRef<ChatMessage[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const run = useCallback(async (history: ChatMessage[]) => {
    lastSentRef.current = history;
    setLoading(true);
    setError(false);
    try {
      const res = await sendToNeoChat(history);
      setMessages([...history, { role: "assistant", content: res.reply, products: res.products }]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }, []);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      const history: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages(history);
      setInput("");
      void run(history);
    },
    [loading, messages, run],
  );

  const startNewChat = useCallback(() => {
    if (loading) return;
    setMessages([]);
    setInput("");
    setError(false);
    lastSentRef.current = null;
    textareaRef.current?.focus();
  }, [loading]);

  return (
    <div
      dir="rtl"
      aria-label="NEOMART AI"
      className="flex h-[clamp(32rem,72dvh,42rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-md shadow-primary/5"
    >
      <header className="flex items-center gap-3 border-b border-border px-4 py-4 sm:px-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
          <Bot className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 text-right">
          <h2 className="text-base font-extrabold tracking-wide text-foreground">NEO AI</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">مساعدك الذكي لاكتشاف المنتجات المناسبة</p>
        </div>
        <button
          type="button"
          onClick={startNewChat}
          disabled={loading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/20 px-2.5 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span>محادثة جديدة</span>
        </button>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.length === 0 && !loading ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="w-full max-w-2xl">
              <p className="text-lg font-extrabold text-foreground sm:text-xl">قدرات المساعد الذكي</p>
              <p className="mt-2 text-sm text-muted-foreground">اختر ما تريد أن يساعدك NEO AI فيه</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {CAPABILITIES.map(({ icon: Icon, title, description, question }) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => send(question)}
                    className="group flex items-center gap-3 rounded-2xl border border-primary/15 bg-background p-4 text-right shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-foreground">{title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-start" : ""}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground whitespace-pre-wrap">
                    {m.content}
                  </div>
                ) : (
                  <div className="flex w-full flex-col gap-3">
                    <div className="flex gap-2.5">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <p className="min-w-0 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {m.content}
                      </p>
                    </div>
                    {m.products && m.products.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {m.products.map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ))}

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                </span>
                يفكر...
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <p className="text-foreground">
                  عذرًا، حدث خطأ أثناء الاتصال بالمساعد الذكي. حاول مرة أخرى.
                </p>
                <button
                  onClick={() => lastSentRef.current && void run(lastSentRef.current)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  إعادة المحاولة
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-card px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 shadow-sm transition-colors focus-within:border-primary/50"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="اسألني عن أي منتج..."
            className="max-h-32 min-h-[2.25rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="إرسال"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="h-4 w-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}
