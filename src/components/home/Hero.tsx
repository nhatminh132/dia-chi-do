"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SceneBackdrop } from "@/components/cinematic/SceneBackdrop";
import { SceneMedia } from "@/components/cinematic/SceneMedia";
import { VietnamFlag } from "@/components/cinematic/VietnamFlag";
import { Button } from "@/components/ui/Button";
import { ScrollSpeedHint } from "@/components/nav/ScrollSpeedHint";
import { getScene, hasSceneVideo } from "@/lib/scenes";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useSceneMotion } from "@/lib/gsap/sceneMotion";
import { EASE, gsap, ScrollTrigger } from "@/lib/gsap/gsap";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  CẢNH 01 — MỞ ĐẦU CINEMATIC
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Bốn pha:
 *
 *   PHASE 1  CỜ            Chỉ có lá cờ. Không tiêu đề, không nút.
 *   PHASE 2  LỘ TIÊU ĐỀ    Lá cờ rời khung, tiêu đề hiện qua mặt nạ.
 *   PHASE 3  HERO           Một nút chính, một liên kết phụ, điều hướng tối
 *                            giản. Chữ lớn nhưng cân đối.
 *   PHASE 4  VÀO CẢNH 02   Khi cuộn: tiêu đề thu nhỏ và dời đi, đồng thời
 *                            lộ ra khí quyển thành phố của cảnh 02.
 *
 *  ── VÌ SAO LÁ CỜ KHÔNG PHỦ KÍN KHUNG ──────────────────────────────────────
 *
 *  Bản trước trải lá cờ thành một DẢI NGANG ở đỉnh, rồi đặt tiêu đề ĐÈ LÊN
 *  dải đó. Hệ quả: ngôi sao vàng khổng lồ nằm ngay sau tiêu đề, phải hạ độ
 *  sáng xuống cho chữ đọc được — mà vàng hạ sáng trên nền tối thành màu ô
 *  liu, mất hẳn màu quốc kỳ. Nhìn ra là một áp phích tuyên truyền đỏ.
 *
 *  Nay lá cờ là MỘT VẬT THỂ có tỉ lệ đúng (2:3), đứng riêng trong không
 *  gian tối, được soi sáng từ góc trên-trái. Ngôi sao giữ đúng tỉ lệ với
 *  lá cờ nên nhỏ và gọn, không còn là hình trang trí khổng lồ. Và tiêu đề
 *  không còn nằm trên lá cờ — nó nằm trên sân khấu tối.
 *
 *  ── HAI KIỂU "LÁ CỜ RỜI KHUNG" ────────────────────────────────────────────
 *
 *  · CÓ VIDEO: cả video chiếm trọn khung hình, và nó được quét đi bằng
 *    `clip-path` — một mặt nạ thật, mở ra lộ tiêu đề HTML bên dưới.
 *
 *  · CHƯA CÓ VIDEO (trạng thái hiện tại): lá cờ dựng bằng SVG là một vật
 *    thể nhỏ, không phủ kín khung, nên nó được thu nhỏ/tan ra (scale + fade)
 *    thay vì bị cắt. Cắt một vật thể nhỏ sẽ trông như lỗi cắt ảnh.
 *
 *  ── VỀ NHÁP LÚC MỞ ĐẦU ────────────────────────────────────────────────────
 *
 *  Trạng thái "trước mở đầu" (tiêu đề ẩn) được đặt bằng CSS, KHÔNG đặt
 *  trong JavaScript. Lý do: bản HTML do server gửi đã được vẽ trước khi
 *  hydrate — nếu chờ tới `useLayoutEffect` mới ẩn, người xem sẽ thấy tiêu
 *  đề và các nút hiện ra trước, rồi biến mất, rồi mới hiện lại. Đo thật
 *  ở 1440×900: hiện đầy đủ lúc 1181ms, mới bị ẩn lúc 1532ms.
 *
 *  Khi không có JavaScript, thẻ `<noscript>` trong chính component này bỏ
 *  ẩn mọi thứ và ẩn lá cờ đi — không nội dung nào bị ẩn vĩnh viễn.
 */

