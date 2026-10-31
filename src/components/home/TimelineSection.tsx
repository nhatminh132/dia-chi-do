"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useSceneMotion } from "@/lib/gsap/sceneMotion";
import { getEvents, SCOPE_LABELS } from "@/lib/content";
import { EASE, gsap } from "@/lib/gsap/gsap";

/**
 * Nhịp B của CẢNH 02 — DÒng THỜI GIAN. Nội dung theo Idea.txt §2.4.
 *
 * ── Đây là PINNED SCENE DUY NHẤT của trang chủ ────────────────────────────
 *
 * Trang chủ có bảy cảnh nhưng chỉ MỘT nhịp được ghim. Ghim tất cả sẽ
 * khiến người xem bị "nhốt" trong trang, mất quyền kiểm soát — đúng thứ cần
 * tránh. Dòng thời gian được chọn vì đây là khúc cao trào: sáu cột mốc trôi
 * ngang trong khi người xem vẫn cuộn dọc, tạo cảm giác đang lần theo một
 * hành trình.
 *
 * Nhịp này nằm TRONG cảnh 02 ("Thành phố và ký ức") — xem `StorySection.tsx`.
 *
 * ── Vì sao dùng `gsap.matchMedia()` ────────────────────────────────────────
 *
 * Ghim ngang trên màn hình nhỏ là trải nghiệm tệ: màn hình quá nhỏ để đọc
 * nội dung ngang, và chạm tay theo chiều ngang lại xung đột với cuộn dọc
 * đang diễn ra. `matchMedia` cho phép:
 *   · ≥768px + không giảm chuyển động → ghim + trôi ngang
 *   · còn lại                            → dọc dạng danh sách, cuộn tự nhiên
 *
 * DOM chỉ có MỘT bản; layout đổi bằng class `flex-col md:flex-row`. Không
 * nhân đôi nội dung, không tốn băng thông, và mọi thứ luôn đọc được.
 */
