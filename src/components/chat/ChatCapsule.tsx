"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Ngày Giải phóng là khi nào?",
  "Địa chỉ đỏ là gì?",
  "Các di tích ở Sài Gòn?",
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  HƯỚNG DẪN VIÊN AI — capsule góc phải
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Bảng hội thoại nở ra từ chính nút, neo ở góc dưới bên phải: chiều cao do
 * `grid-template-rows` 0fr → 1fr lo, kèm scale + fade để chuyển động có điểm
 * bắt đầu rõ ràng. Panel luôn mount (không mount/unmount) nên mở và đóng đều
 * mượt như nhau; `inert` giữ nội dung không nhận focus khi đang đóng.
 */
export function ChatCapsule() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function reset() {
      setIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIdle(true), 15000);
    }
    reset();
    window.addEventListener("mousemove", reset);
    return () => {
      window.removeEventListener("mousemove", reset);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- đọc localStorage một lần sau mount; không thể khởi tạo state bằng window khi SSR */
    try {
      const h = localStorage.getItem("chatHistory");
      if (h) setMsgs(JSON.parse(h));
    } catch {}
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("chatHistory", JSON.stringify(msgs));
    } catch {}
  }, [msgs]);

  /* Đóng bằng Escape hoặc bấm ra ngoài. */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);

  /* Cuộn xuống tin mới nhất; focus ô nhập sau khi panel nở xong. */
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, loading, open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 320);
    return () => window.clearTimeout(timer);
  }, [open]);

  /* Bong bóng mời chỉ có nghĩa với chuột. Trên cảm ứng không có `mousemove`,
     nên đồng hồ "idle" chạy một lần là bong bóng bật ra VĨNH VIỄN và che chữ
     ở đáy màn hình 390px. */
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const showBubble = canHover && (hover || idle) && !open;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMsgs([
        ...next,
        { role: "assistant", content: data.reply || data.error || "Lỗi." },
      ]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "Lỗi kết nối." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-6 sm:right-6"
    >
      {/* ── Bảng hội thoại ───────────────────────────────────────────── */}
      <div
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "grid origin-bottom-right transition-[grid-template-rows,opacity,transform] duration-500 ease-cinematic",
          open
            ? "grid-rows-[1fr] scale-100 opacity-100"
            : "pointer-events-none grid-rows-[0fr] scale-95 opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "mb-2 flex flex-col rounded-2xl border border-line-strong bg-ink-950/95 p-3 backdrop-blur-xl",
              "w-[min(20rem,calc(100vw-2rem))] pointer-events-auto",
              "shadow-[0_18px_50px_-18px_rgba(0,0,0,0.9)]",
              "transition-transform duration-500 ease-cinematic",
              open ? "translate-y-0" : "translate-y-1.5",
            )}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(255,215,0,0.55)]"
                />
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-paper-faint">
                  Hướng dẫn viên AI
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Đóng hướng dẫn viên AI"
                className="grid size-6 place-items-center rounded-full text-paper-faint transition-colors duration-300 hover:text-gold"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                  <path
                    d="M1.5 1.5l7 7M8.5 1.5l-7 7"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div
              ref={scrollRef}
              className="mt-2.5 max-h-56 space-y-2 overflow-y-auto pr-1"
            >
              {msgs.length === 0 && !loading ? (
                <div className="space-y-1.5 border border-line/70 bg-ink-900/60 p-2.5">
                  <p className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-paper-faint">
                    Bắt đầu trò chuyện
                  </p>
                  <p className="text-[0.72rem] leading-relaxed text-paper-mute">
                    Hỏi về những địa chỉ đỏ, mốc thời gian hoặc hiện vật trong
                    bảo tàng.
                  </p>
                </div>
              ) : null}

              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-lg px-2.5 py-1.5 text-[0.72rem] leading-relaxed",
                    m.role === "user"
                      ? "ml-auto rounded-br-sm border border-flag-red/40 bg-flag-red/15 text-paper"
                      : "mr-auto rounded-bl-sm border border-line bg-ink-800 text-paper-mute",
                  )}
                >
                  {m.content}
                </div>
              ))}

              {loading ? (
                <div className="flex w-11 items-center justify-center gap-1 rounded-lg rounded-bl-sm border border-line bg-ink-800 px-2.5 py-2.5">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      aria-hidden
                      className="size-1 animate-pulse rounded-full bg-paper-faint"
                      style={{ animationDelay: `${d * 160}ms` }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setInput(q)}
                  className="rounded-full border border-line px-2 py-1 text-[0.6rem] leading-none text-paper-faint transition-colors duration-300 hover:border-line-strong hover:text-gold"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-2.5 flex gap-1.5">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Hỏi về Địa Chỉ Đỏ…"
                aria-label="Câu hỏi cho hướng dẫn viên AI"
                className="min-w-0 flex-1 rounded-full border border-line bg-ink px-2.5 py-1.5 text-[0.72rem] text-paper placeholder:text-paper-faint focus:border-line-strong focus:outline-none"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="shrink-0 rounded-full bg-flag-red px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-paper transition-colors duration-300 hover:bg-flag-bright hover:text-ink-950 disabled:opacity-40"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nút + bong bóng mời ─────────────────────────────────────── */}
      <div className="relative flex items-center">
        <div
          aria-hidden={!showBubble}
          className={cn(
            "pointer-events-none absolute bottom-0 right-14 w-52 origin-right rounded-xl border border-line-strong bg-ink-950/95 p-2.5 text-[0.68rem] leading-snug text-paper-mute backdrop-blur-xl",
            "shadow-[0_14px_36px_-16px_rgba(0,0,0,0.9)]",
            "transition-[opacity,transform] duration-500 ease-cinematic",
            showBubble
              ? "translate-x-0 opacity-100"
              : "translate-x-1.5 opacity-0",
          )}
        >
          Tôi là hướng dẫn viên AI. Bạn cần giúp gì không?
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-expanded={open}
          aria-label={open ? "Đóng hướng dẫn viên AI" : "Mở hướng dẫn viên AI"}
          className={cn(
            "relative grid size-11 place-items-center rounded-full border bg-ink-950/90 text-paper-mute backdrop-blur-xl",
            "pointer-events-auto",
            "shadow-[0_12px_30px_-12px_rgba(0,0,0,0.9)]",
            "transition-[transform,color,border-color,background-color] duration-500 ease-cinematic",
            "hover:scale-105 hover:text-gold",
            open ? "border-gold/60 text-gold" : "border-line-strong",
          )}
        >
          <span
            className={cn(
              "transition-transform duration-500 ease-cinematic",
              open ? "rotate-90 scale-90" : "rotate-0",
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