/** Khoá ghi nhớ "đã xem mở đầu" trong phiên làm việc này. */
const INTRO_SEEN_KEY = "dd-intro-seen";

function readIntroSeen(): boolean {
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    /* Trình duyệt chặn storage (chế độ riêng tư) — coi như chưa xem. */
    return false;
  }
}

function markIntroSeen(): void {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* Bỏ qua — không có storage vẫn hoạt động bình thường. */
  }
}

export function Hero() {
  const shellRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const flagLayerRef = useRef<HTMLDivElement>(null);
  const flagObjectRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLSpanElement>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);

  const motion = useSceneMotion();
  const isMobile = useIsMobile();
  const [skipped, setSkipped] = useState(false);

  const scene = getScene("scene-01-flag");
  const hasVideo = scene ? hasSceneVideo(scene) : false;

  /* Màn hình hẹp: cảnh 01 là `poster-only`, nên `SceneMedia` dựng ảnh tĩnh và
     KHÔNG tạo thẻ `<video>` nào. Toàn bộ máy trạng thái dưới đây chỉ được
     chờ video khi thật sự có video — nếu không, lớp chờ `fixed` sẽ treo mãi
     trên điện thoại.

     Không dùng `useHydrated` ở đây: lúc hydrate `isMobile` còn `false`, nên
     lần chạy đầu đi đúng nhánh "có video" (dọn inline style, gắn cờ sẵn
     sàng) rồi thôi — không chạy lại, không nháy mở đầu hai lần. */
  const videoEnabled = hasVideo && !isMobile;
  const [mediaReady, setMediaReady] = useState(false);
  const videoReady = !videoEnabled || mediaReady;
  const [videoProgress, setVideoProgress] = useState(0);

  /* Chỉ mở Hero khi toàn bộ clip đã nằm trong buffered range. `canplay`
     thường chỉ đảm bảo vài frame đầu; với scroll-scrub, như vậy vẫn có thể
     nhảy/đen ở cuối timeline. */
  useEffect(() => {
    if (!videoEnabled) return;

    const video = rootRef.current?.querySelector<HTMLVideoElement>(
      "[data-scroll-scrub='true']",
    );
    if (!video) return;

    const updateBuffer = () => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      let bufferedEnd = 0;
      if (video.buffered.length) {
        bufferedEnd = video.buffered.end(video.buffered.length - 1);
      }

      const progress = Math.min(1, bufferedEnd / duration);
      setVideoProgress(progress);

      if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA && progress >= 0.999) {
        setMediaReady(true);
      }
    };

    const fail = () => {
      setMediaReady(true);
    };

    ["loadedmetadata", "loadeddata", "canplay", "canplaythrough", "progress"].forEach(
      (event) => video.addEventListener(event, updateBuffer),
    );
    video.addEventListener("error", fail);
    updateBuffer();

    return () => {
      ["loadedmetadata", "loadeddata", "canplay", "canplaythrough", "progress"].forEach(
        (event) => video.removeEventListener(event, updateBuffer),
      );
      video.removeEventListener("error", fail);
    };
  }, [videoEnabled]);

  /* ══ PHASE 1 → 2 → 3: mở đầu ═══════════════════════════════════════════ */
  useLayoutEffect(() => {
    const root = rootRef.current;
    const layer = flagLayerRef.current;
    if (!root || !layer) return;

    const line = root.querySelector("[data-hero-line]");
    const rest = root.querySelectorAll("[data-hero-intro]");

    /* CỜ "HERO ĐÃ SẴN SÀNG".
       Từ lúc này, quy tắc CSS "trước khi mở đầu" (ẩn tiêu đề) bị gỡ bỏ,
       nên khi GSAP buông inline style bằng `clearProps` thì chữ vẫn hiện.
       Xem giải thích dài ở `globals.css` ngay cạnh `[data-hero-ready]`.

       Cờ được gắn SAU khi GSAP đã áp trạng thái "trước" (from-state) — nên
       không có khoảnh khắc nào mà chữ hiện sớm rồi nhấp nháy. */
    const markReady = () => {
      root.setAttribute("data-hero-ready", "");
    };

    /* Người dùng bật giảm chuyển động ⇒ bỏ hẳn phần mở đầu. CSS đã ẩn lá
       cờ và hiện tiêu đề sẵn, ta chỉ cần dọn inline style mà GSAP để lại. */
    if (!motion) {
      gsap.set(layer, { clearProps: "all" });
      if (line) gsap.set(line, { clearProps: "all" });
      gsap.set(rest, { clearProps: "all" });
      markReady();
      return;
    }

    /* Có video thật ⇒ master ScrollTrigger bên dưới sở hữu toàn bộ intro.
       Không chạy thêm timeline tự động để video, chữ và pin không lệch nhịp. */
    if (videoEnabled) {
      gsap.set(layer, { clearProps: "all" });
      if (line) gsap.set(line, { clearProps: "all" });
      gsap.set(rest, { clearProps: "all" });
      markReady();
      return;
    }

    /* Đã xem mở đầu trong phiên này ⇒ vào thẳng trạng thái tĩnh. */
    if (readIntroSeen()) {
      if (!hasVideo) gsap.set(layer, { autoAlpha: 0 });
      if (line) gsap.set(line, { clearProps: "all" });
      gsap.set(rest, { clearProps: "all" });
      markReady();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE.cinematic } });
      introRef.current = tl;

      /* 1 — LÁ CỜ RỜI KHUNG.
             · có video → quét bằng clip-path (mặt nạ thật),
             · chưa có   → vật thể SVG tan ra (scale + fade). */
      if (!hasVideo && flagObjectRef.current) {
        tl.fromTo(
          flagObjectRef.current,
          { scale: 1, opacity: 1 },
          { scale: 1.16, opacity: 0, duration: 1.05, ease: "power2.inOut" },
          0,
        );
      }

      /* 2 — TIÊU ĐỀ TRỒI LÊN QUA Ô CẮT, lệch nhịp so với lá cờ. */
      if (line) {
        tl.fromTo(
          line,
          /* `x: 0, y: 0` là BẮT BUỘC, không phải thừa.
             Quy tắc CSS `[data-hero-line]{transform:translateY(112%)}` (trạng
             thái "trước mở đầu") được GSAP đọc và phân giải thành ma trận
             `matrix(1,0,0,1,0,102.217)` — tức là GSAP ghi nhận nó là một
             LỆCH THEO PIXEL `y = 102.217px`, KHÔNG phải `yPercent = 112`.
             Tween này chỉ động vào `yPercent`, nên `y` (pixel) giữ nguyên
             102.217px vĩnh viễn. Hệ quả: tiêu đề kết thúc mở đầu bị đẩy
             xuống ~102px, cắt mất phần dưới bởi ô `overflow-clip`.
             Đo thật ở 1440×900: transform cuối là
             `translate(0%, 0.0003%) translate3d(0px, 102.217px, 0px)`.
             Khai báo `x: 0, y: 0` ở trạng thái "from" ghi đè lệch pixel đó,
             còn `yPercent` lo phần trượt qua ô cắt. */
          { x: 0, y: 0, yPercent: 112, opacity: 0 },
          {
            x: 0,
            y: 0,
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
            ease: EASE.cinematic,
            /* KHÔNG `clearProps` ở đây. `clearProps` xoá inline style — mà
               inline style chính là thứ đang giữ chữ hiện. Xoá nó, quy tắc
               CSS "trước khi mở đầu" ([data-hero-line]{opacity:0}) thắng lại
               và tiêu đề biến mất đúng lúc mở đầu kết thúc.
               Giữ inline style lại không gây hại gì: transform tĩnh là
               matrix(1,0,0,1,0,0), vô hại. */
          },
          0.42,
        );
      }

      /* 3 — VỆT SÁNG QUÉT NGANG TIÊU ĐỀ, đúng một lần khi chữ vừa đáp. */
      if (sweepRef.current) {
        tl.fromTo(
          sweepRef.current,
          { xPercent: -130, opacity: 0 },
          { xPercent: 130, opacity: 1, duration: 0.85, ease: "power2.inOut" },
          0.85,
        ).to(sweepRef.current, { opacity: 0, duration: 0.45 }, 1.55);
      }

      /* 4 — CÁC TẦNG CÒN LẠI hiện theo thứ bậc. */
      tl.fromTo(
        rest,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: EASE.cinematic,
          /* KHÔNG `clearProps` — cùng lý do như trên: giữ inline style
             `opacity:1` để chữ không bị quy tắc CSS "trước khi mở đầu"
             giành lại. Cờ `data-hero-ready` lo phần dọn dẹp. */
        },
        0.95,
      )
        .call(() => markIntroSeen(), undefined, 1.9)
        /* Gắn cờ "đã sẵn sàng" ở CUỐI mở đầu — không sớm hơn. Nếu gắn sớm,
           quy tắc CSS sẽ gỡ trạng thái ẩn và chữ sẽ hiện trước khi tới
           đúng nhịp mở đầu. */
        .call(markReady, undefined, 2.1);
    }, root);

    return () => {
      introRef.current = null;
      ctx.revert();
    };
    /* `videoEnabled` CỐ Ý không nằm trong deps: trên điện thoại nó lật
       `true → false` ngay sau hydrate. Chạy lại effect lúc đó sẽ revert
       timeline vừa dựng và bỏ mất phần mở đầu. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVideo, motion]);

  /* ══ BỎ QUA MỞ ĐẦU ═════════════════════════════════════════════════════ */
  useLayoutEffect(() => {
    if (!skipped) return;

    const root = rootRef.current;
    const layer = flagLayerRef.current;
    if (!root || !layer) return;

    introRef.current?.kill();
    if (!hasVideo) gsap.set(layer, { autoAlpha: 0 });
    const line = root.querySelector("[data-hero-line]");
    if (line) gsap.set(line, { clearProps: "all" });
    gsap.set(root.querySelectorAll("[data-hero-intro]"), { clearProps: "all" });
    /* Gỡ trạng thái "trước khi mở đầu" — nếu không, `clearProps` vừa xoá
       inline style thì quy tắc CSS ẩn tiêu đề lại thắng và trang trắng. */
    root.setAttribute("data-hero-ready", "");
  }, [hasVideo, skipped]);

  /* MASTER HERO TIMELINE
     Một timeline duy nhất sở hữu pin, video seek và exit của cả nhóm chữ.
     Chỉ khởi tạo sau loadedmetadata để end distance dùng duration thật. */
  useLayoutEffect(() => {
    const root = rootRef.current;
    const shell = shellRef.current;
    const video = root?.querySelector<HTMLVideoElement>("[data-scroll-scrub='true']");
    /* Scroll control is an explicit user action. It must not disappear when
       the browser reports prefers-reduced-motion: that was the root cause of
       the Hero rendering without any pin or video trigger. The automatic
       intro above still uses the motion preference, but the scroll timeline
       remains available and has no autoplay, easing, or forced wheel input. */
    if (!root || !video || !videoEnabled || !videoReady) return;

    let cleanup: (() => void) | undefined;
    let ready = false;
    let seekFrame = 0;
    let pendingTime: number | null = null;
    let lastRequestedTime = -1;

    const flushSeek = () => {
      seekFrame = 0;
      if (pendingTime === null) return;

      const targetTime = pendingTime;
      if (
        Math.abs(video.currentTime - targetTime) <= 0.008 ||
        Math.abs(lastRequestedTime - targetTime) <= 0.008
      ) {
        return;
      }

      lastRequestedTime = targetTime;
      video.currentTime = targetTime;
    };

    const scheduleSeek = () => {
      if (seekFrame) return;
      seekFrame = window.requestAnimationFrame(flushSeek);
    };

    const setup = () => {
      if (ready || !video.duration || !Number.isFinite(video.duration)) return;
      ready = true;
      video.pause();
      video.currentTime = 0;

      const content = root.querySelector<HTMLElement>("[data-hero-content]");
      const exitEase = gsap.parseEase("power3.inOut");
      const pacingPxPerSecond = 520;
      const getEndDistance = () =>
        Math.max(window.innerHeight * 1.5, video.duration * pacingPxPerSecond);
      const setScrollRunway = () => {
        if (!shell) return;
        shell.style.height = `${window.innerHeight + getEndDistance()}px`;
      };

      /* The pinned stage is exactly one viewport tall. Its block wrapper owns
         the scroll runway so the next chapter cannot enter the flow while the
         stage is pinned. This also avoids border-box flex sizing collapsing
         ScrollTrigger's generated spacer to one viewport. */
      setScrollRunway();

      const ctx = gsap.context(() => {
        const master = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${getEndDistance()}`,
            pin: true,
            pinSpacing: true,
            /* Hero text and video must share the exact same scroll progress.
               A smoothed scrub lagged behind the pin at the boundary and made
               the exit transform visibly snap when reversing direction. */
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onRefreshInit: setScrollRunway,
            onUpdate: (self) => {
              const progress = gsap.utils.clamp(0, 1, self.progress);
              const finalTime = Math.max(0, video.duration - 0.03);
              const targetTime = progress >= 0.999 ? finalTime : progress * finalTime;

              pendingTime = targetTime;
              scheduleSeek();

              /* Đưa chữ ra khỏi khung bằng chính progress của master trigger.
                 Không dùng thêm tween con: tween con bị scrub trễ và tranh
                 transform với pin khi Hero giao với Part 02. */
              if (content) {
                const exitProgress = gsap.utils.clamp(0, 1, (progress - 0.7) / 0.3);
                const easedExit = exitEase(exitProgress);
                const distance =
                  content.offsetLeft +
                  content.offsetWidth +
                  window.innerWidth * 0.06;
                gsap.set(content, { x: -distance * easedExit });
              }
            },
            onLeave: () => {
              pendingTime = null;
              video.pause();
              video.currentTime = Math.max(0, video.duration - 0.03);
              if (content) {
                const distance =
                  content.offsetLeft +
                  content.offsetWidth +
                  window.innerWidth * 0.06;
                gsap.set(content, { x: -distance });
              }
            },
            onEnterBack: () => video.pause(),
          },
        });

        ScrollTrigger.refresh();
        cleanup = () => {
          master.scrollTrigger?.kill();
          if (content) gsap.set(content, { clearProps: "x" });
          ctx.revert();
        };
      }, root);
    };

    if (video.readyState >= 1 && Number.isFinite(video.duration)) setup();
    video.addEventListener("loadedmetadata", setup);
    video.addEventListener("durationchange", setup);

    return () => {
      video.removeEventListener("loadedmetadata", setup);
      video.removeEventListener("durationchange", setup);
      if (seekFrame) window.cancelAnimationFrame(seekFrame);
      pendingTime = null;
        if (shell) shell.style.height = "";
      cleanup?.();
      };
    /* Cùng lý do: `videoEnabled` không đổi trong một phiên desktop, còn trên
       điện thoại effect tự thoát sớm vì không có thẻ video. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVideo, videoReady]);

  return (
    <div ref={shellRef} className="relative block">
      <section
        ref={rootRef}
        id="chapter-01"
        aria-labelledby="hero-title"
        data-scene="scene-01-flag"
        data-cinematic-hero
        className="relative isolate flex min-h-[100svh] min-h-[100dvh] flex-col justify-center overflow-hidden bg-[#08080A]"
      >
      {hasVideo && !videoReady ? (
        <div
          data-hero-loading
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#08080A] px-6 text-paper"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 46%, rgba(200,16,46,0.12) 0%, rgba(8,8,10,0) 58%)",
            }}
          />

          <span
            aria-hidden
            className="pointer-events-none absolute -right-[6vw] top-1/2 -translate-y-1/2 select-none font-display text-[42vw] leading-none text-paper/[0.025] sm:text-[30vw]"
          >
            01
          </span>

          <div aria-hidden className="pointer-events-none absolute inset-4 sm:inset-7">
            <span className="absolute left-0 top-0 size-6 border-l border-t border-paper/15" />
            <span className="absolute right-0 top-0 size-6 border-r border-t border-paper/15" />
            <span className="absolute bottom-0 left-0 size-6 border-b border-l border-paper/15" />
            <span className="absolute bottom-0 right-0 size-6 border-b border-r border-paper/15" />
          </div>

          <div className="relative w-full max-w-md text-center">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-gold">
              Địa Chỉ Đỏ · Phòng 01
            </p>

            <h2 className="mt-5 text-balance font-display text-[clamp(2rem,5.4vw,3.1rem)] uppercase leading-[1.05] text-paper">
              Đang chuẩn bị thước phim
            </h2>

            <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
              Cờ đỏ · Sài Gòn
            </p>

            <div
              className="mt-9 h-px w-full overflow-hidden bg-line-strong"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(videoProgress * 100)}
              aria-label="Tiến độ tải thước phim"
            >
              <span
                className="block h-full bg-gradient-to-r from-flag-red to-gold transition-[width] duration-300 ease-out"
                style={{ width: `${Math.round(videoProgress * 100)}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-faint">
              <span className="tabular-nums text-paper-mute">
                {Math.round(videoProgress * 100)}%
              </span>
              <span>Không có âm thanh</span>
            </div>

            <button
              type="button"
              onClick={() => {
                const video = rootRef.current?.querySelector<HTMLVideoElement>(
                  "[data-scroll-scrub='true']",
                );
                video?.pause();
                setMediaReady(true);
              }}
              className="mt-9 inline-flex min-h-11 items-center justify-center gap-2 border border-line-strong px-5 py-3 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper-mute transition-colors duration-300 hover:border-flag-red hover:text-gold"
            >
              Tiếp tục với nền dự phòng
              <span aria-hidden>→</span>
            </button>
          </div>

          <div
            aria-hidden
            className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 font-mono text-[0.54rem] uppercase tracking-[0.22em] text-paper-faint sm:inset-x-7 sm:bottom-7"
          >
            <span>Địa Chỉ Đỏ · Digital Museum</span>
            <span>Tự phát · Không âm thanh</span>
          </div>
        </div>
      ) : null}
      <noscript>
        <style>{`[data-hero-loading]{display:none!important}`}</style>
      </noscript>
      {/*
        KHÔNG CÓ JAVASCRIPT ⇒ bỏ ẩn tiêu đề, ẩn lá cờ. Không nội dung nào
        bị ẩn vĩnh viễn.
      */}
      <noscript>
        <style>{`
          [data-hero-line], [data-hero-intro] { opacity: 1 !important; transform: none !important; }
          [data-hero-flag] { display: none !important; }
        `}</style>
      </noscript>

      {/* ══ NỀN + ÁNH SÁNG ĐỎ TIẾT CHẾ ═══════════════════════════════════
          Một nền gần đen liên tục. KHÔNG có dải chuyển màu ngang — đó chính
          là thứ tạo cảm giác "poster đỏ" ở bản trước. Quầng sáng đỏ nằm
          phía sau lá cờ như một nguồn sáng trong bóng tối, nên khi lá cờ rời
          đi thì ánh sáng vẫn còn lại cho Phase 2. */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "transparent",
        }}
      />

      {/* ══ PHASE 4 — KHÍ QUYỘN THÀNH PHỐ (lộ ra khi cuộn) ═══════════════ */}
      <div
        ref={cityRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] opacity-0"
      >
        <SceneBackdrop sceneId="scene-02-city" />
      </div>

      {/* ══ PHASE 2 + 3 — TIÊU ĐỀ VÀ HÀNH ĐỘNG ══════════════════════════════
          Một CỘT thuộc lề trái, canh giữa ngang trang: cân bằng mà vẫn giữ
          thế dọc biên tập. Không còn nửa trang trống trơn như bản trước. */}
      <div
        data-hero-content
        className="relative z-10 mx-auto flex min-h-[100svh] min-h-[100dvh] w-full max-w-[90rem] flex-1 flex-col justify-center px-5 pb-24 pt-28 sm:px-8 sm:pb-28 sm:pt-32 lg:px-12 xl:px-16"
      >
        <div className="w-full max-w-[54rem] text-left">
          <p
            data-hero-intro
            className="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.32em] text-gold sm:text-[0.68rem]"
          >
            <span aria-hidden className="h-px w-12 bg-gold/70" />
            Sài Gòn · Hành trình qua ký ức
          </p>

          {/* Tiêu đề — ô cắt chừa chỗ cho dấu tiếng Việt. */}
          <h1
            id="hero-title"
            className="mt-5 max-w-[10ch] font-display uppercase text-paper text-cinematic sm:mt-6 sm:max-w-none"
          >
            <span className="block overflow-clip [overflow-clip-margin:1.4em]">
              <span
                data-hero-line
                className="block text-[length:var(--text-display)] leading-[0.98] tracking-[-0.02em]"
              >
                ĐỊA CHỈ ĐỎ
              </span>
            </span>
          </h1>

          {/* Vệt sáng quét ngang tiêu đề khi chữ vừa đáp. */}
          <span
            ref={sweepRef}
            aria-hidden="true"
            className="pointer-events-none mt-4 block h-px w-24 origin-left opacity-0 sm:mt-5"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(212,176,120,0.85) 50%, transparent 100%)",
            }}
          />

          {/* Phụ đề dự án. */}
          <p
            data-hero-intro
            className="mt-7 max-w-xl text-balance font-mono text-[0.68rem] uppercase leading-relaxed tracking-[0.2em] text-gold sm:text-[0.78rem]"
          >
            Khát vọng độc lập cho thành phố
          </p>

          <p
            data-hero-intro
            className="mt-7 max-w-[46ch] text-pretty text-[0.9rem] leading-[1.75] text-paper-mute sm:text-[0.98rem]"
          >
            Mỗi địa chỉ là một dấu mốc. Mỗi di tích là một câu chuyện.
          </p>

          {/* Hành động — MỘT nút chính + MỘT liên kết phụ. */}
          <div
            data-hero-intro
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 sm:mt-12"
          >
            <Button href="/ban-do" size="lg" className="sm:min-w-52">
              Bắt đầu khám phá
            </Button>

            <Link
              href="/gioi-thieu"
              className="group inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-paper-dim transition-colors duration-300 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Tìm hiểu dự án
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Chỉ dẫn cuộn — con lăn nhấp nháy trong biểu tượng chuột.

            DỜI LÊN để nhường chỗ ở đáy giữa cho nút auto-scroll
            (`AutoScrollControl`, `bottom-0` + `size-11`). Hai thứ cùng nằm
            giữa theo trục dọc sẽ chồng lên nhau: nút chiếm ~44px kể từ đáy,
            cộng 12px đệm, nên dải dưới 4.5rem là vùng của nút.

            Nhãn chữ "Cuộn để đi tiếp" đổi sang `ScrollSpeedHint`: khi con lăn
            quay nhanh hơn trần tốc độ cho phép, chính chỗ này nói "Từ từ
            thôi" — người xem hiểu vì sao trang đi chậm. */}
        <div
          data-hero-intro
          data-hero-scroll-cue
          className="absolute bottom-[4.75rem] left-1/2 flex -translate-x-1/2 items-center gap-3 sm:bottom-[5.25rem]"
        >
          <span aria-hidden className="block h-8 w-6 text-paper-faint">
            <svg viewBox="0 0 24 32" fill="none" className="h-full w-full">
              <rect
                x="3.5"
                y="1.5"
                width="17"
                height="29"
                rx="8.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <circle
                cx="12"
                cy="10"
                r="1.7"
                fill="currentColor"
                className="animate-[cue-wheel_2s_ease-in-out_infinite] text-gold"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            </svg>
          </span>
          <ScrollSpeedHint />
          <Link
            href="#chapter-02"
            aria-label="Bỏ qua giới thiệu, tới chương kế tiếp"
            className="sr-only"
          >
            Bỏ qua giới thiệu
          </Link>
        </div>
      </div>

      {/* ══ PHASE 1 — LÁ CỜ ═══════════════════════════════════════════════
          Khi đã có tệp video thì video chiếm trọn khung hình. Khi chưa có,
          lá cờ dựng bằng SVG đứng như một vật thể trong không gian tối —
          đúng tỉ lệ 2:3, được soi sáng từ góc trên-trái, có bóng đổ riêng
          để đọc ra là vật thể chứ không phải hình nền. */}
      <div
        ref={flagLayerRef}
        aria-hidden="true"
        data-hero-flag=""
        className={`pointer-events-none absolute inset-0 ${hasVideo ? "z-0" : "z-20"}`}
      >
        {hasVideo && scene ? (
          <SceneMedia scene={scene} scrollScrub allowOnMobile />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div
              ref={flagObjectRef}
              className="relative h-[44vh] max-h-[440px] min-h-[220px] w-auto aspect-[2/3] overflow-hidden"
              style={{
                boxShadow:
                  "0 50px 120px -40px rgba(0,0,0,0.95), 0 0 120px -30px rgba(200,16,46,0.30)",
              }}
            >
              <VietnamFlag
                fabric
                className="motion-safe:animate-[dd-flag-drift_17s_ease-in-out_infinite]"
              />

              {/* Ánh sáng xiên từ góc trên-trái — làm vải có khối. */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 72% 62% at 28% 20%, rgba(255,255,255,0.17) 0%, rgba(255,255,255,0.04) 38%, rgba(255,255,255,0) 66%)",
                }}
              />

              {/* Viền tối — tách vật thể khỏi nền. */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 120% 120% at 50% 50%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.45) 88%, rgba(0,0,0,0.62) 100%)",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ══ BỎ QUA MỞ ĐẦU ═════════════════════════════════════════════════
          Đặt ở góc trên-trên, tách khỏi khối chữ ở giữa nên không bao giờ
          đè lên nhau ở bất kỳ khung nhìn nào. Là `<a href>` thật nên khi
          JavaScript không chạy nó vẫn nhảy tới nội dung. */}
      <a
        href="#chapter-02"
        onClick={() => {
          markIntroSeen();
          setSkipped(true);
        }}
        className="absolute right-5 top-[4.75rem] z-30 inline-flex items-center gap-2 border border-line-strong/70 bg-ink/60 px-3 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-paper-mute backdrop-blur-sm transition-colors duration-300 hover:border-flag-red/70 hover:text-flag-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:right-8 sm:top-[5.5rem] lg:right-12"
      >
        Bỏ qua mở đầu
        <span aria-hidden>↓</span>
      </a>
      </section>
    </div>
  );
}
