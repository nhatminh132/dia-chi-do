"use client";

import { useLayoutEffect, useRef } from "react";
import { EASE, gsap } from "@/lib/gsap/gsap";
import { useMotionReady } from "@/lib/gsap/motionReady";
import { useSceneMotion } from "@/lib/gsap/sceneMotion";
import { ARCHIVE_MASK_DURATION } from "@/lib/gsap/sceneTransitions";
import { ArchivalLayer } from "@/components/cinematic/ArchivalLayer";
import type { ArchiveItem, SourceRef } from "@/data/types";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  WOW #2 — MỞ TẤM LƯU TRỮ
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Bốn nhịp, đúng như bảng phân công trong brief:
 *
 *      1. Ảnh lưu trữ trồi lên vào giữa khung (mở mặt nạ cắt).
 *      2. Chú thích hiện.
 *      3. Ngày và địa điểm hiện — CHỈ khi nguồn xác nhận.
 *      4. Nhãn nguồn hiện và luôn bấm được.
 *      5. Tấm ảnh lùi sang để lộ tấm kế tiếp.
 *
 *  ── Kỹ thuật ─────────────────────────────────────────────────────────────
 *
 *  Hai tầng phần tử, để hai chuyển động không tranh nhau:
 *
 *      [data-archival-slot]   ← lùi sang / mờ đi  (khi tấm sau tới)
 *      └ [data-archival-plate] ← trồi lên / mở mặt nạ (khi tấm này tới)
 *
 *  Nếu gộp chung một phần tử, hai tween sẽ cùng ghi `y` và `opacity` —
 *  tween sau đè tween trước, và hiệu ứng "lùi sang" sẽ nhảy vị trí.
 *
 *  ── Khi bật giảm chuyển động ─────────────────────────────────────────────
 *
 *  Không tạo trigger nào. Tất cả tấm ảnh hiện sẵn, chú thích hiện sẵn —
 *  nội dung lịch sử vẫn đọc được đầy đủ, chỉ mất phần biểu diễn.
 */
export function ArchivalReveal({
  items,
}: {
  items: {
    item: ArchiveItem;
    location?: string;
    sources?: SourceRef[];
    siteName?: string;
    siteHref?: string;
    plate: string;
  }[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const motion = useSceneMotion();
  const layoutReady = useMotionReady();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !motion || !layoutReady) return;

    const ctx = gsap.context(() => {
      const slots = gsap.utils.toArray<HTMLElement>("[data-archival-slot]", root);

      slots.forEach((slot, index) => {
        const plate = slot.querySelector<HTMLElement>("[data-archival-plate]");

        /* 1 — Tấm ảnh mở mặt nạ cắt. */
        if (plate) {
          gsap.fromTo(
            plate,
            { opacity: 0, y: 52, clipPath: "inset(0% 0% 100% 0%)" },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: ARCHIVE_MASK_DURATION,
              ease: EASE.cinematic,
              scrollTrigger: {
                trigger: plate,
                start: "top 82%",
                once: true,
              },
            },
          );
        }

        /* 2 + 3 + 4 — Chú thích, ngày/địa điểm, nhãn nguồn hiện lần lượt.
           Mỗi dòng của chú thích là một phần tử con trực tiếp của
           `<figcaption>` — chúng hiện theo nhịp riêng. */
        const caption = slot.querySelector<HTMLElement>("[data-archival-caption]");
        if (caption) {
          const lines = Array.from(caption.children);

          gsap.fromTo(
            lines.length ? lines : [caption],
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.1,
              ease: EASE.cinematic,
              scrollTrigger: {
                trigger: caption,
                start: "top 72%",
                once: true,
              },
            },
          );
        }

        /* 5 — Tấm này lùi sang khi tấm kế tiếp tới. */
        const next = slots[index + 1];
        if (next) {
          gsap.to(slot, {
            y: -72,
            opacity: 0.16,
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top 74%",
              end: "bottom 46%",
              scrub: 0.6,
            },
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, [motion, layoutReady]);

  return (
    <div ref={rootRef} className="space-y-24 lg:space-y-32">
      {items.map((entry) => (
        <div key={entry.item.id} data-archival-slot className="will-change-transform">
          <div data-archival-plate>
            <ArchivalLayer
              item={entry.item}
              location={entry.location}
              sources={entry.sources}
              siteName={entry.siteName}
              siteHref={entry.siteHref}
              plate={entry.plate}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
