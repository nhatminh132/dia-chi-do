import type { Metadata } from "next";
import Link from "next/link";
import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { Reveal } from "@/components/anim/Reveal";
import { GridField } from "@/components/media/CinematicPlate";
import { Button } from "@/components/ui/Button";
import { Prose, ProseHeading } from "@/components/ui/Prose";
import { getSourceStats, getSourcesByPublisher } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Nguồn tham khảo",
  description:
    "Danh mục toàn bộ nguồn đã được đối chiếu trực tiếp cho từng hồ sơ địa điểm và từng mốc thời gian — kèm cơ quan ban hành, đường dẫn gốc và nội dung cụ thể mà nguồn đó xác nhận.",
};

/**
 * `/nguon-tham-khao` — danh mục nguồn tập trung.
 *
 * Trang là Server Component hoàn toàn: danh mục được tính lúc build từ
 * `src/lib/sources.ts`, không cần JavaScript.
 *
 * ── Vì sao cần trang này ──────────────────────────────────────────────────
 *
 * Nguồn nằm rải rác ở từng hồ sơ và từng mốc thời gian. Người đọc muốn một
 * câu trả lời cho câu hỏi "thông tin này lấy từ đâu?" — và cần thấy được
 * rằng mỗi thông tin có đúng một nơi để mở ra kiểm chứng. Trang này gom lại
 * theo CƠ QUAN BAN HÀNH, vì đó là cách người ta kiểm tra nguồn: mở cơ quan
 * thật rồi tìm trang cụ thể.
 *
 * Mỗi mục ghi rõ nguồn đó xác nhận điều gì (`note`) — không chỉ tên nguồn.
 * Một nguồn không kèm ghi chú thì người đọc không biết nên tin phần nào.
 */
export default function NguonThamKhaoPage() {
  const stats = getSourceStats();
  const groups = getSourcesByPublisher();

  return (
    <ChapterFrame
      index="07"
      label="Sources"
      title="Nguồn tham khảo"
      headingLevel="h1"
      description="Mỗi thông tin lịch sử trên website này đều dẫn về ít nhất một nguồn có thể mở ra kiểm chứng. Danh mục dưới đây liệt kê toàn bộ những nguồn đó, theo cơ quan ban hành."
      plate="paper"
    >
      <GridField className="opacity-[0.035]" />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ── Cột trái: số liệu và nguyên tắc ─────────────────────────── */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
              Hiện trạng kiểm chứng
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6">
              <div>
                <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-faint">
                  Nguồn đã đối chiếu
                </dt>
                <dd className="mt-1 font-display text-4xl tabular-nums text-paper">
                  {stats.total}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-faint">
                  Có đường dẫn gốc
                </dt>
                <dd className="mt-1 font-display text-4xl tabular-nums text-paper">
                  {stats.withUrl}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-faint">
                  Cơ quan ban hành
                </dt>
                <dd className="mt-1 font-display text-4xl tabular-nums text-paper">
                  {stats.publishers}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-paper-faint">
                  Hồ sơ / mốc có nguồn
                </dt>
                <dd className="mt-1 font-display text-4xl tabular-nums text-paper">
                  {stats.sites}
                  <span className="text-paper-faint">/</span>
                  {stats.events}
                </dd>
              </div>
            </dl>

            <Prose className="mt-10">
              <p>
                Trước khi một thông tin được đưa lên trang này, nó phải trả lời
                được ba câu hỏi: <strong className="text-paper">lấy từ đâu</strong>,
                <strong className="text-paper"> ai chịu trách nhiệm</strong> và
                <strong className="text-paper"> xác nhận điều gì</strong>. Nếu
                chỉ trả lời được một trong ba, thông tin đó chưa đủ điều kiện
                xuất bản và sẽ không xuất hiện.
              </p>
              <p>
                Đây là tiêu chuẩn dự án đặt ra, không phải tiêu chuẩn có sẵn. Vì
                vậy danh mục này có thể ngắn, và việc nó ngắn là đúng: mỗi mục ở
                đây đều mở ra được và đều nói rõ nó xác nhận gì.
              </p>
            </Prose>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/tu-lieu" variant="outline" size="sm">
                Kho tư liệu
              </Button>
              <Button href="/gioi-thieu" variant="outline" size="sm">
                Về dự án
              </Button>
            </div>
          </div>
        </div>

        {/* ── Cột phải: danh mục ──────────────────────────────────────── */}
        <div className="lg:col-span-8">
          {groups.map((group) => (
            <Reveal key={group.publisher} variant="settle" className="mt-14 first:mt-0">
              <ProseHeading level="h2">{group.publisher}</ProseHeading>

              <ul className="mt-6 space-y-7">
                {group.entries.map((entry) => (
                  <li key={entry.id} className="border-l-2 border-line-strong pl-5">
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-pretty text-[1rem] leading-snug text-paper underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-gold hover:decoration-gold"
                      >
                        {entry.title}
                      </a>
                    ) : (
                      <p className="text-pretty text-[1rem] leading-snug text-paper">
                        {entry.title}
                      </p>
                    )}

                    <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper-faint">
                      {entry.origin === "site" ? "Hồ sơ địa điểm" : "Mốc thời gian"}
                      {" · "}
                      {entry.originHref ? (
                        <Link
                          href={entry.originHref}
                          className="underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-gold"
                        >
                          {entry.originTitle}
                        </Link>
                      ) : (
                        entry.originTitle
                      )}
                    </p>

                    {entry.note ? (
                      <p className="mt-3 text-pretty text-[0.88rem] leading-relaxed text-paper-mute">
                        {entry.note}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </ChapterFrame>
  );
}
