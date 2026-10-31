"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { GoogleMapsView } from "@/components/map/GoogleMapsView";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Site } from "@/data/types";
import { getPublicSites, periodLabel } from "@/lib/content";
import {
  APPROXIMATE_BADGE_LABEL,
  isApproximate,
  mappableCoordinates,
  publicAddress,
} from "@/lib/content-status";
import { EASE, gsap } from "@/lib/gsap/gsap";
import { useMotionReady } from "@/lib/gsap/motionReady";
import { useSceneMotion } from "@/lib/gsap/sceneMotion";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  WOW #3 — BẢN ĐỒ HÌNH THỨC → BẢN ĐỒ THẬT
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Vệt mực đỏ lan ra trên nền bản đồ hình thức, và bên dưới nó lộ ra BẢN ĐỒ
 *  THẬT — cùng một dữ liệu, cùng một toạ độ, cùng một bộ lọc trạng thái mà
 *  trang `/ban-do` đang dùng.
 *
 *  ── Nguyên tắc: BẢN ĐỒ THẬT, KHÔNG PHẢI BẢN ĐỒ GIẢ ─────────────────────
 *
 *  Không có video nào thay thế bản đồ. Không có ảnh giả. Không có nhãn địa
 *  danh bịa. Mọi thứ hiển thị ở đây lấy thẳng từ `getPublicSites()` — tức
 *  đúng những bản ghi mà cổng kiểm duyệt nội dung đã cho phép công khai:
 *
 *   • tọa độ thật (kèm nhãn "CẦN KIỂM CHỨNG" nếu toạ độ là xấp xỉ),
 *   • địa chỉ chỉ hiện khi đã xác minh,
 *   • nhãn trạng thái kiểm chứng của từng bản ghi,
 *   • liên kết tới hồ sơ địa điểm.
 *
 *  Trang `/ban-do` vẫn là nơi có bộ lọc và tìm kiếm đầy đủ; cảnh này là
 *  CỬA VÀO, không phải bản sao. Nên ở đây không nhân đôi bộ lọc.
 *
 *  ── Về iframe Google Maps ────────────────────────────────────────────────
 *
 *  Bản đồ là một `<iframe>` của Google. Nó CHỈ được mount khi khung hình
 *  sắp vào tầm nhìn — nếu không, trang chủ sẽ tải Google Maps ngay khi mở,
 *  dù người xem còn chưa tới cảnh 05.
 */
