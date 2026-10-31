import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { COPYRIGHT_YEAR } from "@/lib/navigation";
import { TEAM } from "@/data/team";

/**
 * END CREDITS — credit cuối phim.
 *
 * Không phải footer thứ hai: footer là bảng chỉ dẫn; phần này là nhịp thở
 * cuối của bộ phim. Vì vậy bố cục dọc, chữ nhỏ, nhiều khoảng trống, và một
 * dấu "HẾT" duy nhất.
 *
 * Server component, CSS thuần. Mọi liên kết đều trỏ tới nơi có thật.
 */
const CREDITS: { label: string; value: string }[] = [
  { label: "Một dự án của", value: `Nhóm ${TEAM.name}` },
  { label: "Lớp · Trường", value: `Lớp ${TEAM.className} · ${TEAM.school}` },
  { label: "Thành viên", value: TEAM.members.join(" · ") },
  {
    label: "Nội dung lịch sử",
    value: "Biên soạn từ các nguồn đã công bố; xem trang Nguồn tham khảo.",
  },
  {
    label: "Hình ảnh & giấy phép",
    value: "Credit và giấy phép ghi tại từng hồ sơ, từng ảnh.",
  },
  {
    label: "Cảm ơn",
    value:
      "Các tác giả, nhiếp ảnh gia và tổ chức lưu trữ có tư liệu xuất hiện trong bảo tàng.",
  },
];

export function EndCredits() {
  return (
    <section
      id="ket-thuc"
      aria-labelledby="end-credits-title"
      className="relative isolate overflow-hidden border-t border-line bg-ink-950"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(200,16,46,0.10) 0%, rgba(5,5,5,0) 62%)",
        }}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 select-none font-display text-[26vw] leading-none text-paper/[0.025]"
      >
        HẾT
      </span>

      <Container width="wide" className="relative py-28 sm:py-36">
        <div className="text-center">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-gold">
            Địa Chỉ Đỏ · {COPYRIGHT_YEAR}
          </p>
          <h2
            id="end-credits-title"
            className="mt-5 font-display text-[clamp(2.6rem,7vw,5rem)] uppercase leading-none text-paper"
          >
            Hết
          </h2>
          <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-paper-faint">
            The End
          </p>
        </div>

        <dl className="mx-auto mt-20 max-w-4xl border-y border-line">
          {CREDITS.map((row) => (
            <div
              key={row.label}
              className="grid gap-1.5 border-b border-line px-1 py-5 last:border-b-0 sm:grid-cols-[13rem_1fr] sm:gap-8 sm:py-6"
            >
              <dt className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-paper-faint">
                {row.label}
              </dt>
              <dd className="text-pretty text-[0.88rem] leading-relaxed text-paper-dim">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <nav
          aria-label="Liên kết cuối phim"
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper-faint"
        >
          <Link href="/nguon-tham-khao" className="transition-colors hover:text-flag-bright">
            Nguồn tham khảo
          </Link>
          <Link href="/gioi-thieu" className="transition-colors hover:text-flag-bright">
            Giới thiệu dự án
          </Link>
          <Link href="/tu-lieu" className="transition-colors hover:text-flag-bright">
            Kho tư liệu
          </Link>
          <a href="#chapter-01" className="transition-colors hover:text-gold">
            Về đầu phim ↑
          </a>
        </nav>

        <p className="mx-auto mt-12 max-w-xl text-balance text-center font-mono text-[0.56rem] uppercase leading-relaxed tracking-[0.18em] text-paper-faint">
          Dự án học tập · Nội dung cần được kiểm chứng trước khi xuất bản
        </p>
      </Container>
    </section>
  );
}
