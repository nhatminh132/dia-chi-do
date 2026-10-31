import { cn } from "@/lib/utils";

/**
 * Nhãn đầu section theo spec — ví dụ "01 / THE STORY".
 * Mono, tracking rộng, gạch chân đỏ: đúng ngôn ngữ "biên tập viên" của bảo tàng.
 */
export function SectionLabel({
  index,
  title,
  className,
  tone = "default",
}: {
  /** Phần số, ví dụ "01". */
  index?: string;
  /** Phần chữ, ví dụ "THE STORY". */
  title: string;
  className?: string;
  tone?: "default" | "paper";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-mono text-[0.68rem] uppercase",
        "tracking-[0.28em]",
        tone === "paper" ? "text-ink-900/70" : "text-paper-mute",
        className,
      )}
    >
      {index ? (
        <>
          <span
            className={cn(
              "tabular-nums",
              tone === "paper" ? "text-flag-red" : "text-flag-bright",
            )}
          >
            {index}
          </span>
          <span
            aria-hidden
            className={cn(
              "h-px w-8",
              tone === "paper" ? "bg-ink-900/30" : "bg-line-strong",
            )}
          />
        </>
      ) : null}
      <span>{title}</span>
    </div>
  );
}