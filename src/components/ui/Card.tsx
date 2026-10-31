import { cn } from "@/lib/utils";

/**
 * Thẻ nội dung nền tối.
 * Cố tình bo góc gần như không (radius 2-3px) và viền 1px kiểu tư liệu —
 * tránh ngôn ngữ "rounded card" của template AI.
 */
export function Card({
  children,
  className,
  interactive = true,
  as: Tag = "article",
}: {
  children: React.ReactNode;
  className?: string;
  /** Viền sáng + nâng nhẹ khi hover. */
  interactive?: boolean;
  as?: "article" | "div" | "li";
}) {
  return (
    <Tag
      className={cn(
        "relative border border-line bg-ink-800",
        interactive &&
          "transition-[border-color,transform,background-color] duration-500 ease-cinematic",
        interactive &&
          "hover:-translate-y-0.5 hover:border-flag-red/60 hover:bg-ink-700",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Góc trang trí kiểu khung ảnh tư liệu. */
export function CardCorner({ className }: { className?: string }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-flag-red/70",
          className,
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-flag-red/70",
          className,
        )}
      />
    </>
  );
}