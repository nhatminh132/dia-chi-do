"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { SceneVideoClip } from "@/data/types";
import { gsap, ScrollTrigger } from "@/lib/gsap/gsap";
import { useHydrated, useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const SEEK_EPSILON = 0.008;

/**
 * Part 02: một master ScrollTrigger điều khiển cả chuỗi ba clip.
 *
 * ── Màn hình hẹp ──────────────────────────────────────────────────────────
 *
 * Điện thoại KHÔNG nhận chuỗi video này. Ba clip `preload="auto"` cộng một
 * ScrollTrigger pin dài hơn 8.000px là quá nặng cho máy nhỏ, trong khi màn
 * 390px chỉ đọc được một khung hình tại một thời điểm. Thay vào đó: KHÔNG
 * video, KHÔNG ảnh cắt từ clip — chỉ nền tĩnh `SceneBackdrop` của chương
 * (gradient CSS) và phần biên tập xếp dọc. Không tải byte video/ảnh nào.
 *
 * `!hydrated` đi cùng nhánh tĩnh: lần render đầu chưa biết bề rộng thật.
 */
export function SceneSequenceMedia({
  clips,
  poster,
  className,
}: {
  clips: SceneVideoClip[];
  poster?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  // Asset Part 02 đã có thật và là một chuỗi scroll-critical. Render ngay
  // từ đầu để không thể bỏ qua trigger khi người dùng cuộn nhanh/reload giữa
  // trang trước khi IntersectionObserver kịp arm component.
  const [armed] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  const hydrated = useHydrated();
  const isMobile = useIsMobile();
  /** Không pin, không tải clip: lần render đầu và mọi màn hình hẹp. */
  const staticOnly = !hydrated || isMobile;
  /** Được phép gán `src` (bắt đầu tải) hay chưa. */
  const loadVideo = hydrated && !isMobile;

  useLayoutEffect(() => {
    if (!armed || staticOnly || clips.length === 0) return;

    const container = containerRef.current;
    const root = container?.closest<HTMLElement>('section[data-scene="scene-02-city"]');
    const stage = container?.closest<HTMLElement>("[data-scene-sequence-stage]");
    const runway = container?.closest<HTMLElement>("[data-scene-sequence-runway]");
    const videos = videoRefs.current;
    if (!container || !root || !stage || !runway || videos.length !== clips.length) return;

    const totalDuration = clips.reduce(
      (total, clip) => total + clip.durationSeconds,
      0,
    );
    const finalTime = (index: number) =>
      Math.max(0, (videos[index]?.duration || clips[index].durationSeconds) - 0.03);
    const endDistance = () =>
      Math.max(window.innerHeight * 1.8, totalDuration * 420);
    const setRunwayHeight = () => {
      runway.style.height = `${window.innerHeight + endDistance()}px`;
    };

    let seekFrame = 0;
    let pendingProgress = 0;
    const lastTimes = new Array<number>(clips.length).fill(-1);

    const seekToProgress = () => {
      seekFrame = 0;
      let remaining = gsap.utils.clamp(0, 1, pendingProgress) * totalDuration;
      let targetIndex = clips.length - 1;
      let targetTime = finalTime(targetIndex);

      for (let index = 0; index < clips.length; index += 1) {
        const duration = clips[index].durationSeconds;
        if (remaining <= duration || index === clips.length - 1) {
          targetIndex = index;
          targetTime = Math.min(remaining, Math.max(0, duration - 0.03));
          break;
        }
        remaining -= duration;
      }

      setActiveIndex((current) => (current === targetIndex ? current : targetIndex));
      videos.forEach((video, index) => {
        if (!video || failed[index]) return;
        /* CHỈ pause khi clip đang chạy. `pause()` trên một clip đang tải dở
           làm trình duyệt huỷ lượt tải rồi xin lại từ đầu — đo được: mỗi tệp
           bị tải hai lần, gấp đôi 6,6 MB video. */
        if (!video.paused) video.pause();
        const time = index === targetIndex ? targetTime : 0;
        if (Math.abs(video.currentTime - time) <= SEEK_EPSILON) return;
        if (Math.abs(lastTimes[index] - time) <= SEEK_EPSILON) return;
        lastTimes[index] = time;
        video.currentTime = time;
      });
    };

    const scheduleSeek = (progress: number) => {
      pendingProgress = progress;
      if (!seekFrame) seekFrame = window.requestAnimationFrame(seekToProgress);
    };

    const ctx = gsap.context(() => {
      setRunwayHeight();

      // ScrollTrigger cần một timeline có duration thật. Timeline rỗng có
      // duration = 0: trigger vẫn pin nhưng progress/update có thể không
      // được truyền đều, khiến clip giữa đôi lúc bị bỏ qua.
      const playhead = { progress: 0 };
      const master = gsap.timeline({
        scrollTrigger: {
          // Chỉ pin sân khấu 100vh chứa video. Pin cả ChapterFrame sẽ nhả
          // section ở cuối runway và bỏ qua phần Journey nằm sau video.
          trigger: stage,
          start: "top top",
          end: () => `+=${endDistance()}`,
          pin: true,
          // The outer runway owns the full scroll distance. Relying on the
          // generated spacer here lets a long ChapterFrame collapse back to
          // 100vh and its content can be skipped when the pin releases.
          pinSpacing: false,
          // Không smoothing ở master sequence: smoothing làm video đi sau
          // vị trí cuộn, đặc biệt dễ bỏ qua clip 02 khi người dùng cuộn nhanh.
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: setRunwayHeight,
          onUpdate: (self) => scheduleSeek(self.progress),
          onLeave: () => scheduleSeek(1),
        },
      });

      master.to(playhead, { progress: 1, duration: 1, ease: "none" });

      const cityCopy = root.querySelector<HTMLElement>('[data-sequence-copy="city"]');
      const journeyCopy = root.querySelector<HTMLElement>('[data-sequence-copy="journey"]');

      if (cityCopy) {
        master.fromTo(
          cityCopy,
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -18, duration: 0.14, ease: "power2.inOut" },
          0.34,
        );
      }

      if (journeyCopy) {
        master.fromTo(
          journeyCopy,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" },
          0.56,
        );
      }
    }, root);

    ScrollTrigger.refresh();
    scheduleSeek(0);

    return () => {
      if (seekFrame) window.cancelAnimationFrame(seekFrame);
      runway.style.height = "";
      ctx.revert();
    };
  }, [armed, clips, failed, staticOnly]);

  if (clips.length === 0) return null;

  /* Ảnh tĩnh luôn nằm dưới chuỗi clip: nền của điện thoại, và lớp chờ của
     desktop. Thẻ `<video>` vẫn được dựng đủ ba cái ngay từ lần render đầu,
     nhưng KHÔNG có `src` cho tới khi được phép tải.

     Vì sao không hoãn việc dựng thẻ: đo thực tế, dựng thẻ muộn làm Chromium
     khởi động lượt tải rồi huỷ và xin lại — mỗi tệp bị tải hai lần. */
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Màn hình hẹp KHÔNG dùng ảnh này: nó là khung hình cắt từ clip của bản
          desktop. Nền của điện thoại là `SceneBackdrop` của chương. Ẩn bằng
          CSS để máy nhỏ không tải byte ảnh nào (`loading="lazy"` + `display:
          none`), và để HTML máy chủ không khác bản hydrate. */}
      {poster ? (
        // Ảnh tĩnh trang trí, không đi qua bộ tối ưu ảnh của Next.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className="absolute inset-0 hidden size-full object-cover md:block"
          loading="lazy"
          decoding="async"
        />
      ) : null}

      {armed
        ? clips.map((clip, index) => (
            <video
              key={clip.src}
              ref={(node) => {
                videoRefs.current[index] = node;
              }}
              className={cn(
                // Đây là chuỗi scrub chính xác theo frame; transition opacity
                // dài sẽ khiến clip đang active bị che sau khi progress đã đổi.
                "absolute inset-0 size-full object-cover transition-none",
                index === activeIndex && !failed[index] && !staticOnly
                  ? "opacity-100"
                  : "opacity-0",
              )}
              src={loadVideo ? clip.src : undefined}
              muted
              playsInline
              preload={loadVideo ? "auto" : "none"}
              tabIndex={-1}
              disablePictureInPicture
              onError={() => {
                setFailed((current) => ({ ...current, [index]: true }));
              }}
            />
          ))
        : null}
    </div>
  );
}
