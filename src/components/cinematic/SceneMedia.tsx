"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SceneVideo } from "@/data/types";
import { hasSceneVideo, sceneSource } from "@/lib/scenes";
import { useSceneMotion } from "@/lib/gsap/sceneMotion";
import { useIsMobile, useHydrated } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  LỚP A — KHÍ QUYỂN VIDEO
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Đây là lớp DUY NHẤT được phép phát video. Nó nằm TRÊN CÙNG của mỗi cảnh
 *  và không bao giờ chứa chữ, tài liệu lịch sử hay điều khiển.
 *
 *  ══════════════════════════════════════════════════════════════════════
 *  BẢO ĐẢM KHÔNG BAO GIỜ HỎNG — BẢY ĐIỀU KIỆN
 *  ══════════════════════════════════════════════════════════════════════
 *
 *  1. `src` rỗng ⇒ KHÔNG render thẻ `<video>` nào cả.
 *     Không có phần tử ⇒ không có request ⇒ không có 404 ⇒ không có biểu
 *     tượn video hỏng trên màn hình.
 *
 *  2. Thẻ `<video>` chỉ được TẠO RA khi cảnh sắp vào khung hình
 *     (IntersectionObserver, rootMargin 250px). Không tải trước cả bảy clip.
 *
 *  3. Cảnh đầu tiên (`loadingStrategy: "eager"`) được tạo ngay — người xem
 *     không phải chờ.
 *
 *  4. Video ra khỏi khung hình thì bị `pause()`. Chỉ một clip chạy tại một
 *     thời điểm ⇒ không đốt pin, không khựng máy quạt.
 *
 *  5. `muted` + `playsInline` luôn luôn ⇒ không có tiếng, không bao giờ bị
 *     chặn bởi chính sách autoplay của trình duyệt.
 *
 *  6. `onError` ⇒ báo lỗi ra ngoài ⇒ lớp nền tĩnh hiện lại. Không bao giờ
 *     để lại khung đen.
 *
 *  7. Người dùng bật giảm chuyển động (hoặc màn hình hẹp với chiến lược
 *     `poster-only`) ⇒ KHÔNG tạo video. Màn hẹp còn KHÔNG dùng ảnh poster
 *     nữa: nền của điện thoại là gradient `SceneBackdrop`, không phải một
 *     khung hình cắt từ clip của bản desktop.
 *
 *  ── Về `poster` rỗng ─────────────────────────────────────────────────────
 *
 *  `poster` chỉ được ghi vào thuộc tính khi có giá trị. `poster=""` sẽ làm
 *  trình duyệt hiểu thành "đường dẫn tới ảnh rỗng" và tải lại trang.
 */

/** Khoảng cách trước khung hình mà clip bắt đầu được tạo ra. */
const PRELOAD_MARGIN = "250px";

