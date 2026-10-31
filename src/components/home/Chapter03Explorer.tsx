"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { GoogleMapsView } from "@/components/map/GoogleMapsView";
import { ArchiveImage } from "@/components/media/ArchiveImage";
import { ArchiveZoomDialog } from "@/components/media/ArchiveZoomDialog";
import type { ArchiveEntry } from "@/components/media/archiveEntry";
import type { Site } from "@/data/types";
import { isPublic, publicAddress } from "@/lib/content-status";
import { periodLabel } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  PART 03 — MỘT CAROUSEL HỒ SƠ ĐỊA CHỈ
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ba lớp tư liệu (kho ảnh · địa chỉ đỏ · bản đồ ký ức) không còn tách thành ba
 * khối/tab nữa. Chúng gộp vào MỘT tấm thẻ cho mỗi địa chỉ:
 *
 *      ┌─────────────── ảnh lưu trữ ───────────────┐
 *      │ tên · giai đoạn · địa chỉ · tóm tắt       │  ← thông tin hồ sơ
 *      └─────────────── bản đồ nhỏ ────────────────┘
 *
 * Vuốt ngang (hoặc dùng ← →) để đi qua từng địa chỉ. Ảnh nào có thì hiện,
 * chưa có thì hiện tấm biển "đang bổ sung"; bản đồ nào có toạ độ/Place ID thì
 * hiện, chưa có thì nói rõ là chưa có — không vẽ bản đồ giả.
 *
 * ── Vì sao chỉ mount iframe của slide đang xem (±1) ──────────────────────
 *
 * Mỗi bản đồ là một iframe Google. Mười slide = mười iframe nếu mount hết.
 * Chỉ slide hiện tại và hai slide kề được mount, phần còn lại chờ; nhờ vậy
 * vuốt tới đâu bản đồ đã sẵn ở đó mà trang không phải tải cả loạt từ đầu.
 */

/** Tỉ lệ khung ảnh/bản đồ trong thẻ — giữ mọi slide cùng chiều cao. */
const MEDIA_RATIO = "4 / 3";

const pad = (value: number) => String(value).padStart(2, "0");

function hasMap(site: Site): boolean {
  return site.mapEmbedUrl != null || site.coordinates != null;
}

/** Ảnh đại diện của địa chỉ: ưu tiên ảnh công khai có `src`. */
function coverOf(site: Site) {
  return (
    site.images.find((image) => Boolean(image.src) && isPublic(image.status)) ??
    site.images[0] ??
    null
  );
}

