import type { Route } from "next";

/**
 * Hệ thống điều hướng — spec §1.
 *
 * Menu desktop và mobile dùng CHUNG danh sách, chỉ khác nhãn hiển thị
 * (`shortLabel`) đúng như spec: desktop "Địa chỉ đỏ", mobile "Bản đồ".
 *
 * Thứ tự mục là bản dịch trực tiếp từ Idea.txt §1 — không tự thêm/bớt.
 */

export interface NavItem {
  href: Route;
  /** Nhãn đầy đủ, dùng cho desktop và footer. */
  label: string;
  /** Nhãn rút gọn, dùng cho menu mobile. */
  shortLabel: string;
  /** Nhãn tiếng Anh — chỉ mang tính nhận diện. */
  labelEn: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Trang chủ",
    shortLabel: "Trang chủ",
    labelEn: "Home",
  },
  {
    href: "/ban-do",
    label: "Địa chỉ đỏ",
    shortLabel: "Bản đồ",
    labelEn: "Red Address Map",
  },
  {
    href: "/dong-thoi-gian",
    label: "Dòng thời gian",
    shortLabel: "Dòng thời gian",
    labelEn: "Timeline",
  },
  {
    href: "/dong-nam-a",
    label: "Đông Nam Á",
    shortLabel: "Đông Nam Á",
    labelEn: "Southeast Asia",
  },
  {
    href: "/tu-lieu",
    label: "Kho tư liệu",
    shortLabel: "Tư liệu",
    labelEn: "Digital Archive",
  },
  {
    href: "/gioi-thieu",
    label: "Giới thiệu",
    shortLabel: "Giới thiệu",
    labelEn: "About",
  },
];

/** Nút hành động nổi bật trên header (spec §1). */
export const NAV_CTA = {
  href: "/ban-do" as Route,
  label: "KHÁM PHÁ ĐỊA CHỈ ĐỎ",
} as const;

/** Thông điệp dùng lặp lại — spec §10. */
export const TAGLINE = "TÌM HIỂU LỊCH SỬ. GÌN GIỮ KÝ ỨC.";

/**
 * Năm hiển thị ở chân trang.
 *
 * Cố tình là HẰNG SỐ, không dùng `new Date().getFullYear()`:
 * Next.js 16 chặn giá trị thay đổi theo thời gian khi prerender
 * ("unstable value ... while prerendering") vì nó làm HTML khác nhau giữa
 * các lần build. Muốn cập nhật năm thì sửa ở đây, một chỗ duy nhất.
 */
export const COPYRIGHT_YEAR = 2026;

export const SITE = {
  name: "ĐỊA CHỈ ĐỎ",
  tagline: TAGLINE,
  description:
    "Không gian triển lãm lịch sử trực tuyến, khám phá hành trình đấu tranh giành độc lập của Sài Gòn qua các địa điểm, sự kiện và tư liệu lịch sử.",
  /*
   * `disclaimer` (câu "Nội dung lịch sử cần được kiểm chứng… trước khi xuất
   * bản") đã bị bỏ khỏi footer theo yêu cầu của nhóm — xem ghi chú trong
   * `components/layout/Footer.tsx`. Không giữ lại hằng số này để tránh một
   * chuỗi "đã xoá" mà không ai render.
   */
} as const;