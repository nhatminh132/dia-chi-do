import { cn } from "@/lib/utils";

/**
 * Trạng thái rỗng — dùng thống nhất cho mọi trường hợp "không có kết quả":
 * tìm kiếm không ra, bộ lọc không khớp, kho tư liệu chưa có.
 *
 * Copy "Hãy thử từ khoá khác hoặc xoá bộ lọc" đúng spec §3 — người dùng
 * luôn được cho một lối ra, không bị bỏ mặc ở màn hình trắng.
 */
export function EmptyState({
  title,
  description,
  action,
  className,
  tone = "default",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  tone?: "default" | "quiet";
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center border border-dashed border-line-strong px-6 py-16 text-center",
        tone === "quiet" && "border-line",
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 48 48"
        className="mb-5 size-10 text-paper-faint"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <rect x="6" y="10" width="36" height="28" />
        <path d="M6 20h36M16 10v28" />
        <path d="M26 30h10M31 25v10" opacity="0.5" />
      </svg>

      <p className="max-w-md text-balance font-display text-lg uppercase tracking-wide text-paper-dim">
        {title}
      </p>

      {description ? (
        <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-paper-mute">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}