/**
 * Hàm tiện ích dùng chung.
 * Cố tình KHÔNG thêm clsx/tailwind-merge — nhu cầu hiện tại chỉ cần nối class.
 */

/** Nối các class name, bỏ qua falsy. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Chuẩn hóa chuỗi để so khớp không phân biệt hoa thường và dấu tiếng Việt.
 * Dùng cho ô tìm kiếm tên di tích.
 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .trim();
}

/** Kiểm tra một chuỗi có chứa toàn bộ các từ khoá đã tách hay không. */
export function matchesKeywords(haystack: string, keywords: string[]): boolean {
  const hay = normalizeText(haystack);
  return keywords.every((kw) => hay.includes(normalizeText(kw)));
}

/** Định dạng năm cho nhãn timeline. */
export function formatYear(year: number): string {
  return String(year);
}