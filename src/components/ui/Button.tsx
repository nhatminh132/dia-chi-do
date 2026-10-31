import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-flag-red text-paper border border-flag-red hover:bg-flag-bright hover:border-flag-bright",
  secondary:
    "bg-paper text-ink border border-paper hover:bg-paper-dim hover:border-paper-dim",
  outline:
    "bg-transparent text-paper border border-line-strong hover:border-flag-red hover:text-flag-bright",
  ghost:
    "bg-transparent text-paper-mute border border-transparent hover:text-gold",
};

const SIZE: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.68rem]",
  md: "px-6 py-3 text-[0.72rem]",
  lg: "px-8 py-4 text-[0.78rem]",
};

const BASE =
  "group/btn relative inline-flex items-center justify-center gap-2.5 font-mono uppercase " +
  "tracking-[0.18em] whitespace-nowrap cursor-pointer select-none " +
  "transition-[background-color,border-color,color,transform] duration-300 ease-cinematic " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-40";

/**
 * Nút hành động. Truyền `href` để render thành `Link` (điều hướng thật),
 * bỏ `href` để render thành `<button>`.
 *
 * Spec yêu cầu "các nút phải hoạt động thật" — nên nếu một nhãn trông như
 * nút thì nó phải nhận `href` hoặc `onClick`, không được để trơ.
 *
 * ⚠️ LƯU Ý KHI DÙNG: BASE đã chứa `inline-flex`. Nếu cần ẩn/hiện nút theo
 * breakpoint, đỪNG truyền `hidden sm:inline-flex` vào `className` — hai utility
 * `display` cùng độ ưu tiên nên thứ tự trong class attribute không quyết định
 * được, Tailwind có thể cho `inline-flex` thắng. Hãy bọc trong thẻ `<span>`
 * có class responsive, hoặc bọc `!hidden` / `!inline-flex`.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  href?: string;
} & Omit<ComponentProps<"button">, "className" | "children">) {
  const classes = cn(BASE, VARIANT[variant], SIZE[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...rest}>
      {children}
    </button>
  );
}