export function TimelineSection({ parentPinned = false }: { parentPinned?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  /*
    `useSceneMotion()` = cờ của dự án VÀ cờ "giảm chuyển động" của hệ điều
    hành. Với nhịp ghim ngang, giảm chuyển động của hệ thống phải được tôn
    trọng: một dải chạy ngang mà người dùng không muốn nhìn là đúng thứ
    brief §12 yêu cầu bỏ ("Disable cinematic pinning where appropriate").

    Xem `src/lib/gsap/sceneMotion.ts` — cổng này tách riêng cờ toàn site của
    dự án (luôn bật) khỏi cờ hệ điều hành.
  */
  const sceneMotion = useSceneMotion();

  const events = getEvents();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    // ── Desktop: ghim + trôi ngang ───────────────────────────────────
    //
    //  Chỉ chạy khi màn hình rộng VÀ người dùng không bật giảm chuyển động.
    //
    //  ⚠️ ĐIỀU KIỆN PHẢI LÀ CHUỖI, KHÔNG PHẢI HÀM TRẢ VỀ CHUỖI.
    //
    //  `gsap.matchMedia().add()` NHẬN ĐÚNG MỘT CHUỖI media query (hoặc một
    //  object ánh xạ tên → chuỗi). Nó KHÔNG hỗ trợ hàm trả về chuỗi.
    //
    //  Bằng chứng — đọc trong `node_modules/gsap/gsap-core.js` (`MatchMedia.add`):
    //
    //      _isObject(conditions) || (conditions = { matches: conditions });
    //      ...
    //      for (p in conditions) {
    //        mq = _win.matchMedia(conditions[p]);
    //
    //  Với `conditions` là HÀM: `_isObject` trả về false (typeof hàm là
    //  "function", không phải "object") ⇒ `conditions` thành `{ matches: fn }`
    //  ⇒ `matchMedia(fn)` — chuỗi hóa hàm thành văn bản vô nghĩa ⇒ media
    //  query không hợp lệ ⇒ `matches` luôn là false ⇒ callback KHÔNG BAO
    //  GIỜ chạy ⇒ không có ScrollTrigger nào, không có chuyển động ngang.
    //
    //  Đo thực tế trước khi sửa: `ScrollTrigger.getAll()` trả về 61 trigger
    //  (các hiệu ứng khác) và 0 trigger có `pin` — nhịp ghim chưa từng chạy.
    //
    //  Sửa tối thiểu: truyền CHUỖI. Vì effect đã phụ thuộc `sceneMotion`,
    //  khi cờ đổi thì toàn bộ `matchMedia` bị `revert()` và dựng lại với
    //  điều kiện mới — không cần cơ chế gọi lại điều kiện.
    if (sceneMotion && !parentPinned) {
      mm.add("(min-width: 768px)", () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: EASE.linear,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.6}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Đường tiến trình đi theo trục ngang, độc lập với chuyển động ngang
        if (progress) {
          gsap.fromTo(
            progress,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: EASE.linear,
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${distance() + window.innerHeight * 0.6}`,
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        // Làm sáng mốc đang đi qua
        const cards = gsap.utils.toArray<HTMLElement>("[data-tl-card]");
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0.42 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 78%",
                end: "left 40%",
                scrub: true,
              },
            },
          );
        });

        return () => {
          gsap.set(track, { clearProps: "transform" });
        };
      });
    }

    // ── Nhánh dọc: màn hình hẹp, HOẶC người dùng bật giảm chuyển động ──
    //
    //  Khi giảm chuyển động, dải thời gian KHÔNG được ghim ngang: người dùng
    //  phải đọc được hết sáu mốc mà không phải cuộn ngang. Bố cục xếp dọc
    //  do CSS xử lý — xem khối `@media (prefers-reduced-motion: reduce)` cho
    //  `.tl-track` trong `globals.css`.
    const vertical = () => {
      gsap.from("[data-tl-item]", {
        opacity: 0,
        y: 26,
        duration: 0.85,
        ease: EASE.cinematic,
        stagger: 0.06,
        scrollTrigger: { trigger: track, start: "top 84%", once: true },
      });
    };

    mm.add("(max-width: 767px)", vertical);

    // Màn hình rộng + giảm chuyển động ⇒ cũng dùng nhánh dọc.
    if (!sceneMotion || parentPinned) {
      mm.add("(min-width: 768px)", vertical);
    }

    return () => mm.revert();
  }, [events.length, parentPinned, sceneMotion]);

  return (
    <section
      ref={sectionRef}
      id="chapter-02-journey"
      aria-labelledby="chapter-02-journey-title"
      data-scene-part="journey"
      data-timeline-static={parentPinned ? "true" : undefined}
      className="relative isolate overflow-hidden border-t border-line bg-ink md:min-h-[100svh] md:flex md:flex-col md:justify-center md:pt-28"
    >
      {/* Nền */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 10%, #5E0715 0%, #120A0C 45%, #0A0A0A 80%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[90rem] px-5 pt-24 pb-16 sm:px-8 md:pt-28 md:pb-12 lg:px-12 xl:px-16">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <SectionLabel title="The Journey" />
            <h2
              id="chapter-02-journey-title"
              className="mt-6 text-balance font-display text-[clamp(1.9rem,5.2vw,3.6rem)] uppercase leading-[1.06] text-paper"
            >
              Từ khát vọng đến ngày thống nhất.
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-[0.95rem] leading-[1.85] text-paper-mute">
              Một hành trình lịch sử được tạo nên từ những bước ngoặt, những
              phong trào đấu tranh và sự đóng góp của nhiều thế hệ.
            </p>
          </div>

          <Link
            href="/dong-thoi-gian"
            className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-paper-dim transition-colors duration-300 hover:text-flag-bright"
          >
            Khám phá dòng thời gian
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* Đường tiến trình */}
      <div
        aria-hidden
        className="relative mx-5 mb-10 h-px bg-line-strong sm:mx-8 lg:mx-12 xl:mx-16"
      >
        <span
          ref={progressRef}
          className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-flag-red to-gold"
        />
      </div>

      {/* Track: dọc trên mobile, ngang trên desktop.
          `md:items-start` + chiều cao cố định cho mọi thẻ để các năm nằm
          thẳng hàng — `items-center` sẽ canh giữa từng thẻ theo chiều cao
          riêng nên thẻ dài hơn thì năm lệch xuống, đọc rất rối.

          ⚠️ `md:max-w-none` là BẮT BUỘC.

          `md:w-max` nói "rộng bằng nội dung" — sáu thẻ × 30rem = 2880px, để
          dải thời gian thật sự tràn ngang. Nhưng `max-w-[90rem]` (1440px) ở
          lớp gốc sẽ CHẶN lại đúng cái đó: track bị bóp về 1440px, các thẻ
          co lại còn ~219px, và `track.scrollWidth` bằng đúng bề rộng khung
          nhìn ⇒ `distance()` ≈ 0 ⇒ dải thời gian KHÔNG có gì để trôi ngang.

          Đo trước khi sửa: trackClientWidth = trackScrollWidth = 1440,
          transform = "none" khi đã cuộn tới giữa dải. */}
      <div className="relative overflow-x-hidden pb-20 md:overflow-visible md:pb-0">
        <div
          ref={trackRef}
          className="tl-track mx-auto flex w-full max-w-[90rem] flex-col gap-8 px-5 sm:px-8 md:min-h-[42vh] md:w-max md:max-w-none md:flex-row md:items-stretch md:gap-0 md:px-12 lg:px-12 xl:px-16"
        >
          {events.map((event, index) => (
            <article
              key={event.id}
              data-tl-card
              data-tl-item
              className="group relative flex w-full flex-col border-l border-line pl-6 md:w-[42vw] md:max-w-[30rem] md:border-l-0 md:border-t md:px-8 md:pt-12 md:pb-2 md:pl-0 lg:w-[34vw]"
            >
              {/* Node trên đường thời gian */}
              <span
                aria-hidden
                className="absolute -left-[5px] top-1.5 size-2.5 -translate-x-1/2 rotate-45 border border-gold bg-ink transition-colors duration-500 group-hover:bg-gold md:-top-px md:left-8 md:translate-x-0 md:translate-y-[-5px]"
              />

              {/* Năm — nằm trên đường cơ sở chung của mọi thẻ */}
              <span className="block font-display text-[clamp(2.6rem,5.6vw,4.25rem)] leading-none tabular-nums text-paper">
                {event.year}
              </span>

              {/* Phạm vi: một dòng riêng, không xuống dòng */}
              <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-faint">
                {event.scope === "toan-quoc"
                  ? SCOPE_LABELS["toan-quoc"]
                  : SCOPE_LABELS["sai-gon"]}
              </p>

              {event.dateLabel ? (
                <p className="mt-2 font-mono text-[0.66rem] tracking-[0.14em] text-gold">
                  {event.dateLabel}
                </p>
              ) : null}

              <h3 className="mt-5 text-balance font-display text-[1.1rem] uppercase leading-snug text-paper">
                {event.title}
              </h3>

              <p className="mt-4 max-w-[34ch] text-pretty text-[0.84rem] leading-relaxed text-paper-mute">
                {event.summary}
              </p>

              <p className="mt-auto pt-6 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-paper-faint">
                {event.keywords.join("  ·  ")}
              </p>

              {index < events.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-8 top-0 hidden h-4 w-px bg-line-strong md:block"
                />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
