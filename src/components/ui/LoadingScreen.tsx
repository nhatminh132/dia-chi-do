/**
 * LOADING SCREEN — "CỬA ĐANG MỞ"
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Hiển thị khi Next.js đang chuẩn bị một route (root `loading.tsx`).
 *
 * Không dùng skeleton: ở bảo tàng, cửa đóng lại vài giây rồi mở ra tự nhiên
 * hơn một trang đang "xây dựng". Không có JavaScript, không có GSAP — chỉ
 * CSS, để không tranh nhịp với Lenis/ScrollTrigger.
 *
 * Mọi chuyển động đều tắt theo `prefers-reduced-motion` trong globals.css.
 */
export function LoadingScreen() {
  return (
    <div className="relative isolate flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-ink-950 px-6 py-28 sm:min-h-[calc(100svh-5rem)]">
      {/* Quầng đỏ rất nhẹ, giữ chất "phòng trưng bày tối". */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 46%, rgba(200,16,46,0.10) 0%, rgba(5,5,5,0) 58%)",
        }}
      />

      {/* Số chương mờ, cắt mép — chất tư liệu chứ không phải trang trí. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[6vw] top-1/2 -translate-y-1/2 select-none font-display text-[42vw] leading-none text-paper/[0.025] sm:text-[30vw]"
      >
        01
      </span>

      {/* Khung ngắm bốn góc. */}
      <div aria-hidden className="pointer-events-none absolute inset-4 sm:inset-7">
        <span className="absolute left-0 top-0 size-6 border-l border-t border-paper/15" />
        <span className="absolute right-0 top-0 size-6 border-r border-t border-paper/15" />
        <span className="absolute bottom-0 left-0 size-6 border-b border-l border-paper/15" />
        <span className="absolute bottom-0 right-0 size-6 border-b border-r border-paper/15" />
      </div>

      <div
        role="status"
        aria-live="polite"
        className="relative w-full max-w-lg text-center"
      >
        <span
          aria-hidden
          className="mx-auto grid size-12 place-items-center border border-flag-red bg-flag-red"
        >
          <svg viewBox="0 0 24 24" className="size-[58%] text-gold" fill="currentColor">
            <path d="m12 2.2 2.26 6.96h7.32l-5.92 4.3 2.26 6.96L12 16.12l-5.92 4.3 2.26-6.96-5.92-4.3h7.32L12 2.2Z" />
          </svg>
        </span>

        <p className="mt-7 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-gold">
          Địa Chỉ Đỏ · Bảo tàng số
        </p>

        <h1 className="mt-5 text-balance font-display text-[clamp(2.2rem,6vw,3.6rem)] uppercase leading-[1.04] text-paper">
          Đang mở cửa
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-pretty text-[0.95rem] leading-relaxed text-paper-mute">
          Phòng trưng bày đang được chuẩn bị. Bạn sẽ được đưa vào ngay khi mọi
          thứ sẵn sàng.
        </p>

        <div
          aria-hidden
          className="mx-auto mt-10 h-px w-full max-w-sm overflow-hidden bg-line-strong"
        >
          <span className="loader-sweep block h-full w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-paper-faint">
          Đang tải nội dung · Vui lòng chờ
        </p>
      </div>

      <div
        aria-hidden
        className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 font-mono text-[0.54rem] uppercase tracking-[0.22em] text-paper-faint sm:inset-x-7 sm:bottom-7"
      >
        <span>Địa Chỉ Đỏ · Digital Museum</span>
        <span>TP. Hồ Chí Minh</span>
      </div>
    </div>
  );
}
