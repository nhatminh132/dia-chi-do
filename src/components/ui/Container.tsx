import { cn } from "@/lib/utils";

/**
 * Vùng chứa nội dung — canh giữa và giới hạn bề rộng đọc.
 * Desktop generous, mobile gọn — không thu nhỏ nguyên xi desktop.
 */
export function Container({
  className,
  children,
  width = "default",
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  width?: "default" | "narrow" | "wide" | "full";
  as?: "div" | "section" | "header" | "footer" | "article";
}) {
  const widths = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-[90rem]",
    full: "max-w-none",
  } as const;

  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16",
        widths[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}