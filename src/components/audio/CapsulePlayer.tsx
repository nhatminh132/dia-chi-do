"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TRACKS, type Track } from "@/data/tracks";
import { useHydrated, useIsHandheld } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CAPSULE — TRÌNH PHÁT NHẠC NỀN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Một viên thuốc nhỏ ở góc dưới bên phải. Thu gọn thì chỉ còn một thanh tròn
 * xích; mở ra thì lộ tên bản nhạc, tiến trình, và các nút điều khiển.
 *
 * ── Vì sao là "capsule" ──────────────────────────────────────────────────
 *
 * Nút phát dạng hình tròn hay dạng hộp vuông đều giống một nút bình thường,
 * nên bị lẫn vào giao diện. Hình viên thuốc — bo tròn hai đầu — đọc là một
 * vật thể khác: đồ vật trong không gian, không phải điều khiển trên màn
 * hình. Nó nên tồn tại như một vật thể trong phòng triển lãm, và người xem
 * chọn có để ý đến nó hay không.
 *
 * ── Nhạc nền KHÔNG dừng khi điều hướng ──────────────────────────────────
 *
 * Một bảo tàng không tắt nhạc nền khi bạn đi sang phòng khác. Nhạc nền đi
 * cùng bạn. Vì vậy player nằm NGOÀI cây trang (trong `layout.tsx`) và giữ
 * nguyên trạng thái khi route đổi.
 *
 * ── Nguyên tắc không tự phát ─────────────────────────────────────────────
 *
 * Trình duyệt chặn phát âm thanh tự động. Player vì thế KHÔNG tự phát khi
 * tải trang — người xem phải bấm. Nút phát ở trạng thái "sẵn sàng" là lời
 * mời, không phải lỗi.
 *
 * ── Bản nâng cấp ─────────────────────────────────────────────────────────
 *
 *  • Nhớ âm lượng, trạng thái tắt tiếng, chế độ lặp và bản đang chọn.
 *  • Media Session: tai nghe, bàn phím media, màn hình khoá điều khiển được.
 *  • Thanh tiến trình hiển thị cả khi thu gọn; tua và âm lượng có thanh
 *    trượt riêng thay vì slider mặc định của trình duyệt.
 *  • Lặp một bài / lặp danh sách / phát ngẫu nhiên (chỉ hiện khi có từ 2 bài).
 *  • Báo lỗi rõ ràng khi tệp âm thanh không tải được, kèm nút thử lại.
 *
 * ── TẮT HẲN TRÊN BẢN CẦM TAY ─────────────────────────────────────────────
 *
 * Điện thoại: không render gì cả. Không chỉ ẩn bằng CSS — `CapsulePlayer`
 * trả `null` trước khi mount, nên không có thẻ `<audio>`, không tải tệp
 * nhạc, không giành vùng chạm ở đáy màn hình (vốn đã chật vì thanh địa chỉ
 * của trình duyệt). Nhạc nền là trải nghiệm nghe chủ động; trên loa điện
 * thoại nó chỉ tranh chấp với tiếng của người xem.
 */

type RepeatMode = "off" | "all" | "one";

