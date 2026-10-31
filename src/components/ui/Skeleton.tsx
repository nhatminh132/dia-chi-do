import { cn } from "@/lib/utils";

/**
 * Khung xương trong lúc chờ.
 * Dùng shimmer CSS thuần (không animation JS) để không cạnh tranh
 * với GSAP ticker của Lenis.
 */
export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn(
        "relative overflow-hidden bg-ink-700/80",
        "after:absolute after:inset-0 after:animate-[skeleton-sweep_1.8s_ease-in-out_infinite]",
        "after:bg-gradient-to-r after:from-transparent after:via-paper/[0.06] after:to-transparent",
        className,
      )}
    />
  );
}

/** Dòng văn bản giả, độ rộng bậc thang cho tự nhiên hơn. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  const widths = ["100%", "96%", "72%"];

  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3.5" style={{ width: widths[i % widths.length] }} />
      ))}
    </div>
  );
}

/** Khung chờ toàn trang — dùng cho `loading.tsx`. */
export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 lg:px-12">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-8 h-16 w-full max-w-2xl" />
      <Skeleton className="mt-4 h-16 w-full max-w-md" />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-4/3 w-full" />
        ))}
      </div>
    </div>
  );
}