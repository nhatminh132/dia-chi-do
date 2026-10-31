"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  CHỈ BÁO CHƯƠNG — thanh dọc (desktop) / thanh tiến trình (mobile)
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  "Chỉ dẫu chương thanh lịch" — không phải menu, không phải thanh chia tỉ
 *  lệ phần trăm, và không bao giờ che nội dung.
 *
 *  ── Vì sao không dùng `position: fixed` cho cả hai ───────────────────────
 *
 *  Trên desktop, thanh dọc đứng sát mép phải, ngoài vùng đọc. Nó dùng
 *  `pointer-events-none` ở lớp bọc và chỉ các nút bên trong mới nhận
 *  chuột — nên nó không bao giờ chặn thao tác của người xem.
 *
 *  Trên mobile, một thanh tiến trình 2px nằm ngay dưới thanh đầu. Cột dọc
 *  trên màn hình 375px sẽ chiếm mất không gian đọc và dễ bị bấm nhầm.
 *
 *  ── Vì sao không cần JS để hoạt động ─────────────────────────────────────
 *
 *  Thanh dọc dùng `<a href="#chapter-0X">` thật — người xem cuộn tới được
 *  cả khi JavaScript không chạy. JS chỉ thêm phần "chương nào đang hiện".
 */
export function ChapterRail({
  chapters,
}: {
  chapters: readonly {
    id: string;
    number: string;
    label: string;
    ids?: readonly string[];
  }[];
}) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? "");
  /*
    Thanh chỉ báo chỉ hiện SAU khi người xem đã rời khỏi cảnh mở đầu.

    Ở khung mở đầu, đây là một nhãn dài hạn nữa cạnh tiêu đề — cạnh tranh
    với chữ. Nên ở scrollY = 0 nó mờ đi, và bắt đầu hiện rõ khi người xem
    đã cuộn qua khỏi cảnh 01.
  */
  const [pastIntro, setPastIntro] = useState(false);

  /*
    Thanh neo chỉ LÓ RA đúng lúc người xem ĐI QUA từ chương này sang chương
    khác, rồi tự thụt vào.

    Cuộn trong lòng một chương thì KHÔNG hiện: lúc đó thanh neo không nói thêm
    gì — người xem đang ở đúng chương đó rồi, và một cột chữ thường trực ở mép
    phải chỉ tranh chỗ với nội dung.

    Vì vậy tín hiệu bật không phải "vừa cuộn" mà "vừa ĐỔI chương". Cửa sổ hiện
    là 1.800ms, đủ để mắt bắt được và đủ để bấm một neo nếu muốn.

    Muốn mở lúc khác thì có nút `<` ở giữa mép phải màn hình (`pinned`).
  */
  const [crossing, setCrossing] = useState(false);
  const [pinned, setPinned] = useState(false);
  const crossingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const activeIdRef = useRef(activeId);

  const railVisible = pastIntro && (crossing || pinned);

  useEffect(() => () => clearTimeout(crossingTimer.current), []);

  useEffect(() => {
    const onScroll = () => {
      setPastIntro(window.scrollY > Math.max(320, window.innerHeight * 0.55));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    /* Một cảnh có thể nằm trên nhiều phần tử (ví dụ cảnh 02 gồm cả phần
       văn xuôi và dòng thời gian). Ta quan sát TẤT CẢ các id của cảnh, và
       cảnh đang hiện là cảnh của phần tử đang chiếm nhiều diện tích nhất. */
    const elements = chapters
      .flatMap((chapter) => [chapter.id, ...(chapter.ids ?? [])])
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const owner = new Map<string, string>();
    for (const chapter of chapters) {
      for (const id of [chapter.id, ...(chapter.ids ?? [])]) {
        owner.set(id, chapter.id);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        /* Chọn phần tử đang chiếm nhiều diện tích nhất trong viewport. */
        let best: IntersectionObserverEntry | null = null;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }

        const chapterId = best?.target.id
          ? owner.get(best.target.id)
          : undefined;

        if (!chapterId || chapterId === activeIdRef.current) return;

        /* Đổi chương ⇒ mở cửa sổ hiện thanh neo. Cuộn trong cùng một chương
           không đi qua nhánh này, nên thanh vẫn ẩn. */
        activeIdRef.current = chapterId;
        setActiveId(chapterId);
        setCrossing(true);
        clearTimeout(crossingTimer.current);
        crossingTimer.current = setTimeout(() => setCrossing(false), 1800);
      },
      {
        /* Vùng quan sát là dải giữa màn hình — đúng nơi người xem đang đọc. */
        rootMargin: "-38% 0px -38% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [chapters]);

  const activeIndex = Math.max(
    0,
    chapters.findIndex((chapter) => chapter.id === activeId),
  );

  return (
    <>
      {/* ── Desktop: cột dọc ─────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        {/* Nút `<` sát mép phải, giữa màn hình — mở thanh neo bằng tay khi
            người xem không phải đang đi qua chương nào. */}
        <button
          type="button"
          onClick={() => setPinned((value) => !value)}
          aria-expanded={railVisible}
          aria-label={railVisible ? "Ẩn thanh chương" : "Hiện thanh chương"}
          title={railVisible ? "Ẩn thanh chương" : "Hiện thanh chương"}
          className={cn(
            "pointer-events-auto absolute right-0 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center",
            "border border-r-0 border-line-strong bg-ink-950/85 text-paper-mute backdrop-blur-md",
            "transition-colors duration-300 hover:border-gold/60 hover:text-gold",
            "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "transition-transform duration-500 ease-cinematic",
              railVisible && "rotate-180",
            )}
          >
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path
                d="M7 1 1.5 7 7 13"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <nav
          aria-label="Các chương của trang chủ"
          className={cn(
            "relative mr-11 transition-[opacity,transform] duration-500 ease-cinematic xl:mr-14",
            railVisible
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-[calc(100%+3.5rem)] opacity-0",
          )}
        >
        <ol className="pointer-events-none flex flex-col items-end">
          {chapters.map((chapter) => {
            const active = chapter.id === activeId;

            return (
              <li key={chapter.id} className="pointer-events-auto">
                <a
                  href={`#${chapter.id}`}
                  aria-current={active ? "location" : undefined}
                  aria-label={`Chương ${chapter.number}: ${chapter.label}`}
                  className={cn(
                    "group flex min-h-11 items-center justify-end gap-3 py-1 pl-3 pr-1 transition-colors duration-300",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
                  )}
                >
                  <span
                    className={cn(
                      "whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-all duration-300",
                      active
                        ? "translate-x-0 text-gold opacity-100"
                        : "translate-x-2 text-paper-faint opacity-0 group-hover:translate-x-0 group-hover:text-paper-mute group-hover:opacity-100",
                    )}
                  >
                    {chapter.label}
                  </span>

                  <span
                    aria-hidden
                    className={cn(
                      "font-mono text-[0.6rem] tabular-nums tracking-[0.14em] transition-colors duration-300",
                      active
                        ? "text-gold"
                        : "text-paper-faint group-hover:text-paper",
                    )}
                  >
                    {chapter.number}
                  </span>

                  <span
                    aria-hidden
                    className={cn(
                      "block transition-all duration-500 ease-cinematic motion-reduce:transition-none",
                      active
                        ? "h-0.5 w-7 bg-flag-red"
                        : "h-px w-3 bg-line-strong group-hover:w-5 group-hover:bg-paper-faint",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ol>
        </nav>
      </div>

      {/* ── Mobile: thanh tiến trình dưới thanh đầu ─────────────────────── */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-16 z-30 flex gap-1 sm:top-20 lg:hidden"
      >
        {chapters.map((chapter, index) => (
          <span
            key={chapter.id}
            className={cn(
              "h-0.5 flex-1 transition-colors duration-500 ease-cinematic motion-reduce:transition-none",
              index < activeIndex
                ? "bg-flag-red/70"
                : index === activeIndex
                  ? "bg-gold"
                  : "bg-line",
            )}
          />
        ))}
      </div>
    </>
  );
}
