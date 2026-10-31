"use client";

import { useGallery } from "./GalleryProvider";
import { cn } from "@/lib/utils";

/**
 * Nút mở sơ đồ phòng — bản client để dùng được ở chân trang (server component).
 *
 * Ở thanh đầu có sẵn một nút tương tự, nhưng thanh đầu vốn đã là client
 * component nên không cần tách. Chân trang thì không — nên phần dùng chung
 * được đặt ở đây.
 */
export function OpenPlanButton({
  className,
  label = "Xem sơ đồ phòng",
}: {
  className?: string;
  label?: string;
}) {
  const { openMap, mapOpen } = useGallery();

  return (
    <button
      type="button"
      onClick={openMap}
      aria-expanded={mapOpen}
      aria-haspopup="dialog"
      className={cn(
        "group/plan inline-flex items-center gap-3 border border-line-strong px-4 py-2.5",
        "font-mono text-[0.64rem] uppercase tracking-[0.18em] text-paper-dim",
        "transition-colors duration-300 hover:border-flag-red hover:text-flag-bright",
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="size-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <path d="M1.5 2.5h13v11h-13z" />
        <path d="M1.5 8h6.5" />
        <path d="M8 8v5.5" />
      </svg>
      {label}
    </button>
  );
}