export function Chapter03Explorer({ sites }: { sites: Site[] }) {
  const total = sites.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  /** Chỉ mount bản đồ khi cả khối đã tới gần tầm nhìn. */
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Đồng bộ chỉ số với vị trí cuộn ngang ──────────────────────────────
     Chờ cuộn dừng hẳn 120ms rồi mới đổi slide đang chọn: nếu đổi theo từng
     khung hình thì lúc kéo qua 10 slide sẽ mount/unmount iframe liên tục. */
  const settle = useRef(0);

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const next = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(Math.max(0, Math.min(total - 1, next)));
    }, 120);
  }, [total]);

  useEffect(() => () => window.clearTimeout(settle.current), []);

  const goTo = useCallback((next: number) => {
    const el = trackRef.current;
    if (!el) return;

    const clamped = Math.max(0, Math.min(total - 1, next));
    setIndex(clamped);
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }, [total]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(total - 1);
    }
  };

  /* ── Ảnh đang xem lớn ───────────────────────────────────────────────── */
  const [zoomSite, setZoomSite] = useState<Site | null>(null);
  const zoomEntry = buildZoomEntry(zoomSite, sites);

  return (
    <div className="mt-10 border-t border-line pt-6">
      {/* ── Đầu khối: nhãn + số thứ tự + mũi tên ───────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="font-mono text-[0.6rem] tabular-nums tracking-[0.18em] text-paper-faint">
            03
          </span>
          <p className="truncate font-display text-[clamp(1rem,1.6vw,1.25rem)] uppercase leading-tight text-paper">
            Hồ sơ địa chỉ
          </p>
          <span className="hidden shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-paper-faint sm:inline">
            {total} hồ sơ · ảnh · bản đồ
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-[0.6rem] tabular-nums tracking-[0.14em] text-paper-faint">
            {pad(index + 1)} / {pad(total)}
          </span>

          <div className="flex items-center gap-1.5">
            <ArrowButton
              direction="prev"
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
            />
            <ArrowButton
              direction="next"
              disabled={index >= total - 1}
              onClick={() => goTo(index + 1)}
            />
          </div>
        </div>
      </div>

      {/* ── Dải carousel ───────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Hồ sơ địa chỉ đỏ"
        className={cn(
          "mt-4 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth",
          "border border-line bg-ink-900/30",
          "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold/60",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {sites.map((site, siteIndex) => {
          const cover = coverOf(site);
          const showMap = hasMap(site);
          const near = Math.abs(siteIndex - index) <= 1;

          return (
            <article
              key={site.id}
              aria-roledescription="slide"
              aria-label={`${siteIndex + 1} / ${total}: ${site.name}`}
              className="w-full shrink-0 snap-start"
            >
              <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,0.95fr)] md:gap-6">
                {/* ══ Ảnh lưu trữ ═══════════════════════════════════════ */}
                <div className="relative min-w-0">
                  {cover ? (
                    <ArchiveImage
                      item={cover}
                      ratio={MEDIA_RATIO}
                      hideCaption
                      sizes="(max-width: 768px) 92vw, 30vw"
                    />
                  ) : (
                    <div className="grid aspect-4/3 place-items-center border border-line bg-ink-800 px-6 text-center">
                      <p className="max-w-[22ch] font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.16em] text-paper-faint">
                        Tư liệu ảnh đang được bổ sung
                      </p>
                    </div>
                  )}

                  {cover && cover.src && isPublic(cover.status) ? (
                    <button
                      type="button"
                      onClick={() => setZoomSite(site)}
                      aria-label={`Xem lớn ảnh: ${cover.caption ?? cover.title}`}
                      title="Xem lớn"
                      className="absolute inset-0 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold"
                    >
                      <span className="absolute right-2 top-2 grid size-7 place-items-center border border-line-strong bg-ink-950/85 text-paper transition-colors duration-300 hover:border-gold/70 hover:text-gold">
                        <ZoomIcon />
                      </span>
                    </button>
                  ) : null}
                </div>

                {/* ══ Thông tin hồ sơ ═══════════════════════════════════ */}
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-baseline justify-between gap-3 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-paper-faint">
                    <span className="tabular-nums">
                      {pad(siteIndex + 1)} / {pad(total)}
                    </span>
                    <span>{periodLabel(site.period)}</span>
                  </div>

                  <h3 className="mt-3 font-display text-[clamp(1.15rem,2.1vw,1.6rem)] uppercase leading-[1.16] text-paper">
                    {site.name}
                  </h3>

                  {publicAddress(site) ? (
                    <p className="mt-2 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-paper-faint">
                      {publicAddress(site)}
                    </p>
                  ) : null}

                  <p className="mt-3 line-clamp-3 text-pretty text-[0.85rem] leading-relaxed text-paper-mute">
                    {site.summary}
                  </p>

                  <Link
                    href={`/ho-so/${site.slug}`}
                    className="mt-auto pt-5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-gold transition-colors duration-300 hover:text-flag-bright"
                  >
                    Xem hồ sơ →
                  </Link>
                </div>

                {/* ══ Bản đồ nhỏ ════════════════════════════════════════ */}
                <div className="flex min-w-0 flex-col">
                  <div className="aspect-4/3 overflow-hidden border border-line-strong bg-ink-900">
                    {showMap && inView && near ? (
                      <GoogleMapsView sites={[site]} selected={site} />
                    ) : (
                      <div className="grid h-full place-items-center px-5 text-center">
                        <p className="max-w-[20ch] font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.15em] text-paper-faint">
                          {showMap
                            ? siteIndex === index
                              ? "Đang tải bản đồ…"
                              : "Bản đồ ký ức"
                            : "Chưa có toạ độ đã kiểm chứng"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Thanh tiến trình 10 hồ sơ ──────────────────────────────────── */}
      <div className="mt-2 flex items-center gap-1">
        {sites.map((site, siteIndex) => (
          <button
            key={site.id}
            type="button"
            aria-current={siteIndex === index}
            aria-label={`Tới ${site.name}`}
            title={site.name}
            onClick={() => goTo(siteIndex)}
            className="group flex-1 py-2"
          >
            <span
              className={cn(
                "block h-[2px] w-full transition-colors duration-300",
                siteIndex === index
                  ? "bg-gold"
                  : "bg-line group-hover:bg-line-strong",
              )}
            />
          </button>
        ))}
      </div>

      <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-paper-faint">
        Vuốt ngang hoặc dùng ← → để xem tiếp
      </p>

      <ArchiveZoomDialog
        entry={zoomEntry}
        onClose={() => setZoomSite(null)}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function buildZoomEntry(site: Site | null, sites: Site[]): ArchiveEntry | null {
  if (!site) return null;

  const cover = coverOf(site);
  if (!cover) return null;

  const siteIndex = sites.findIndex((candidate) => candidate.id === site.id);

  return {
    item: cover,
    location: publicAddress(site) ?? undefined,
    sources: site.sources,
    siteName: site.name,
    siteHref: `/ho-so/${site.slug}`,
    plate: `Plate ${pad(siteIndex + 1)}`,
  };
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const label = direction === "prev" ? "Hồ sơ trước" : "Hồ sơ tiếp theo";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-8 place-items-center border border-line-strong text-paper-mute transition-colors duration-300",
        "hover:border-gold/70 hover:text-gold",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line-strong disabled:hover:text-paper-mute",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn("size-3.5", direction === "prev" && "rotate-180")}
        fill="none"
      >
        <path
          d="m9 5 7 7-7 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-3.5" fill="none">
      <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14.7 14.7 19 19M10.5 8v5M8 10.5h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
