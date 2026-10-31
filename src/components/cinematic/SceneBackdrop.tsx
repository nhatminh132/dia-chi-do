import type { SceneId } from "@/data/types";
import { cn } from "@/lib/utils";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  LỚP A — LỚP NỀN TĨNH (FALLBACK)
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Khi một cảnh chưa có clip video (hoặc clip lỗi / người dùng bật giảm
 *  chuyển động / màn hình hẹp), lớp nền này đóng vai trò khí quyển.
 *
 *  ── Vì sao phải có ───────────────────────────────────────────────────────
 *
 *  Thiếu video KHÔNG ĐƯỢC PHÉP trở thành một mảng đen. Một bảo tàng mà
 *  phòng trưng bày bị tối đen thì không phải bảo tàng, đó là lỗi.
 *
 *  Vì vậy mỗi cảnh có một bức phông nền riêng, dựng bằng gradient thuần:
 *  không file ngoài, không request, không phụ thuộc mạng, không bao giờ hỏng.
 *
 *  ── Quy tắc ──────────────────────────────────────────────────────────────
 *
 *  Đây là HỌA TIẾET TRANG TRÍ — không phải ảnh tư liệu, không phải bằng
 *  chứng lịch sử. Nên nó luôn mang `data-illustrative="true"` và
 *  `aria-hidden="true"`: bất kỳ ai đọc DOM cũng phân biệt được ngay đâu là
 *  hình ảnh có thật, đâu là không khí.
 *
 *  Không có hình ai tạo ở đây cả — toàn bộ là gradient, lưới và vệt sáng
 *  hình học. Không có nội dung lịch sử nào được gợi ý.
 */

export function SceneBackdrop({
  sceneId,
  className,
}: {
  sceneId: SceneId;
  className?: string;
}) {
  return (
    <div
      data-illustrative="true"
      data-scene-backdrop={sceneId}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-ink-900",
        className,
      )}
    >
      {BACKDROP[sceneId]}
    </div>
  );
}

/* -------------------------------------------------------------------------
 *  Phông nền từng cảnh
 *  ------------------------------------------------------------------------- */