const STORAGE_KEY = "dia-chi-do:player";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function readStoredState(): {
  volume?: number;
  muted?: boolean;
  repeat?: RepeatMode;
  shuffle?: boolean;
  index?: number;
} {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Record<string, unknown>;
    return {
      volume:
        typeof data.volume === "number" ? clamp01(data.volume) : undefined,
      muted: typeof data.muted === "boolean" ? data.muted : undefined,
      repeat:
        data.repeat === "off" || data.repeat === "all" || data.repeat === "one"
          ? data.repeat
          : undefined,
      shuffle: typeof data.shuffle === "boolean" ? data.shuffle : undefined,
      index: Number.isInteger(data.index) ? Number(data.index) : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Cổng cầm tay: quyết định TRƯỚC khi component trình phát được mount.
 *
 * Tách hai lớp vì hook `useIsHandheld()` phải chạy vô điều kiện — không thể
 * `return null` sớm trong cùng một component còn nhiều hook phía sau.
 */
export function CapsulePlayer() {
  /* `useHydrated()` để bản cầm tay KHÔNG bao giờ mount trình phát kể cả
     trong một khung hình: `useIsHandheld()` trả `false` ở lần render đầu
     (server snapshot), nếu chỉ hỏi nó thì thẻ <audio> đã kịp được tạo rồi
     mới bị gỡ. */
  const hydrated = useHydrated();
  const handheld = useIsHandheld();
  if (!hydrated || handheld) return null;
  return <CapsulePlayerInner />;
}

function CapsulePlayerInner() {
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.55);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("all");
  const [shuffle, setShuffle] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const audio = useRef<HTMLAudioElement | null>(null);
  const onEndRef = useRef<() => void>(() => {});

  const tracks = TRACKS;
  const track: Track | undefined = tracks[index];
  const hasTrack = Boolean(track);
  const canSwitch = tracks.length > 1;

  /* ── Khôi phục lựa chọn đã lưu (chỉ sau khi mount) ────────────────── */
  useEffect(() => {
    const stored = readStoredState();
    /* eslint-disable react-hooks/set-state-in-effect -- đọc localStorage một lần sau mount; không thể khởi tạo state bằng window khi SSR */
    if (typeof stored.volume === "number") setVolume(stored.volume);
    if (typeof stored.muted === "boolean") setMuted(stored.muted);
    if (stored.repeat) setRepeat(stored.repeat);
    if (typeof stored.shuffle === "boolean") setShuffle(stored.shuffle);
    if (typeof stored.index === "number" && stored.index < tracks.length) {
      setIndex(stored.index);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [tracks.length]);

  /* ── Ghi lựa chọn ──────────────────────────────────────────────────── */
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ volume, muted, repeat, shuffle, index }),
      );
    } catch {
      /* Chế độ riêng tư chặn localStorage — bỏ qua, player vẫn chạy. */
    }
  }, [volume, muted, repeat, shuffle, index]);

  /* ── Báo cho các capsule khác biết player đang mở ─────────────────── */
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent<boolean>("dia-chi-do:player-expanded", {
        detail: expanded,
      }),
    );
  }, [expanded]);

  /* ── Phần tử audio ─────────────────────────────────────────────────── */
  useEffect(() => {
    const el = new Audio();
    el.preload = "metadata";
    el.loop = tracks.length <= 1;
    audio.current = el;

    const onTime = () => {
      const time = el.currentTime;
      setCurrentTime(time);
      if ("mediaSession" in navigator && el.duration > 0) {
        try {
          navigator.mediaSession.setPositionState({
            duration: el.duration,
            position: Math.min(time, el.duration),
            playbackRate: el.playbackRate,
          });
        } catch {
          /* Một số trình duyệt từ chối khi metadata chưa sẵn sàng. */
        }
      }
    };
    const onMeta = () => {
      setDuration(Number.isFinite(el.duration) ? el.duration : 0);
      setReady(true);
      setFailed(false);
    };
    const onError = () => {
      setReady(false);
      setFailed(true);
      setPlaying(false);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => onEndRef.current();

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("error", onError);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("error", onError);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      audio.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Nạp bản nhạc hiện tại ──────────────────────────────────────────── */
  useEffect(() => {
    const el = audio.current;
    if (!el || !track) return;

    el.src = track.src;
    el.load();
    setCurrentTime(0);
    setDuration(0);
    setReady(false);
    setFailed(false);

    if (playing) {
      void el.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, track?.src]);

  /* ── Âm lượng ──────────────────────────────────────────────────────── */
  useEffect(() => {
    if (audio.current) audio.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const startPlayback = useCallback(() => {
    const el = audio.current;
    if (!el) return;
    void el.play().catch((reason: unknown) => {
      setPlaying(false);
      if (!(reason instanceof DOMException) || reason.name !== "NotAllowedError") {
        setFailed(true);
      }
    });
  }, []);

  const toggle = useCallback(() => {
    const el = audio.current;
    if (!el || !track) return;
    if (el.paused) {
      if (failed) {
        setFailed(false);
        el.load();
      }
      startPlayback();
    } else {
      el.pause();
    }
  }, [failed, startPlayback, track]);

  const step = useCallback(
    (delta: 1 | -1) => {
      if (tracks.length <= 1) return;
      setIndex((current) => {
        if (shuffle) {
          let next = current;
          while (next === current) {
            next = Math.floor(Math.random() * tracks.length);
          }
          return next;
        }
        return (current + delta + tracks.length) % tracks.length;
      });
    },
    [shuffle, tracks.length],
  );

  const seek = useCallback((value: number) => {
    const el = audio.current;
    if (!el) return;
    const limit = Number.isFinite(el.duration) ? el.duration : value;
    const next = Math.min(Math.max(value, 0), limit);
    el.currentTime = next;
    setCurrentTime(next);
  }, []);

  /* ── Hành vi khi hết bài (dùng ref để không gắn lại listener) ─────── */
  useEffect(() => {
    onEndRef.current = () => {
      const el = audio.current;
      if (!el) return;

      if (repeat === "one" || tracks.length <= 1) {
        el.currentTime = 0;
        void el.play().catch(() => setPlaying(false));
        return;
      }

      const atLast = index === tracks.length - 1;
      if (!atLast || shuffle) {
        step(1);
        return;
      }
      if (repeat === "all") {
        setIndex(0);
        return;
      }
      el.currentTime = 0;
      setPlaying(false);
    };
  }, [index, repeat, shuffle, step, tracks.length]);

  /* ── Media Session — điều khiển từ tai nghe, bàn phím, màn hình khoá ─ */
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) {
      return;
    }
    const session = navigator.mediaSession;

    if (track) {
      try {
        session.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist ?? "Địa Chỉ Đỏ",
          album: "Địa Chỉ Đỏ",
        });
      } catch {
        /* MediaMetadata không có trong trình duyệt cũ. */
      }
    }

    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => startPlayback()],
      ["pause", () => audio.current?.pause()],
      ["previoustrack", () => step(-1)],
      ["nexttrack", () => step(1)],
      [
        "seekbackward",
        (details) => {
          const el = audio.current;
          if (el) seek(el.currentTime - (details.seekOffset ?? 10));
        },
      ],
      [
        "seekforward",
        (details) => {
          const el = audio.current;
          if (el) seek(el.currentTime + (details.seekOffset ?? 10));
        },
      ],
      [
        "seekto",
        (details) => {
          if (typeof details.seekTime === "number") seek(details.seekTime);
        },
      ],
    ];

    for (const [action, handler] of handlers) {
      try {
        session.setActionHandler(action, handler);
      } catch {
        /* Trình duyệt không hỗ trợ hành động này. */
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          session.setActionHandler(action, null);
        } catch {
          /* Bỏ qua. */
        }
      }
    };
  }, [seek, startPlayback, step, track]);

  const fmt = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const r = Math.floor(seconds % 60);
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  const progress = duration > 0 ? clamp01(currentTime / duration) : 0;
  const volumeLevel = muted ? 0 : volume;

  const sliderBackground = (level: number) =>
    `linear-gradient(to right, var(--color-flag-red) ${level * 100}%, var(--color-line-strong) ${level * 100}%)`;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-start px-2 pb-2 sm:px-3 sm:pb-3"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div
        className={cn(
          "pointer-events-auto relative overflow-hidden border border-line-strong bg-ink-950/92 backdrop-blur-xl",
          "transition-[width,border-radius] duration-500 ease-cinematic",
          expanded
            ? "w-[min(18.5rem,calc(100vw-1.5rem))] rounded-[1.4rem]"
            : "w-[9.75rem] rounded-full",
        )}
        style={{ boxShadow: "0 18px 50px -18px rgba(0,0,0,0.85)" }}
      >
        {/* ── Thanh thu gọn ───────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? "Thu gọn trình phát nhạc" : "Mở trình phát nhạc"}
          className={cn(
            "group flex w-full items-center rounded-full text-left transition-[padding] duration-500 ease-cinematic",
            expanded ? "gap-3 px-3 py-2" : "gap-2.5 px-3 py-1.5",
          )}
        >
          <span className="min-w-0 flex-1">
            <span className="block whitespace-nowrap font-mono text-[0.52rem] uppercase tracking-[0.24em] text-paper-faint">
              {failed ? "Lỗi âm thanh" : expanded ? "Ambience" : "Nhạc nền"}
            </span>
            {expanded ? (
              <span className="block truncate whitespace-nowrap font-mono text-[0.64rem] uppercase tracking-[0.1em] text-paper">
                {hasTrack ? track.title : "Chưa có bản nhạc"}
              </span>
            ) : null}
          </span>

          {expanded && ready && duration > 0 ? (
            <span className="shrink-0 font-mono text-[0.55rem] tabular-nums text-paper-faint">
              {fmt(currentTime)}
            </span>
          ) : null}

          <span
            aria-hidden
            className={cn(
              "grid shrink-0 place-items-center rounded-full border border-line-strong text-paper-faint",
              "transition-[transform,border-color,color] duration-500 ease-cinematic group-hover:border-line-strong group-hover:text-paper",
              expanded ? "size-6 rotate-180" : "size-5 rotate-0",
            )}
          >
            <svg width="9" height="5" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </button>

        {/* Thanh tiến trình mảnh, luôn hiện — kể cả khi thu gọn */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-line/70">
          <div
            className="h-full bg-flag-red transition-[width] duration-200 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* ── Bảng mở rộng — luôn mount, nở bằng grid-rows để mượt ────── */}
        <div
          aria-hidden={!expanded}
          inert={!expanded}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-500 ease-cinematic",
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={cn(
                "border-t border-line px-3.5 pb-3.5 pt-2.5 transition-transform duration-500 ease-cinematic",
                expanded ? "translate-y-0" : "-translate-y-1.5",
              )}
            >
            {hasTrack ? (
              <>
                <p
                  className="truncate font-mono text-[0.56rem] uppercase tracking-[0.18em] text-paper-faint"
                  aria-live="polite"
                >
                  {track.artist ?? "Không rõ tác giả"}
                </p>

                {failed ? (
                  <div className="mt-2.5 flex items-center justify-between gap-3 border border-flag-deep bg-flag-deep/25 px-2.5 py-1.5">
                    <p className="text-[0.72rem] leading-snug text-paper-mute">
                      Không tải được tệp âm thanh.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const el = audio.current;
                        if (!el) return;
                        setFailed(false);
                        el.load();
                        startPlayback();
                      }}
                      className="shrink-0 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-flag-bright hover:text-paper"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : null}

                {/* Tiến trình */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-8 shrink-0 text-right font-mono text-[0.58rem] tabular-nums text-paper-faint">
                    {fmt(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={Math.min(currentTime, duration || 0)}
                    onChange={(e) => seek(Number(e.target.value))}
                    disabled={!ready || failed}
                    aria-label="Vị trí phát"
                    className="range-capsule h-[3px] min-w-0 flex-1"
                    style={{ background: sliderBackground(progress) }}
                  />
                  <span className="w-8 shrink-0 font-mono text-[0.58rem] tabular-nums text-paper-faint">
                    {fmt(duration)}
                  </span>
                </div>

                {/* Điều khiển */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {canSwitch ? (
                      <button
                        type="button"
                        onClick={() => setShuffle((v) => !v)}
                        aria-pressed={shuffle}
                        aria-label="Phát ngẫu nhiên"
                        title="Phát ngẫu nhiên"
                        className={cn(
                          "grid size-7 place-items-center rounded-full transition-colors duration-300",
                          shuffle ? "text-flag-bright" : "text-paper-faint hover:text-paper",
                        )}
                      >
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                          <path d="M2 4h2.3l7 8H14M2 12h2.3l2.2-2.5M9.7 5.5L11.7 4H14" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M11.8 2l2 2-2 2M11.8 10l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => step(-1)}
                      disabled={!canSwitch}
                      aria-label="Bản nhạc trước"
                      className="grid size-7 place-items-center rounded-full text-paper-mute transition-colors duration-300 hover:text-paper disabled:opacity-30"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                        <path d="M11 1.2v9.6L3.4 6 11 1.2zM1.6 1.2h1.2v9.6H1.6z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={toggle}
                      aria-label={playing ? "Tạm dừng" : "Phát nhạc"}
                      className="grid size-9 place-items-center rounded-full border border-flag-red bg-flag-red/15 text-flag-bright transition-colors duration-300 hover:bg-flag-red hover:text-paper"
                    >
                      {playing ? (
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="currentColor" aria-hidden>
                          <rect x="0" y="0" width="4" height="13" />
                          <rect x="8" y="0" width="4" height="13" />
                        </svg>
                      ) : (
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="currentColor" aria-hidden>
                          <path d="M0 0l12 6.5L0 13z" />
                        </svg>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => step(1)}
                      disabled={!canSwitch}
                      aria-label="Bản nhạc tiếp theo"
                      className="grid size-7 place-items-center rounded-full text-paper-mute transition-colors duration-300 hover:text-paper disabled:opacity-30"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                        <path d="M1 1.2v9.6L8.6 6 1 1.2zM9.2 1.2h1.2v9.6H9.2z" />
                      </svg>
                    </button>

                    {canSwitch ? (
                      <button
                        type="button"
                        onClick={() =>
                          setRepeat((mode) =>
                            mode === "all" ? "one" : mode === "one" ? "off" : "all",
                          )
                        }
                        aria-label={
                          repeat === "one"
                            ? "Lặp lại một bài"
                            : repeat === "all"
                              ? "Lặp lại danh sách"
                              : "Không lặp"
                        }
                        title={
                          repeat === "one"
                            ? "Lặp một bài"
                            : repeat === "all"
                              ? "Lặp danh sách"
                              : "Không lặp"
                        }
                        className={cn(
                          "grid size-7 place-items-center rounded-full transition-colors duration-300",
                          repeat === "off" ? "text-paper-faint hover:text-paper" : "text-flag-bright",
                        )}
                      >
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                          <path d="M3 6.5A3.5 3.5 0 016.5 3H12M13 9.5A3.5 3.5 0 019.5 13H4" strokeLinecap="round" />
                          <path d="M10.5 1.5L12.5 3l-2 1.5M5.5 11.5L3.5 13l2 1.5" strokeLinecap="round" strokeLinejoin="round" />
                          {repeat === "one" ? (
                            <text x="8" y="9" textAnchor="middle" fontSize="5.5" fill="currentColor" stroke="none">
                              1
                            </text>
                          ) : null}
                        </svg>
                      </button>
                    ) : null}
                  </div>

                  {/* Âm lượng */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMuted((v) => !v)}
                      aria-pressed={muted}
                      aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
                      title={muted ? "Bật tiếng" : "Tắt tiếng"}
                      className="grid size-7 place-items-center rounded-full text-paper-faint transition-colors duration-300 hover:text-paper"
                    >
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                        <path d="M1 5.2h2.6L7 2v10L3.6 8.8H1z" strokeLinejoin="round" />
                        {volumeLevel > 0.02 ? (
                          <path d="M9.4 4.6a3.6 3.6 0 010 4.8M11.6 2.8a6.4 6.4 0 010 8.4" strokeLinecap="round" />
                        ) : (
                          <path d="M9.6 5.2l3 3.6M12.6 5.2l-3 3.6" strokeLinecap="round" />
                        )}
                      </svg>
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volumeLevel}
                      onChange={(e) => {
                        setVolume(clamp01(Number(e.target.value)));
                        setMuted(false);
                      }}
                      aria-label="Âm lượng"
                      className="range-capsule h-[3px] w-11"
                      style={{ background: sliderBackground(volumeLevel) }}
                    />
                  </div>
                </div>

                {canSwitch ? (
                  <ul className="mt-2.5 max-h-28 overflow-y-auto border-t border-line pt-2">
                    {tracks.map((entry, i) => (
                      <li key={entry.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setIndex(i);
                            if (!playing) startPlayback();
                          }}
                          aria-current={i === index ? "true" : undefined}
                          className={cn(
                            "flex w-full items-baseline gap-3 rounded-sm px-1 py-1.5 text-left transition-colors duration-200 hover:bg-ink-800",
                            i === index ? "text-flag-bright" : "text-paper-mute",
                          )}
                        >
                          <span className="font-mono text-[0.55rem] tabular-nums tracking-[0.14em]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-mono text-[0.62rem] uppercase tracking-[0.1em]">
                            {entry.title}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ) : (
              <div className="py-1">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper-faint">
                  Danh sách trống
                </p>
                <p className="mt-2 text-sm leading-relaxed text-paper-mute">
                  Thêm bản nhạc vào{" "}
                  <code className="font-mono text-[0.72rem] text-flag-bright">src/data/tracks.ts</code>{" "}
                  — player sẽ tự nhận, không cần sửa gì thêm.
                </p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
