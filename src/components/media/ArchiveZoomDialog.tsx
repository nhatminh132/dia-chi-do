"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ArchiveEntry } from "@/components/media/archiveEntry";
import { isPublic } from "@/lib/content-status";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  XEM LỚN MỘT TẤM TƯ LIỆU
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Lưới compact chỉ đủ để nhận ra tấm ảnh; chữ trong ảnh lịch sử thường phải
 *  xem lớn mới đọc được. Hộp này mở đúng tấm đang bấm, không rời trang, và
 *  luôn mang theo phần "hộ chiếu" của tấm ảnh: số hiệu, ngày, địa điểm,
 *  nguồn, giấy phép.
 *
 *  Không dùng ảnh AI, không phóng to bằng cách cắt bớt — ảnh hiển thị trọn
 *  khung (`object-contain`) để không che mất chi tiết ở rìa.
 *
 *  Đóng bằng: nút X, phím Escape, hoặc bấm ra ngoài khung ảnh. Tiêu điểm
 *  được trả về đúng nút đã mở hộp.
 */
export function ArchiveZoomDialog({
  entry,
  onClose,
}: {
  entry: ArchiveEntry | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!entry) return;

    const previous = document.activeElement;
    if (previous instanceof HTMLElement) returnFocus.current = previous;

    const root = document.documentElement;
    const body = document.body;
    const rootOverflow = root.style.overflow;
    const bodyOverflow = body.style.overflow;
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = rootOverflow;
      body.style.overflow = bodyOverflow;
      const target = returnFocus.current;
      returnFocus.current = null;
      if (target?.isConnected) target.focus();
    };
  }, [entry, onClose]);

  if (!entry) return null;

  const { item } = entry;
  const renderable = Boolean(item.src) && isPublic(item.status);
  const title = item.caption ?? item.title;

  /* Portal ra `body`: khung part 03 bị `overflow-hidden` (hiệu ứng gấp/mở), nên
     một `position: fixed` nằm trong đó sẽ bị cắt và neo sai chỗ. */
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-zoom-title"
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-ink-950/95 p-4 backdrop-blur-md sm:p-8"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        className="relative my-auto w-full max-w-6xl border border-line-strong bg-ink-950/92 p-4 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.95)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
          {/* Ảnh trọn khung — không cắt, không crop. */}
          <div className="relative aspect-[4/3] max-h-[72vh] w-full overflow-hidden border border-line bg-ink-900">
            {renderable && item.src ? (
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 1024px) 92vw, 60vw"
                className="object-contain"
                priority
              />
            ) : null}
          </div>

          <div className="min-w-0 lg:pr-6">
            {entry.plate ? (
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.26em] text-paper-faint">
                {entry.plate}
              </p>
            ) : null}

            <h2
              id="archive-zoom-title"
              className="mt-2 text-pretty font-display text-[clamp(1.05rem,1.8vw,1.45rem)] uppercase leading-snug text-paper"
            >
              {title}
            </h2>

            {item.dateOrPeriod || entry.location ? (
              <p className="mt-3 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.14em] text-gold">
                {[item.dateOrPeriod, entry.location].filter(Boolean).join("  ·  ")}
              </p>
            ) : null}

            {item.credit ? (
              <p className="mt-4 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.12em] text-paper-faint">
                Ảnh: {item.credit}
              </p>
            ) : null}

            {item.license ? (
              <p className="mt-1 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.12em] text-paper-faint">
                Giấy phép: {item.license}
              </p>
            ) : null}

            {entry.sources?.length ? (
              <p className="mt-4 font-mono text-[0.6rem] leading-relaxed tracking-[0.1em] text-paper-faint">
                Nguồn:{" "}
                {entry.sources[0].url ? (
                  <a
                    href={entry.sources[0].url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-paper-mute underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-gold"
                  >
                    {entry.sources[0].title}
                    {entry.sources[0].publisher
                      ? ` — ${entry.sources[0].publisher}`
                      : ""}
                  </a>
                ) : (
                  <>
                    {entry.sources[0].title}
                    {entry.sources[0].publisher
                      ? ` — ${entry.sources[0].publisher}`
                      : ""}
                  </>
                )}
              </p>
            ) : null}

            {entry.siteHref ? (
              <Link
                href={entry.siteHref}
                className="mt-6 inline-flex items-center gap-2 border border-line-strong px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-gold transition-colors duration-300 hover:border-gold/60 hover:text-flag-bright"
              >
                {entry.siteName ?? "Mở hồ sơ địa điểm"}
                <span aria-hidden>→</span>
              </Link>
            ) : null}
          </div>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Đóng ảnh xem lớn"
          title="Đóng (Esc)"
          className="absolute -top-3 -right-3 grid size-9 place-items-center rounded-full border border-line-strong bg-ink-950 text-paper transition-colors duration-300 hover:border-gold/70 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:-top-4 sm:-right-4"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
