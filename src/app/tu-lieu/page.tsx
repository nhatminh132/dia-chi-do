import type { Metadata } from "next";
import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { ArchiveExplorer } from "@/components/archive/ArchiveExplorer";
import { Button } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { getArchiveRecords } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Kho tư liệu",
  description:
    "Ảnh tư liệu, bản đồ, văn bản và hiện vật liên quan đến các phong trào đấu tranh tại Sài Gòn — kèm nguồn, giấy phép và trạng thái kiểm chứng của từng bản ghi.",
};

/**
 * `/tu-lieu` — kho tư liệu lịch sử.
 *
 * Trang là Server Component. Chỉ `ArchiveExplorer` cần JavaScript (tìm kiếm
 * và bộ lọc).
 *
 * ── Về trạng thái hiện tại ────────────────────────────────────────────────
 *
 * Kho KHÔNG còn trống: các hồ sơ địa điểm và mốc thời gian đã được ghi nhận
 * nguồn chính thức, nên `getArchiveRecords()` trả về các bản ghi nguồn đã
 * kiểm chứng. Số bản ghi được đọc động nên khi có thêm dữ liệu hợp lệ, giao
 * diện tự cập nhật mà không cần sửa trang này.
 *
 * Các tư liệu ảnh vẫn giữ trạng thái `unpublished` — chưa có ảnh nào đạt
 * chuẩn xuất bản, và trang vẫn nói rõ điều đó thay vì dùng ảnh minh họa.
 *
 * Danh mục nguồn tập trung nằm ở trang `/nguon-tham-khao`.
 */
export default function TuLieuPage() {
  const recordCount = getArchiveRecords().length;

  return (
    <>
      {/* Phase 5.5 §1.1: trước đây trang này có `<h1>` sr-only đè lên `<h2>`
          của ChapterFrame. Nay hạ cấp chính tiêu đề hiển thị xuống `h1` —
          đúng MỘT heading cấp 1 thật, không phần tử trùng lặp, giữ nguyên
          typography. */}
      <ChapterFrame
        index="04"
        label="Digital archive"
        title="Kho tư liệu lịch sử"
        headingLevel="h1"
        description="Kho tư liệu được xây dựng để hỗ trợ việc tìm hiểu lịch sử, không thay thế việc đối chiếu với hồ sơ và nguồn lưu trữ chính thức."
        plate="paper"
      >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
              Hiện trạng
            </p>
            <p className="mt-4 font-display text-5xl tabular-nums text-paper">
              {recordCount}
            </p>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper-faint">
              bản ghi đã công bố
            </p>

            <Prose className="mt-8">
              <p>
                Mỗi bản ghi trong kho đều phải ghi rõ nguồn gốc và trạng thái
                kiểm chứng. Bản ghi chưa được đối chiếu sẽ không hiển thị, kể
                cả khi hình ảnh đã có trong dự án.
              </p>
            </Prose>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/ban-do" variant="outline" size="sm">
                Bản đồ địa chỉ đỏ
              </Button>
              <Button href="/" variant="outline" size="sm">
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ArchiveExplorer />
        </div>
      </div>
    </ChapterFrame>
    </>
  );
}