/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  HẠN MỨC TỐC ĐỘ CUỘN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ── Vì sao cần ────────────────────────────────────────────────────────────
 *
 * Lenis áp mỗi sự kiện bánh xe bằng `scrollTo(targetScroll + delta)`. Nghĩa
 * là delta **CỘNG DỒN** vào đích: một cú lăn 5 nấc, hoặc một cái flick
 * trackpad, đẩy đích đi 5 lần ngay trong một khung hình. Với trang thường thì
 * không ai để ý. Với trang này thì rất khác: nền các chương là clip được
 * `scrollScrub` theo cùng vị trí cuộn, nên đích nhảy một cú lớn là clip nhảy
 * theo một cú lớn — mắt đọc ra là "tua nhanh", khung hình rách.
 *
 * Mọi thứ dưới đây chỉ tồn tại để chặn đúng một điều: **tốc độ cuộn không
 * bao giờ vượt quá một ngưỡng** tính theo px/giây — và chỉ trong vùng có nền
 * clip scrub (Part 01–02 của trang chủ). Ngoài vùng đó bánh xe chạy tự do;
 * phạm vi do `ScrollProvider` quyết định, không nằm ở đây.
 *
 * ── Chỉnh ở đâu ───────────────────────────────────────────────────────────
 *
 * Chỉ hai con số dưới đây. Không nơi nào khác trong dự án được tự clamp tốc
 * độ, để không xảy ra cảnh hai chỗ kẹp hai kiểu rồi triệt tiêu nhau.
 *
 *   maxScrollSpeed   trần tốc độ. 1 viewport cao 900px trong 1.2s ≈ 750px/s.
 *                    Mặc định 900px/s quy ra ~66% viewport/giây — nhanh hơn
 *                    cuộn tay bình thường (400–700px/s) nhưng không phải
 *                    "tua", và scrub clip vẫn còn thời gian vẽ đủ khung.
 *
 *   clampStrategy    "absorb" cắt ngay tại mức trần rồi bỏ phần dư.
 *                    "queue"  giữ phần dư và xả dần ở các khung hình sau —
 *                             cuộn xa như người xem muốn, chỉ chậm hơn.
 *
 *                    Chọn "absorb" vì bản chất lỗi là TUA: người xem muốn
 *                    đi một quãng, không phải đi cùng quãng đó nhưng chậm
 *                    hơn. Trả bằng cách bò tiếp vài giây sau cú lăn còn khó
 *                    chịu hơn là bị cắt.
 */

const PX_PER_SECOND = {
  /**
   * Trần tốc độ cho BÁNH XE / trackpad.
   *
   * Con số này được chọn để TỐC ĐỘ THẬT của bánh xe bằng đúng nút auto-scroll
   * ở mức 1×. Hai đường đi khác nhau nên "px/giây trên giấy" không so trực
   * tiếp được:
   *
   *   • auto-scroll gọi `scrollTo(top, duration 0.18)` MỖI KHUNG HÌNH với đích
   *     chỉ nhích ~20px, nên tween không bao giờ chạy hết và tốc độ thật thấp
   *     hơn nhiều so với 1.200 px/s trên giấy.
   *   • bánh xe đi qua `virtualScroll` rồi `lerp: 0.07`, nên tốc độ thật lại
   *     CAO hơn trần trên giấy.
   *
   * Đo trên trang chủ 1440×900 (Playwright: bánh xe 120px mỗi 6ms, Lenis
   * `smoothWheel: true`, `lerp: 0.07`):
   *
   *     trần 900 px/s  → bánh xe 1.996 px/s   (auto 1× = 571 px/s, gấp 3,5 lần)
   *     trần 260 px/s  → bánh xe   232 px/s
   *     trần 640 px/s  → bánh xe   573 px/s   ← khớp auto 1×
   *
   * Đổi `autoSpeed`, `lerp` hoặc `smoothWheel` thì phải đo lại con số này.
   */
  default: 640,

  /**
   * Nút auto-scroll: đều, để clip có nhịp đọc được. Với viewport cao 900px thì
   * 900/1200 = 0.75 giây cho một màn hình, tức ~4/3 viewport mỗi giây.
   * (Đã tăng gấp đôi so với mức 600px/s ban đầu theo yêu cầu.)
   */
  autoScroll: 1200,
} as const;

/**
 * Các mốc tốc độ của nút auto-scroll, tính theo bội số của `autoScroll`.
 * 1× = 1200 px/s trên giấy (đo thực tế ~554 px/s qua Lenis).
 * Thứ tự tăng dần — component render đúng thứ tự này.
 */
export const AUTO_SCROLL_SPEEDS = [0.5, 1, 1.5, 2] as const;

export type AutoScrollSpeed = (typeof AUTO_SCROLL_SPEEDS)[number];

export type ClampStrategy = "absorb" | "queue";

export const SCROLL_BUDGET: {
  maxSpeed: number;
  autoSpeed: number;
  clampStrategy: ClampStrategy;
} = {
  maxSpeed: PX_PER_SECOND.default,
  autoSpeed: PX_PER_SECOND.autoScroll,
  clampStrategy: "absorb",
};

/**
 * Quãng đường tối đa được phép trong `dtMs` mili giây.
 *
 * `dtMs` luôn được kẹp vào 1..1000 trước khi tính. Kẹp dưới chặn `dt = 0`
 * sinh ra trần bằng 0 (mọi delta bị nuốt sạch); kẹp trên chặn khung hình
 * treo 2 giây biến thành một cú nhảy.
 */
export function maxDistanceFor(dtMs: number, speed: number = SCROLL_BUDGET.maxSpeed): number {
  const ms = Math.min(1000, Math.max(1, dtMs));
  return (speed * ms) / 1000;
}

/**
 * Trần tốc độ cho một phần tử tự cuộn (auto-scroll) ở khung hình `dtMs`.
 * Tách khỏi `maxDistanceFor` chỉ để tên gọi đọc ra đúng ý định tại nơi dùng.
 */
export function autoScrollStep(dtMs: number, speed: number = 1): number {
  return maxDistanceFor(dtMs, SCROLL_BUDGET.autoSpeed * speed);
}

/**
 * Kẹp `requested` (px, có thể âm) vào trần của khung hình. Giữ nguyên dấu,
 * nên cuộn lên và cuộn xuống bị xử lý như nhau.
 *
 * Phần dư (`requested - clampScrollDelta(...)`) do NƠI GỌI quyết định: chiến
 * lược "queue" giữ lại để xả ở khung hình sau, "absorb" bỏ đi. Việc chia phần
 * dư nằm ở nơi gọi vì chỉ nơi đó mới biết có được phép trả nợ hay không (ví
 * dụ đã chạm đáy trang thì không).
 */
export function clampScrollDelta(requested: number, dtMs: number): number {
  const limit = maxDistanceFor(dtMs);

  if (Math.abs(requested) <= limit) return requested;

  return Math.sign(requested) * limit;
}