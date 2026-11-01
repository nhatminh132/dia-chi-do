import Link from "next/link";
import { OpenPlanButton } from "@/components/gallery/OpenPlanButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { COPYRIGHT_YEAR, NAV_ITEMS, SITE } from "@/lib/navigation";

/**
 * Footer dùng chung — spec §10.
 *
 * Server component (không cần JS): nội dung tĩnh, không có animation.
 *
 * ── Ghi chú biên tập đã bỏ khỏi chân trang ────────────────────────────────
 * Trước đây đáy chân trang có câu "Nội dung lịch sử cần được kiểm chứng…
 * trước khi xuất bản" (`SITE.disclaimer`). Câu đó dài, xuống hai dòng trên
 * điện thoại và lặp lại y nguyên ở phần credit cuối phim. Theo yêu cầu của
 * nhóm, chỉ giữ dòng bản quyền "Dự án học tập"; phần credit ở
 * `EndCredits` vẫn nói rõ nội dung được biên soạn từ nguồn đã công bố.
 */
export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-line bg-ink-900">
      {/* `pb` lớn hơn `py` — chỗ cho capsule trình phát ở góc dưới bên
          phải không đè lên dòng bản quyền. */}
      <Container width="wide" className="pt-16 pb-28 lg:pt-20 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Thương hiệu */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-9 place-items-center border border-flag-red/70"
              >
                <span className="size-2 bg-flag-red" />
              </span>
              <span className="font-display text-lg tracking-[0.16em] text-paper">
                {SITE.name}
              </span>
            </div>

            <p className="mt-6 max-w-md text-pretty text-sm leading-relaxed text-paper-mute">
              {SITE.description}
            </p>

            <p className="mt-6 font-mono text-[0.68rem] uppercase leading-relaxed tracking-[0.16em] text-gold">
              {SITE.tagline}
            </p>
          </div>

          {/* Điều hướng */}
          <nav aria-label="Liên kết chân trang" className="lg:col-span-3">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-paper-faint">
              Khám phá
            </p>
            <ul className="mt-5 space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-paper-dim transition-colors duration-300 hover:text-flag-bright"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Lối vào chính của bảo tàng ảo: mặt bằng các phòng. */}
            <OpenPlanButton className="mt-7" />
          </nav>

          {/* Tư liệu phụ */}
          <div className="lg:col-span-4">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-paper-faint">
              Chuyên mục
            </p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/thu-thach"
                  className="text-sm text-paper-dim transition-colors duration-300 hover:text-flag-bright"
                >
                  Thử thách lịch sử
                </Link>
              </li>
              <li>
                <Link
                  href="/gioi-thieu"
                  className="text-sm text-paper-dim transition-colors duration-300 hover:text-flag-bright"
                >
                  Giới thiệu dự án
                </Link>
              </li>
              <li>
                <Link
                  href="/nguon-tham-khao"
                  className="text-sm text-paper-dim transition-colors duration-300 hover:text-flag-bright"
                >
                  Nguồn tham khảo
                </Link>
              </li>
            </ul>

            <Button href="/ban-do" variant="outline" size="sm" className="mt-7">
              Khám phá địa chỉ đỏ
            </Button>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="mt-14 border-t border-line pt-8">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-paper-faint">
            © {COPYRIGHT_YEAR} {SITE.name} — Dự án học tập
          </p>
        </div>
      </Container>
    </footer>
  );
}