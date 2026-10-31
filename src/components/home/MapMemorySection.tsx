import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { Reveal } from "@/components/anim/Reveal";
import { MapReveal } from "@/components/cinematic/MapReveal";
import { getScene } from "@/lib/scenes";

/**
 * CẢNH 05 — BẢN ĐỒ KÝ ỨC
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  Cảnh chuyển tiếp ngắn từ "dấu vết kháng chiến" sang "bản đồ ký ức".
 *
 *  ── WOW #3 — BẢN ĐỒ HÌNH THỨC → BẢN ĐỒ THẬT ──────────────────────────────
 *
 *  Lớp khí quyển của cảnh này là một bản đồ HÌNH THỨC (lưới toạ độ, đường
 *  đồng mức, vệt mực đỏ) — không có nhãn địa danh bịa, không có toạ độ bịa.
 *
 *  Khi người xem cuộn tới, vệt mực đỏ loang ra và BẢN ĐỒ THẬT lộ ra bên
 *  dưới: cùng dữ liệu, cùng toạ độ, cùng cổng kiểm duyệt nội dung mà
 *  trang `/ban-do` dùng.
 *
 *  Không nhân đôi bản đồ: ở đây chỉ có khung bản đồ + danh sách địa điểm có
 *  thể chọn. Bộ lọc và tìm kiếm đầy đủ vẫn nằm ở `/ban-do`, và có nút
 *  dẫn thẳng tới đó.
 *
 *  ── Vì sao không nhân bản bản đồ vào trang chủ ─────────────────────────────
 *
 *  Bản đồ là một lời khẳng định về vị trí. Nhân bản nó ở hai nơi sẽ tạo hai
 *  nơi phải bảo trì, và một bản bản đồ "rút gọn" trên trang chủ dễ trở
 *  thành một bản đồ GIẢ — thiếu bộ lọc, thiếu trạng thái kiểm chứng, dễ
 *  khiến người xem tưởng mọi toạ độ đều chính xác. Cảnh này là CỬA VÀO bản
 *  đồ thật, không phải một bản sao.
 */
export function MapMemorySection() {
  const scene = getScene("scene-05-map-transition");

  return (
    <ChapterFrame
      id="chapter-05"
      index="05"
      label="Map of Memory"
      title="Bản đồ ký ức."
      description="Lịch sử không chỉ được ghi lại trong sách. Nó còn hiện diện trong những con đường, ngôi nhà và địa điểm đã chứng kiến các phong trào đấu tranh của thành phố."
      plate="grid"
      scene={scene}
    >
      <Reveal variant="up" respectReducedMotion>
        <p className="measure max-w-3xl text-pretty text-[0.95rem] leading-[1.85] text-paper-mute">
          Bản đồ bên dưới dùng dữ liệu thật của những địa điểm đã qua kiểm
          chứng. Toạ độ xấp xỉ được ghi rõ là xấp xỉ; địa chỉ chỉ hiện khi
          nguồn xác nhận.
        </p>
      </Reveal>

      <MapReveal />
    </ChapterFrame>
  );
}
