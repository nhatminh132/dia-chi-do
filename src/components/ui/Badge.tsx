import type { ContentStatus } from "@/data/types";
import { statusMeta } from "@/lib/content-status";
import { cn } from "@/lib/utils";

/** Badge chủ đề / giai đoạn — nhỏ, mono, viền mảnh. */
export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "flag" | "gold";
}) {
  const tones = {
    neutral: "border-line-strong text-paper-mute",
    flag: "border-flag-red/50 text-flag-bright",
    gold: "border-gold/40 text-gold",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono",
        "text-[0.62rem] uppercase tracking-[0.16em] leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Badge trạng thái kiểm chứng nội dung.
 *
 * Đây là hiển thị BẮT BUỘC cho mọi nội dung chưa xác minh — biến
 * "chúng tôi chưa chắc" thành thông tin công khai trung thực,
 * thay vì im lặng hoặc khẳng định như sự thật.
 */
export function StatusBadge({
  status,
  className,
}: {
  status: ContentStatus;
  className?: string;
}) {
  const meta = statusMeta(status);

  if (status === "verified") return null; // đã xác minh thì không cần cảnh báo

  return (
    <span
      title={meta.hint}
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono",
        "text-[0.62rem] uppercase tracking-[0.16em] leading-none",
        meta.className,
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block size-1.5 rounded-full bg-current opacity-80"
      />
      {meta.label}
    </span>
  );
}