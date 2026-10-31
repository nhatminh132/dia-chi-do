"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap/gsap";
import { PLAN_PATH, PLAN_VIEWBOX, ROOMS, roomForPath, type Room } from "@/data/rooms";
import { useGallery } from "./GalleryProvider";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SƠ ĐỒ PHÒNG — MENU CỦA BẢO TÀNG ẢO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Menu ngang ở đầu trang nói cho ta biết CÓ những trang nào. Sơ đồ phòng
 * nói cho ta biết PHÒNG NÀO Ở ĐÂU, phòng nào cạnh phòng nào, và đường đi từ
 * đây sang đó đi qua những gì. Đó là khác biệt giữa một menu và một bảo
 * tàng.
 *
 * ── Vì sao vẽ bằng SVG mà bấm bằng HTML ─────────────────────────────────
 *
 * SVG cho ra hình vẽ tỉ lệ hoàn hảo ở mọi kích thước, nhưng phần tử SVG
 * không phải nút thật — trình đọc màn hình đọc kém, và Tab không nhảy tới.
 *
 * Nên ta vẽ bằng SVG (đẹp, tỉ lệ đúng) và ĐẶT CÁC NÚT HTML thật đè lên
 * trên, trong suốt. Người dùng chuột bấm vào hình; người dùng bàn phím và
 * trình đọc màn hình dùng nút thật. Cùng một phòng, hai đường vào, cùng
 * một hành động.
 *
 * ── Điều hướng bằng phím mũi tên có ý nghĩa KHÔNG GIAN ───────────────────
 *
 * Phím mũi tên KHÔNG dịch "trang trước / trang sau" — chúng dịch theo HƯỚNG
 * trên mặt bằng. Bấm → sẽ đưa bạn sang phòng nằm bên phải, và nếu có
 * nhiều phòng bên phải thì chọn phòng CÙNG HÀNG (cùng cao độ) — giống đi
 * trong một tòa nhà thật.
 */
