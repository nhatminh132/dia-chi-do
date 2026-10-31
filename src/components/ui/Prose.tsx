import { cn } from "@/lib/utils";

/**
 * Khối văn bản dài — dùng cho hồ sơ di tích và phần giới thiệu.
 *
 * Không dùng class `prose` của @tailwindcss/typography (chưa cài, và mặc định
 * của nó thiên về tông sáng, xung đột bảng màu tối của dự án).
 * Định kiểu thủ công để kiểm soát nhịp đọc: dòng cao, đoạn thoáng, không chữ nghiêng.
 */
export function Prose({
  children,
  className,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-[0.92rem]",
    md: "text-[1rem] sm:text-[1.05rem]",
    lg: "text-[1.05rem] sm:text-[1.125rem]",
  } as const;

  return (
    <div
      className={cn(
        "max-w-[68ch] space-y-6 font-sans leading-[1.85] text-paper-dim",
        sizes[size],
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Tiêu đề phụ trong Prose.
 *
 * `level` cho phép trang biết bối cảnh phân cấp: trên trang chủ tiêu đề nằm
 * dưới `<h2>` chương nên mặc định là `h3`; còn trong hồ sơ địa điểm, các mục
 * này là phần tử cấp hai của chính trang (dưới `<h1>` tên hồ sơ) nên truyền
 * `level="h2"`. Không có `level` thì trình đọc màn hình sẽ gặp một bước nhảy
 * h1 -> h3, tức là mất một cấp trong cấu trúc tài liệu.
 */
export function ProseHeading({
  children,
  className,
  level = "h3",
}: {
  children: React.ReactNode;
  className?: string;
  level?: "h2" | "h3";
}) {
  const Heading = level;

  return (
    <Heading
      className={cn(
        "mt-12 border-l-2 border-flag-red pl-4 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-paper",
        className,
      )}
    >
      {children}
    </Heading>
  );
}