import type { ArchiveItem, SourceRef } from "@/data/types";

/**
 * Một tấm tư liệu đã được "đóng gói" để trưng bày: ảnh gốc + chú thích đã
 * kiểm chứng + nguồn + hồ sơ địa điểm liên quan.
 *
 * Dùng chung cho lưới compact, hộp xem lớn và khối part 03 — để ba nơi không
 * tự định nghĩa ba kiểu dữ liệu hơi khác nhau.
 */
export interface ArchiveEntry {
  item: ArchiveItem;
  location?: string;
  sources?: SourceRef[];
  siteName?: string;
  siteHref?: string;
  plate: string;
}