export function RoomMap() {
  const { mapOpen, closeMap, travelTo } = useGallery();
  const pathname = usePathname();

  const current = roomForPath(pathname);

  const [rendered, setRendered] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  const dialog = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const returnFocus = useRef<HTMLElement | null>(null);

  /* Khoá cuộn trang nền + ghi nhớ phần tử đã mở hộp thoại để trả focus. */
  useEffect(() => {
    if (!mapOpen) return;

    const previous = document.activeElement;
    if (previous instanceof HTMLElement) returnFocus.current = previous;

    const root = document.documentElement;
    const body = document.body;
    const rootOverflow = root.style.overflow;
    const bodyOverflow = body.style.overflow;
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      root.style.overflow = rootOverflow;
      body.style.overflow = bodyOverflow;
      if (returnFocus.current) returnFocus.current.focus();
    };
  }, [mapOpen]);

  /* ---------------------------------------------------------------------
   * Vòng đời mở / đóng
   *
   * Điều chỉnh state TRONG LÚC RENDER (pattern React chính thức) thay vì
   * trong effect — quy tắc `react-hooks/set-state-in-effect` của React
   * Compiler cấm setState đồng bộ trong thân effect.
   * ------------------------------------------------------------------ */

  const [prevOpen, setPrevOpen] = useState(mapOpen);
  if (mapOpen !== prevOpen) {
    setPrevOpen(mapOpen);
    // Khi MỞ: giữ panel trong DOM. Khi ĐÓNG: giữ lại để chạy nét thoát —
    // effect bên dưới sẽ gọi `setRendered(false)` khi nét thoát xong.
    if (mapOpen) setRendered(true);
  }

  // Vào / ra. Dùng `kill()` chứ không `revert()`: revert sẽ đưa mọi thứ về
  // trạng thái trước khi tween chạy, làm nét thoát nhảy ngược lại opacity 0.
  useEffect(() => {
    if (!rendered) return;
    const el = dialog.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (mapOpen) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });

        gsap.fromTo(
          "[data-plan-room]",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: "expo.out" },
        );

        // Đường đi của khách vẽ dần từ sảnh chính ra tận cuối.
        gsap.fromTo(
          "[data-plan-path]",
          { strokeDashoffset: 2400 },
          { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" },
        );
      } else {
        gsap.to(el, {
          opacity: 0,
          duration: 0.28,
          ease: "power2.in",
          onComplete: () => {
            setRendered(false);
            const target = returnFocus.current;
            returnFocus.current = null;
            if (target?.isConnected) target.focus();
          },
        });
      }
    }, el);

    // Đưa tiêu điểm vào phòng đang ở (hoặc phòng đầu tiên) khi mở.
    if (mapOpen) {
      const id = window.setTimeout(() => {
        const idx = current ? ROOMS.findIndex((r) => r.id === current.id) : 0;
        buttons.current[Math.max(0, idx)]?.focus();
      }, 140);
      return () => {
        window.clearTimeout(id);
        ctx.kill();
      };
    }

    return () => ctx.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rendered, mapOpen]);

  /* ---------------------------------------------------------------------
   * Bàn phím
   * ------------------------------------------------------------------ */

  const focusRoom = useCallback((id: string) => {
    const idx = ROOMS.findIndex((r) => r.id === id);
    if (idx >= 0) buttons.current[idx]?.focus();
  }, []);

  /** Phòng gần nhất nằm về hướng `dir` so với phòng `from`. */
  const neighbour = useCallback((from: Room, dir: "up" | "down" | "left" | "right") => {
    const cx = from.x + from.w / 2;
    const cy = from.y + from.h / 2;

    const candidates = ROOMS.filter((r) => {
      if (r.id === from.id) return false;
      const rx = r.x + r.w / 2;
      const ry = r.y + r.h / 2;
      if (dir === "right") return rx > cx + 1;
      if (dir === "left") return rx < cx - 1;
      if (dir === "down") return ry > cy + 1;
      return ry < cy - 1;
    });

    if (!candidates.length) return null;

    // Ưu tiên phòng cùng hàng/cùng cột; nếu không có thì lấy phòng gần nhất
    // theo khoảng cách có trọng số (xa theo hướng chính bị phạt nặng hơn).
    const scored = candidates.map((r) => {
      const rx = r.x + r.w / 2;
      const ry = r.y + r.h / 2;
      const along =
        dir === "right" || dir === "left" ? Math.abs(rx - cx) : Math.abs(ry - cy);
      const across =
        dir === "right" || dir === "left" ? Math.abs(ry - cy) : Math.abs(rx - cx);
      return { room: r, score: along + across * 2.2 };
    });

    scored.sort((a, b) => a.score - b.score);
    return scored[0].room;
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMap();
        return;
      }

      if (event.key === "Tab") {
        // Giam tiêu điểm bên trong hộp thoại.
        const focusables = dialog.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      const dirs: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const dir = dirs[event.key];
      if (!dir) return;

      const focused = document.activeElement as HTMLElement | null;
      const idx = buttons.current.findIndex((b) => b === focused);
      const from = idx >= 0 ? ROOMS[idx] : current;
      if (!from) return;

      const next = neighbour(from, dir);
      if (next) {
        event.preventDefault();
        focusRoom(next.id);
      }
    },
    [closeMap, current, focusRoom, neighbour],
  );

  /* ---------------------------------------------------------------------
   * Chọn phòng
   * ------------------------------------------------------------------ */

  const enter = useCallback(
    (room: Room) => {
      travelTo(room);
    },
    [travelTo],
  );

  const active = activeId ?? focusId ?? current?.id ?? null;
  const activeRoom = useMemo(
    () => ROOMS.find((r) => r.id === active) ?? null,
    [active],
  );

  if (!rendered) return null;

  const { x: vx, y: vy, w: vw, h: vh } = PLAN_VIEWBOX;

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Sơ đồ phòng trưng bày"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink-950"
    >
      {/* ── Đầu ─────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8 lg:px-12">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.34em] text-flag-bright">
            Sơ đồ
          </span>
          <h2 className="font-display text-lg uppercase tracking-[0.06em] text-paper sm:text-xl">
            Mặt bằng trưng bày
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <p className="hidden font-mono text-[0.6rem] uppercase tracking-[0.22em] text-paper-faint md:block">
            ← → để đi · Enter để vào phòng · Esc để đóng
          </p>
          <button
            type="button"
            onClick={closeMap}
            className="grid size-11 place-items-center border border-line-strong text-paper transition-colors duration-300 hover:border-flag-red hover:text-flag-bright"
            aria-label="Đóng sơ đồ phòng"
          >
            <span aria-hidden className="relative block size-4">
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>
      </div>

      {/* ── Mặt bằng ────────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-hidden overscroll-contain">
        <div className="flex min-h-full flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:gap-12 lg:px-12">
          {/* Bản vẽ */}
          <div className="min-w-0 flex-1">
            <div className="w-full">
              <div
                className="relative w-full min-w-0"
                style={{ aspectRatio: `${vw} / ${vh}` }}
              >
                <svg
                  viewBox={`${vx} ${vy} ${vw} ${vh}`}
                  className="absolute inset-0 h-full w-full"
                  role="presentation"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="plan-grid"
                      width="25"
                      height="25"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 25 0 L 0 0 0 25"
                        fill="none"
                        stroke="rgba(240,236,228,0.045)"
                        strokeWidth="1"
                      />
                    </pattern>
                    <radialGradient id="plan-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(200,16,46,0.16)" />
                      <stop offset="100%" stopColor="rgba(200,16,46,0)" />
                    </radialGradient>
                  </defs>

                  <rect x={vx} y={vy} width={vw} height={vh} fill="url(#plan-grid)" />
                  <ellipse
                    cx={vw / 2}
                    cy={vh / 2}
                    rx={vw * 0.44}
                    ry={vh * 0.42}
                    fill="url(#plan-glow)"
                  />

                  {/* Hành lang nối các phòng */}
                  <rect
                    x="60"
                    y="272"
                    width="880"
                    height="28"
                    fill="rgba(240,236,228,0.022)"
                    stroke="rgba(240,236,228,0.09)"
                    strokeWidth="1"
                  />
                  <rect
                    x="60"
                    y="502"
                    width="880"
                    height="38"
                    fill="rgba(240,236,228,0.022)"
                    stroke="rgba(240,236,228,0.09)"
                    strokeWidth="1"
                  />

                  {/* Đường đi của khách — nét đứt chạy qua các phòng */}
                  <polyline
                    data-plan-path
                    points={PLAN_PATH}
                    fill="none"
                    stroke="rgba(200,16,46,0.5)"
                    strokeWidth="1.5"
                    strokeDasharray="7 9"
                    strokeLinecap="round"
                  />

                  {/* Các phòng */}
                  {ROOMS.map((room) => {
                    const isCurrent = room.id === current?.id;
                    const isActive = room.id === active;
                    const doorTop = room.y >= 500;
                    const doorY = doorTop ? room.y : room.y + room.h;
                    // Playfair Display viết hoa rộng hơn con số trung bình —
                    // hệ số 0.8 để tên phòng luôn nằm gọn trong ô, không
                    // tràn sang phòng bên cạnh.
                    const nameSize = Math.max(
                      16,
                      Math.min(30, Math.floor((room.w - 30) / (room.name.length * 0.8))),
                    );

                    return (
                      <g key={room.id} data-plan-room>
                        <rect
                          x={room.x}
                          y={room.y}
                          width={room.w}
                          height={room.h}
                          fill={
                            isActive
                              ? "rgba(200,16,46,0.10)"
                              : isCurrent
                                ? "rgba(240,236,228,0.045)"
                                : "rgba(240,236,228,0.012)"
                          }
                          stroke={
                            isCurrent
                              ? "rgba(200,16,46,0.95)"
                              : isActive
                                ? "rgba(200,16,46,0.6)"
                                : "rgba(240,236,228,0.2)"
                          }
                          strokeWidth={isCurrent ? 2 : 1}
                        />

                        {/* Cửa phòng — khe hở nhỏ trên vách */}
                        <rect
                          x={room.x + room.w / 2 - 16}
                          y={doorY - 1.5}
                          width="32"
                          height="3"
                          fill="rgba(240,236,228,0.35)"
                        />

                        <text
                          x={room.x + room.w / 2}
                          y={room.y + room.h / 2 - 18}
                          textAnchor="middle"
                          className="fill-paper-faint font-mono"
                          fontSize="17"
                          letterSpacing="3"
                        >
                          {room.number}
                        </text>

                        <text
                          x={room.x + room.w / 2}
                          y={room.y + room.h / 2 + 16}
                          textAnchor="middle"
                          className="fill-paper font-display"
                          fontSize={nameSize}
                          letterSpacing="1.5"
                        >
                          {room.name.toUpperCase()}
                        </text>

                        {isCurrent ? (
                          /*
                            Dấu "bạn đang ở đây" đặt ở GÓC trên-phải của
                            phòng, không đặt ở giữa — giữa phòng là chỗ của
                            tên phòng, đặt ở đó thì hai thứ chồng lên nhau và
                            không đọc được cái nào.
                          */
                          <g>
                            <circle
                              cx={room.x + room.w - 22}
                              cy={room.y + 22}
                              r="12"
                              fill="none"
                              stroke="rgba(200,16,46,0.4)"
                              strokeWidth="1.5"
                            />
                            <circle
                              cx={room.x + room.w - 22}
                              cy={room.y + 22}
                              r="5.5"
                              fill="rgba(200,16,46,0.95)"
                            />
                            <text
                              x={room.x + room.w - 22}
                              y={room.y + 46}
                              textAnchor="middle"
                              className="fill-flag-bright font-mono"
                              fontSize="11"
                              letterSpacing="1.5"
                            >
                              BẠN Ở ĐÂY
                            </text>
                          </g>
                        ) : null}
                      </g>
                    );
                  })}

                  {/* Ghi chú bản vẽ */}
                  <text
                    x="60"
                    y="716"
                    className="fill-paper-faint font-mono"
                    fontSize="13"
                    letterSpacing="2.5"
                  >
                    HƯỚNG BẮC ↑
                  </text>
                </svg>

                {/* Nút thật đè lên từng phòng */}
                {ROOMS.map((room, i) => (
                  <button
                    key={room.id}
                    ref={(el) => {
                      buttons.current[i] = el;
                    }}
                    type="button"
                    onClick={() => enter(room)}
                    onMouseEnter={() => setActiveId(room.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onFocus={() => setFocusId(room.id)}
                    onBlur={() => setFocusId(null)}
                    aria-current={room.id === current?.id ? "page" : undefined}
                    aria-label={`Phòng ${room.number}: ${room.name}. ${room.caption}`}
                    className="absolute rounded-none transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flag-bright focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                    style={{
                      left: `${(room.x / vw) * 100}%`,
                      top: `${(room.y / vh) * 100}%`,
                      width: `${(room.w / vw) * 100}%`,
                      height: `${(room.h / vh) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bảng chú thích phòng đang chọn */}
          <aside className="w-full shrink-0 lg:w-[22rem]">
            <div className="border-l border-line pl-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-paper-faint">
                {current ? `Bạn đang ở phòng ${current.number}` : "Chọn một phòng"}
              </p>

              <h3 className="mt-4 font-display text-2xl uppercase leading-tight text-paper">
                {activeRoom ? activeRoom.name : "—"}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-paper-mute">
                {activeRoom
                  ? activeRoom.caption
                  : "Di chuyển con trỏ hoặc dùng phím mũi tên để chọn phòng, rồi bấm Enter để bước vào."}
              </p>

              {/*
                Danh mục phòng — ĐỒNG HÌNH BẢN VẼ, không phải menu thứ hai.

                Cố tình KHÔNG để nút ở đây: nếu cả bản vẽ lẫn danh mục đều
                là nút, trình đọc màn hình sẽ đọc mỗi phòng HAI LẦN, và người
                dùng bàn phím sẽ phải Tab qua 16 phần tử thay vì 8.

                Ở đây chỉ là CHÚ THÍCH cho bản vẽ — như mục "chú thích" của
                một bản vẽ kiến trúc. Muốn vào phòng thì bấm vào chính phòng
                đó trên sơ đồ.
              */}
              <ul className="mt-8 space-y-px" aria-hidden="true">
                {ROOMS.map((room) => {
                  const isCurrent = room.id === current?.id;
                  const isActive = room.id === active;
                  return (
                    <li
                      key={room.id}
                      className="flex items-baseline gap-4 border-l-2 py-1.5 pl-3 transition-colors duration-300"
                      style={{
                        borderLeftColor: isCurrent
                          ? "rgba(200,16,46,0.9)"
                          : isActive
                            ? "rgba(200,16,46,0.4)"
                            : "transparent",
                      }}
                    >
                      <span className="font-mono text-[0.62rem] tracking-[0.16em] text-paper-faint">
                        {room.number}
                      </span>
                      <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-paper-mute">
                        {room.name}
                      </span>
                      {isCurrent ? (
                        <span className="ml-auto font-mono text-[0.55rem] uppercase tracking-[0.2em] text-flag-bright">
                          Đây
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