export function SceneMedia({
  scene,
  className,
  /** Bỏ qua kiểm tra màn hình hẹp (dùng cho cảnh mở đầu trên desktop). */
  allowOnMobile = false,
  /** Khi bật, thời gian video được điều khiển bởi ScrollTrigger thay vì autoplay. */
  scrollScrub = false,
}: {
  scene: SceneVideo;
  className?: string;
  allowOnMobile?: boolean;
  scrollScrub?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const motion = useSceneMotion();
  const isMobile = useIsMobile();
  const hydrated = useHydrated();

  /** Thẻ video đã được tạo ra chưa. */
  const [armed, setArmed] = useState(scene.loadingStrategy === "eager");
  /** Clip đã hỏng → quay về lớp nền tĩnh. */
  const [failed, setFailed] = useState(false);
  /** Clip đã phát được lần đầu. */
  const [playing, setPlaying] = useState(false);

  const source = sceneSource(scene);
  const hasSource = hasSceneVideo(scene);

  /* ── Màn hình hẹp: ảnh tĩnh thay video ─────────────────────────────────
     Chỉ cảnh khai báo `lower-resolution` mới được phép phát video trên máy
     nhỏ; `poster-only` và `omit` thì không bao giờ. Hero truyền
     `allowOnMobile` nhưng vẫn bị chiến lược của chính cảnh chặn lại.

     ── Vì sao chỉ chặn `src`, KHÔNG chặn việc dựng thẻ ──────────────────
     `!hydrated` cũng nằm trong điều kiện tải: lần render đầu chưa biết bề
     rộng thật, nên chưa gán `src` — điện thoại không tải byte video nào.

     Nhưng thẻ `<video>` vẫn được dựng (không `src`) thay vì hoãn tới sau
     hydrate. Đo thực tế: dựng thẻ muộn làm Chromium khởi động lượt tải rồi
     huỷ và xin lại từ đầu — mỗi tệp bị tải HAI lần, 6,6 MB thành 13,3 MB
     trên desktop. Giữ nguyên thẻ, chỉ gán `src` khi được phép, thì mỗi tệp
     tải đúng một lần. */
  const mobileVideoAllowed =
    allowOnMobile &&
    scene.mobileStrategy !== "omit" &&
    scene.mobileStrategy !== "poster-only";
  const blockVideo = isMobile && !mobileVideoAllowed;

  /** Có được phép gán `src` (tức là bắt đầu tải) hay chưa. */
  const loadVideo = hydrated && !blockVideo;

  /** Có dựng thẻ video hay không — độc lập với việc tải. */
  const wantsVideo = hasSource && !failed && (motion || scrollScrub) && !blockVideo;

  /* ── 1) Tạo thẻ video khi cảnh sắp vào khung hình ─────────────────────── */
  useEffect(() => {
    if (armed) return;
    if (scene.loadingStrategy === "eager") return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setArmed(true);
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin: PRELOAD_MARGIN },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [armed, scene.loadingStrategy]);

  /* ── 2) Phát / dừng theo vị trí trong khung hình ──────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loadVideo || !wantsVideo || scrollScrub) return;

    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (cancelled) return;

          if (entry.isIntersecting) {
            void video.play().catch(() => {
              /* Trình duyệt từ chối autoplay — im lặng bỏ qua, lớp nền tĩnh
                 vẫn hiện bên dưới nên không có gì bị đen. */
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [scrollScrub, loadVideo, wantsVideo]);

  /* ── 3) Dừng hẳn khi phần tử video bị gỡ khỏi cây ──────────────────────
     Dùng CALLBACK REF thay vì effect cleanup: React gọi callback ref với
     `null` đúng lúc phần tử bị gỡ (khi component unmount, hoặc khi `armed`
     đổi và thẻ video được dựng lại). Nhờ vậy clip luôn dừng — không giữ tiếp
     một luồng video trong nền, không tốn pin sau khi rời khung hình. */
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    if (videoRef.current && videoRef.current !== node && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    videoRef.current = node;
  }, []);

  /* ── Không có gì để hiện ──────────────────────────────────────────────── */
  if (!hasSource) return null;
  if (!wantsVideo && !scene.poster) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Ảnh tĩnh luôn nằm DƯỚI thẻ video: đây là lớp chờ của desktop trước
          khi khung hình đầu tiên sẵn sàng.

          ── Vì sao ảnh này CHỈ có ở màn hình rộng ─────────────────────────
          `poster` là một khung hình CẮT RA TỪ CHÍNH clip của bản desktop.
          Điện thoại không phát clip nào, nên nếu đem khung hình đó làm nền
          thì người xem đang nhìn một tấm ảnh tĩnh của một video họ không
          bao giờ được xem — và nó lệch hẳn với tông nền tĩnh của cả trang.

          Nền của điện thoại là `SceneBackdrop` (gradient dựng bằng CSS, không
          tệp, không request). Vì vậy ảnh poster bị ẩn dưới `md` bằng CSS:
          `loading="lazy"` + `display: none` ⇒ trình duyệt không tải byte ảnh
          nào trên máy nhỏ, và HTML máy chủ vẫn giống hệt bản hydrate.

          KHÔNG ghi lại `scene.poster` vào thuộc tính `poster` của thẻ video:
          làm vậy ảnh bị tải hai lần (một lần cho `<img>`, một lần cho thẻ). */}
      {scene.poster ? (
        // Poster là ảnh tĩnh trang trí, không đi qua bộ tối ưu ảnh của Next.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={scene.poster}
          alt=""
          className="absolute inset-0 hidden size-full object-cover md:block"
          loading="lazy"
          decoding="async"
        />
      ) : null}

      {wantsVideo && armed ? (
        <video
          ref={setVideoRef}
          data-scroll-scrub={scrollScrub ? "true" : undefined}
          className={cn(
            "absolute inset-0 size-full object-cover",
            /* Trước khung hình đầu tiên: mờ đi một chút cho mềm. */
            playing || scrollScrub ? "opacity-100" : "opacity-0",
            "transition-opacity duration-1000 ease-cinematic",
          )}
          src={loadVideo ? source : undefined}
          muted
          playsInline
          loop={!scrollScrub}
          preload={loadVideo && scrollScrub ? "auto" : "none"}
          /* Không bao giờ bị tab bướu tới, không chiếm thao tác chuột. */
          tabIndex={-1}
          disablePictureInPicture
          onCanPlay={() => setPlaying(true)}
          onLoadedMetadata={() => setPlaying(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}