export function MapReveal() {
  const sites = useMemo(() => getPublicSites(), []);

  const frameRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const motion = useSceneMotion();
  const layoutReady = useMotionReady();

  const [selected, setSelected] = useState<Site | null>(null);
  /** Khung bản đồ đã vào tầm nhìn → mới mount iframe. */
  const [mapMounted, setMapMounted] = useState(false);

  /* ── Mount iframe khi khung hình tới gần ──────────────────────────────── */
  useEffect(() => {
    const el = frameRef.current;
    if (!el || mapMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMapMounted(true);
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mapMounted]);

  /* ── WOW: vệt mực loang, bản đồ thật lộ ra ───────────────────────────── */
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const ink = inkRef.current;
    const inner = innerRef.current;
    if (!frame || !ink || !inner) return;

    if (!motion || !layoutReady) {
      /* Không chuyển động ⇒ bản đồ hiện thẳng, không vệt mực. */
      gsap.set(inner, { clearProps: "all" });
      gsap.set(ink, { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: frame,
          start: "top 76%",
          once: true,
        },
        defaults: { ease: EASE.cinematic },
      });

      /* 1 — Vệt mực đỏ loang ra từ tâm. */
      timeline.fromTo(
        ink,
        { scale: 0, opacity: 1 },
        { scale: 1, duration: 1.15, ease: "power2.inOut" },
        0,
      );

      /* 2 — Bản đồ thật lộ ra bên dưới vệt mực. */
      timeline.fromTo(
        inner,
        { opacity: 0, scale: 1.06 },
        { opacity: 1, scale: 1, duration: 1.1 },
        0.28,
      );

      /* 3 — Vệt mực loang ra rồi tan, để lộ trọn khung bản đồ. */
      timeline.to(
        ink,
        { scale: 1.5, opacity: 0, duration: 1.1, ease: "power2.out" },
        0.85,
      );
    }, frame);

    return () => ctx.revert();
  }, [motion, layoutReady]);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* ══ BẢN ĐỒ ══════════════════════════════════════════════════════ */}
      <div ref={frameRef} className="lg:col-span-7">
        <div className="map-frame-dark relative aspect-4/3 overflow-hidden border border-line-strong bg-ink-900 sm:aspect-16/10 lg:aspect-auto lg:h-[64vh]">
          {/* Bản đồ thật — nằm dưới vệt mực. */}
          <div ref={innerRef} className="absolute inset-0">
            {mapMounted ? (
              <GoogleMapsView sites={sites} selected={selected} />
            ) : (
              <div
                className="grid h-full place-items-center bg-ink-900 px-6 text-center"
                aria-live="polite"
              >
                <p className="max-w-xs font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.16em] text-paper-faint">
                  Đang tải bản đồ địa điểm…
                </p>
              </div>
            )}
          </div>

          {/* Vệt mực đỏ — hiệu ứng chuyển cảnh, không chặn thao tác. */}
          <div
            ref={inkRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 origin-center opacity-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(200,16,46,0.98) 0%, rgba(94,7,21,0.94) 36%, rgba(94,7,21,0.58) 60%, rgba(94,7,21,0.18) 74%, transparent 82%)",
            }}
          />

          {/* Nhãn dưới khung — nói rõ đây là bản đồ thật. */}
          <p className="absolute inset-x-0 bottom-0 z-10 border-t border-line bg-ink/92 px-4 py-2 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-paper-faint">
            Bản đồ thật — toạ độ lấy từ hồ sơ đã kiểm chứng
          </p>
        </div>
      </div>

      {/* ══ DANH SÁCH ĐỊA ĐIỂM ══════════════════════════════════════════ */}
      <div className="lg:col-span-5">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper-faint">
          Chọn một địa điểm để xem trên bản đồ
        </p>

        <ul className="mt-5 space-y-3">
          {sites.map((site) => {
            const address = publicAddress(site);
            const approximate = isApproximate(site);
            const hasMap = mappableCoordinates(site) !== null;
            const active = selected?.id === site.id;

            return (
              <li key={site.id}>
                <button
                  type="button"
                  onClick={() =>
                    setSelected((prev) => (prev?.id === site.id ? null : site))
                  }
                  aria-pressed={active}
                  className={[
                    "w-full cursor-pointer border p-5 text-left transition-colors duration-400",
                    active
                      ? "border-flag-red bg-ink-700"
                      : "border-line bg-ink-800 hover:border-line-strong hover:bg-ink-700",
                  ].join(" ")}
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="min-w-0">
                      <span className="block font-display text-[1.02rem] uppercase leading-snug text-paper">
                        {site.name}
                      </span>
                      <span className="mt-2 block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper-faint">
                        {periodLabel(site.period)}
                      </span>
                    </span>

                    <StatusBadge status={site.status} />
                  </span>

                  <span className="mt-3 block text-pretty text-[0.84rem] leading-relaxed text-paper-mute">
                    {site.summary}
                  </span>

                  <span className="mt-4 block border-t border-line pt-3 font-mono text-[0.62rem] leading-relaxed text-paper-faint">
                    {address ?? "Địa chỉ đang được cập nhật"}
                    {approximate ? ` · ${APPROXIMATE_BADGE_LABEL}` : ""}
                    {!hasMap ? " · Chưa có toạ độ đã kiểm chứng" : ""}
                  </span>
                </button>

                {active ? (
                  <Link
                    href={`/ho-so/${site.slug}`}
                    className="mt-3 inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-flag-bright transition-colors duration-300 hover:text-gold"
                  >
                    Xem hồ sơ di tích
                    <span aria-hidden>→</span>
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/ban-do" variant="outline">
            Mở bản đồ địa chỉ đỏ
          </Button>
          <Button href="/ho-so/ben-nha-rong" variant="ghost">
            Hồ sơ Bến Nhà Rồng
          </Button>
        </div>
      </div>
    </div>
  );
}