const BACKDROP: Record<SceneId, React.ReactNode> = {
  /* 01 — Cờ đỏ: sân khấu tối phía DƯỚI lá cờ. Phải thật tối — nếu nền
     cũng đỏ, lá cờ sẽ chìm vào nền và mất hẳn mặt cờ. Lá cờ thật được
     dựng riêng bởi `Hero` (Scene 01), không phải ở đây. */
  "scene-01-flag": (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 46% at 50% 100%, #40101A 0%, #1A0A0D 46%, #0A0A0A 78%, #08080A 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(104deg, rgba(242,235,221,0.06) 0 1px, transparent 1px 13px)",
        }}
      />
    </>
  ),

  /* 02 — Thành phố: quầng sáng chân trời, hai tia sáng dọc, lớp sương mỏng
     ở giữa tạo chiều sâu. */
  "scene-02-city": (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 34% at 50% 88%, rgba(200,16,46,0.30) 0%, rgba(200,16,46,0) 70%), radial-gradient(ellipse 90% 60% at 50% 100%, #241016 0%, #101013 58%, #0A0A0A 100%)",
        }}
      />
      {/* Tia sáng dọc — gợi ý các tòa nhà và khe sáng. */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0 18%, rgba(242,235,221,0.55) 18.4% 19.2%, transparent 19.6% 44%, rgba(242,235,221,0.35) 44.3% 44.9%, transparent 45.3% 72%, rgba(242,235,221,0.45) 72.3% 73%, transparent 73.4% 100%)",
        }}
      />
      {/* Đường chân trời. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.55) 46%, transparent 100%)",
        }}
      />
    </>
  ),

  /* 03 — Kho lưu trữ: MỘT nguồn sáng kiểm soát từ trên xuống, xung quanh
     tối. Đây là hình học của một vòng đèn treo trên bàn làm việc. */
  "scene-03-archive": (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42% 34% at 50% 26%, rgba(255,215,0,0.20) 0%, rgba(255,215,0,0.05) 42%, transparent 72%), linear-gradient(to bottom, #0B0B0C 0%, #0A0A0A 100%)",
        }}
      />
      {/* Vệt sáng hình nón từ trên xuống. */}
      <div
        className="absolute left-1/2 top-0 h-[78%] w-[46%] -translate-x-1/2 opacity-[0.13]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,215,0,0.85) 0%, rgba(255,215,0,0.12) 58%, transparent 100%)",
          clipPath: "polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)",
        }}
      />
      {/* Bàn làm việc. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[26%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(200,16,46,0.07) 0%, rgba(10,10,10,0.9) 42%, #0A0A0A 100%)",
        }}
      />
    </>
  ),

  /* 04 — Dựng lại xưởng in: ánh sáng xiên từ trái, bóng đổ dài sang phải,
     hạt bụi trong luồng sáng. */
  "scene-04-resistance": (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(104deg, rgba(255,215,0,0.20) 0%, rgba(255,215,0,0.05) 26%, transparent 52%), linear-gradient(to bottom, #0C0A0A 0%, #0A0A0A 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.20]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 38%, rgba(242,235,221,0.7) 0%, transparent 5%), radial-gradient(circle at 27% 62%, rgba(242,235,221,0.5) 0%, transparent 4%), radial-gradient(circle at 21% 22%, rgba(242,235,221,0.45) 0%, transparent 3%), radial-gradient(circle at 41% 48%, rgba(242,235,221,0.35) 0%, transparent 3%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 78% 88%, rgba(10,10,10,0.88) 0%, transparent 64%)",
        }}
      />
    </>
  ),

  /* 05 — Bản đồ: lưới toạ độ, đường đồng mức, một vệt mực đỏ ở tâm. */
  "scene-05-map-transition": (
    <>
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #F2EBDD 1px, transparent 1px), linear-gradient(to bottom, #F2EBDD 1px, transparent 1px)",
          backgroundSize: "58px 58px",
        }}
      />
      {/* Vòng đồng mức. */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 46% 52%, transparent 0 12%, rgba(242,235,221,0.5) 12.2% 12.5%, transparent 12.7% 21%, rgba(242,235,221,0.42) 21.2% 21.5%, transparent 21.7% 30%, rgba(242,235,221,0.34) 30.2% 30.5%, transparent 30.7% 40%, rgba(242,235,221,0.26) 40.2% 40.5%, transparent 40.7% 52%)",
        }}
      />
      {/* Vệt mực đỏ. */}
      <div
        className="absolute left-1/2 top-1/2 size-[46vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.28]"
        style={{
          background:
            "radial-gradient(circle at 42% 46%, rgba(200,16,46,0.95) 0%, rgba(200,16,46,0.45) 38%, rgba(94,7,21,0.16) 62%, transparent 78%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 62% at 50% 48%, transparent 0%, rgba(10,10,10,0.72) 78%, rgba(10,10,10,0.96) 100%)",
        }}
      />
    </>
  ),

  /* 06 — Đông Nam Á: quầng sáng khu vực lan ra, các vòng cung vĩ độ. */
  "scene-06-southeast-asia": (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 54% 46% at 50% 46%, rgba(200,16,46,0.26) 0%, rgba(94,7,21,0.10) 46%, transparent 74%), linear-gradient(to bottom, #0D0A0C 0%, #0A0A0A 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 50% 46%, rgba(242,235,221,0.55) 0 1px, transparent 1px 84px)",
        }}
      />
      {/* Điểm sáng khu vực. */}
      <div
        className="absolute left-1/2 top-[46%] size-[30vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,215,0,0.75) 0%, rgba(255,215,0,0.14) 46%, transparent 72%)",
        }}
      />
    </>
  ),

  /* 07 — Phòng trưng bày: ba luồng sáng chiếu riêng lên ba tấm trưng bày,
     nền tối hoàn toàn. */
  "scene-07-finale": (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #0B0B0C 0%, #0A0A0A 58%, #08080A 100%)",
        }}
      />
      {[
        { left: "18%", top: "26%", h: "58%" },
        { left: "50%", top: "18%", h: "66%" },
        { left: "82%", top: "30%", h: "54%" },
      ].map((spot, index) => (
        <div
          key={index}
          className="absolute w-[16%] opacity-[0.15]"
          style={{
            left: spot.left,
            top: spot.top,
            height: spot.h,
            background:
              "linear-gradient(to bottom, rgba(255,215,0,0.85) 0%, rgba(255,215,0,0.16) 46%, transparent 100%)",
            clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
          }}
        />
      ))}
      {/* Vệt sáng nền chung. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 116%, rgba(200,16,46,0.14) 0%, transparent 66%)",
        }}
      />
    </>
  ),
};
