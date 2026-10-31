import { cn } from "@/lib/utils";

type AccentTone = "flag" | "gold";

const ACCENT_CLASS: Record<AccentTone, string> = {
  flag: "text-flag-red",
  gold: "text-gold",
};

const SIZE_CLASS = {
  1: "text-[clamp(2.5rem,8vw,6.5rem)]",
  2: "text-[clamp(2rem,5.5vw,4.25rem)]",
  3: "text-[clamp(1.5rem,3.4vw,2.5rem)]",
  4: "text-[clamp(1.15rem,2.2vw,1.6rem)]",
} as const;

/**
 * Tiêu đề hiển thị lớn, kiểu tư liệu lịch sử.
 *
 * `accentWords` tô sắc một số từ để tạo nhịp thị giác — tránh
 * "AI landing page" nơi mọi tiêu đề đều giống nhau.
 *
 * Chỉ nhận chuỗi thuần: muốn nhấn mạnh từ nào thì truyền vào
 * `accentWords`, thay vì nhúng JSX thủ công (dễ vỡ xuống dòng).
 */
export function Heading({
  children,
  level = 2,
  accentWords = [],
  accent = "flag",
  className,
  balance = true,
}: {
  children: string;
  level?: 1 | 2 | 3 | 4;
  accentWords?: string[];
  accent?: AccentTone;
  className?: string;
  balance?: boolean;
}) {
  const Tag = `h${level}` as const;

  const content =
    accentWords.length === 0
      ? children
      : children.split(/(\s+)/).map((chunk, i) =>
          accentWords.includes(chunk)
            ? (
                <span key={i} className={cn("text-balance", ACCENT_CLASS[accent])}>
                  {chunk}
                </span>
              )
            : (
                <span key={i}>{chunk}</span>
              ),
        );

  return (
    <Tag
      className={cn(
        "uppercase font-display text-paper",
        SIZE_CLASS[level],
        balance && "text-balance",
        className,
      )}
    >
      {content}
    </Tag>
  );
}