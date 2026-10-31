"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useGallery } from "@/components/gallery/GalleryProvider";
import { roomForPath } from "@/data/rooms";
import { NAV_CTA, SITE } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THANH ĐẦU — CỬA VÀO BẢO TÀNG
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ở đây KHÔNG có menu ngang nữa.
 *
 * Một dãy chữ "Trang chủ / Địa chỉ đỏ / Dòng thời gian / …" là cách một
 * website liệt kê trang. Một bảo tàng thì không liệt kê phòng — bạn nhìn
 * mặt bằng và tự đi. Nên thanh đầu giờ chỉ giữ đúng ba thứ:
 *
 *   • tên bảo tàng (quay về sảnh chính),
 *   • vị trí hiện tại ("Phòng 03 · Kho tư liệu"),
 *   • một nút duy nhất mở MẶT BẰNG.
 *
 * Bản thân danh sách phòng nằm trong `RoomMap`, và nó là một TÌNH HUỐNG
 * không phải một menu — người xem thấy phòng nào nằm ở đâu, đường đi nối
 * thế nào, và đang đứng ở phòng nào.
 *
 * ── Vì sao vẫn giữ chỉ dẫn "Phòng N" ───────────────────────────────────
 *
 * Trong sơ đồ phòng, vị trí là thứ bạn nhìn thấy. Nhưng khi bạn đang ở
 * giữa một trang dài, bạn không nhìn sơ đồ. Vì vậy thanh đầu luôn ghi nhớ
 * bạn đang ở phòng nào — như một biển số trong bảo tàng thật.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { openMap, mapOpen } = useGallery();

  const room = roomForPath(pathname);
  const isHome = pathname === "/";

  useEffect(() => {
    // passive: true — trình duyệt không phải chặn luồng cuộn để đọc giá trị
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ease-cinematic",
        scrolled || !isHome
          ? "border-b border-line bg-ink/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between gap-6 px-5 sm:h-20 sm:px-8 lg:px-12 xl:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="group/logo flex shrink-0 items-center gap-3"
          aria-label={`${SITE.name} — về sảnh chính`}
        >
          <span
            aria-hidden
            className="relative grid size-8 place-items-center border border-flag-red bg-flag-red transition-colors duration-500 group-hover/logo:bg-flag-bright sm:size-9"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-[62%] text-gold transition-transform duration-500 group-hover/logo:scale-110"
              fill="currentColor"
            >
              <path d="m12 2.2 2.26 6.96h7.32l-5.92 4.3 2.26 6.96L12 16.12l-5.92 4.3 2.26-6.96-5.92-4.3h7.32L12 2.2Z" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[0.95rem] tracking-[0.16em] text-paper sm:text-base">
              {SITE.name}
            </span>
            <span className="mt-1 hidden font-mono text-[0.56rem] uppercase tracking-[0.22em] text-paper-faint sm:block">
              Saigon · Digital Heritage
            </span>
          </span>
        </Link>

        {/* ── Mặt bằng (desktop) ──────────────────────────────────────── */}
        <div className="hidden items-center gap-6 lg:flex">
          {isHome ? (
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-paper">
              Khám phá
            </span>
          ) : room ? (
            <p className="flex items-baseline gap-2.5 font-mono text-[0.6rem] uppercase tracking-[0.2em]">
              <span className="text-flag-bright">{room.number}</span>
              <span className="text-paper-faint">{room.name}</span>
            </p>
          ) : null}

          <button
            type="button"
            onClick={openMap}
            aria-label="Sơ đồ phòng trưng bày"
            aria-expanded={mapOpen}
            aria-haspopup="dialog"
            className={cn(
              "group/plan flex items-center gap-3 font-mono uppercase tracking-[0.18em] text-paper transition-colors duration-300 hover:text-gold",
              isHome
                ? "size-11 justify-center border-0 px-0"
                : "min-h-11 border border-line-strong px-4 py-2.5 text-[0.64rem] hover:border-flag-red",
            )}
          >
            {isHome ? (
              <svg aria-hidden viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            ) : <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="size-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              {/* Ký hiệu mặt bằng: một hình chữ nhật bị chia */}
              <path d="M1.5 2.5h13v11h-13z" />
              <path d="M1.5 8h6.5" />
              <path d="M8 8v5.5" />
            </svg>}
            {!isHome && "Sơ đồ phòng"}
          </button>
        </div>

        {/* CTA + nút mở sơ đồ ở mobile.
            CTA được BỌC trong span thay vì đặt `hidden sm:inline-flex` thẳng
            lên Button — vì Button đã có `inline-flex` sẵn trong BASE, hai
            utility display cùng độ ưu tiên nên thứ tự class không quyết định
            được, và ở mobile `inline-flex` thắng làm CTA tràn ra ngoài. */}
        <div className="flex items-center gap-3">
          <span className={cn("hidden sm:block", isHome && "hidden") }>
            <Button href={NAV_CTA.href} size="sm">
              {NAV_CTA.label}
            </Button>
          </span>

          <button
            type="button"
            onClick={openMap}
            aria-label="Mở sơ đồ phòng"
            aria-expanded={mapOpen}
            aria-haspopup="dialog"
            className="-mr-1 grid size-11 place-items-center text-paper transition-colors duration-300 hover:text-gold lg:hidden"
          >
            <span className="sr-only">Mở sơ đồ phòng</span>
            {isHome ? (
              <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            ) : <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <path d="M1.5 2.5h13v11h-13z" />
              <path d="M1.5 8h6.5" />
              <path d="M8 8v5.5" />
            </svg>}
          </button>
        </div>
      </div>
    </header>
  );
}
