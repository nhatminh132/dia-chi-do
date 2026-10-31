import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Reveal } from "@/components/anim/Reveal";
import { ArchiveImage } from "@/components/media/ArchiveImage";
import { GridField } from "@/components/media/CinematicPlate";
import { ProfileHero } from "@/components/site/ProfileHero";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Prose, ProseHeading } from "@/components/ui/Prose";
import { getPublicSites, getEventsForSite, getRelatedSites, getSiteBySlug, categoryLabel, periodLabel, topicLabel } from "@/lib/content";
import {
  APPROXIMATE_BADGE_LABEL,
  PENDING_LABEL,
  isApproximate,
  isPublic,
  mappableCoordinates,
  publicAddress,
} from "@/lib/content-status";

/**
 * Hồ sơ di tích — mẫu 10 khối theo Idea.txt §4.
 *
 * Mọi nội dung lấy từ `src/data/sites.ts`, không hardcode. Một slug sai sẽ
 * gọi `notFound()` nên hiện trang 404 chuẩn thay vì trang rỗng.
 */

export function generateStaticParams() {
  return getPublicSites().map((site) => ({ slug: site.slug }));
}

export async function generateMetadata(
  props: PageProps<"/ho-so/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const site = getSiteBySlug(slug);

  if (!site) return { title: "Không tìm thấy hồ sơ" };

  return {
    title: site.name,
    description: site.summary,
  };
}

/**
 * Vì sao cần `<Suspense>`:
 *
 * `params` là dữ liệu URL. Khi dự án bật `cacheComponents` (Next 16), việc
 * `await params` trực tiếp trong page khiến route không thể prerender trọn
 * vẹn và Next cảnh báo:
 *
 *   "Route /ho-so/[slug]: Next.js encountered URL data during prerendering or
 *    a navigation. `params` or `searchParams` accessed outside of <Suspense>"
 *
 * Đo thực tế: lỗi này xuất hiện khi bấm link hồ sơ ở trang dòng thời gian.
 * Bọc phần đọc `params` sau một ranh giới `<Suspense>` là cách Next khuyến
 * nghị, vừa hết cảnh báo vừa giữ được điều hướng tức thì.
 *
 * Lưu ý: đây KHÔNG phải lỗi dữ liệu hỏng — `generateStaticParams` đã liệt kê
 * đủ 4 hồ sơ, cả 4 đều được prerender thành công.
 */
export default function SiteDossierPage(props: PageProps<"/ho-so/[slug]">) {
  return (
    <Suspense
      fallback={
        <div className="pt-16 sm:pt-20">
          <PageSkeleton />
        </div>
      }
    >
      <SiteDossier params={props.params} />
    </Suspense>
  );
}

async function SiteDossier({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getSiteBySlug(slug);

  if (!site) notFound();

  const address = publicAddress(site);
  const coordinates = mappableCoordinates(site);
  const approximate = isApproximate(site);
  const relatedSites = getRelatedSites(site);
  const relatedEvents = getEventsForSite(site);
  const publicImages = site.images.filter(
    (image) => Boolean(image.src) && isPublic(image.status),
  );

  return (
    <>
      {/* ── 1 + 2 · Ảnh bìa và tên địa điểm ───────────────────────────── */}
      <ProfileHero
        eyebrow={periodLabel(site.period)}
        title={site.name}
        subtitle={site.subtitle}
        nameEn={site.nameEn}
        period={categoryLabel(site.category)}
        status={<StatusBadge status={site.status} />}
      />

      <Container width="wide" className="py-20 sm:py-24 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* ── Cột chính ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            {/* Nút quay lại bản đồ — yêu cầu của Idea.txt §1 */}
            <Link
              href="/ban-do"
              className="inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-paper-mute transition-colors duration-300 hover:text-flag-bright"
            >
              <span aria-hidden>←</span> Quay lại bản đồ
            </Link>

            {/* 4 · Câu chuyện lịch sử */}
            <Reveal variant="settle" className="mt-10">
              <Prose>
                <p>{site.historicalContext}</p>
              </Prose>
            </Reveal>

            {/* 6 · Giá trị lịch sử */}
            <Reveal variant="settle">
              <ProseHeading level="h2">Giá trị lịch sử</ProseHeading>
              <Prose>
                <p>{site.historicalSignificance}</p>
              </Prose>
            </Reveal>

            {/* 7 · Bộ sưu tập hình ảnh */}
            <Reveal variant="settle">
              <ProseHeading level="h2">Bộ sưu tập hình ảnh</ProseHeading>
            </Reveal>
            <Reveal
              variant="mask"
              className="mt-6 grid gap-5 sm:grid-cols-2"
            >
              {publicImages.length > 0 ? (
                publicImages.map((image) => (
                  <ArchiveImage key={image.id} item={image} ratio="4 / 3" />
                ))
              ) : (
                <p className="text-pretty text-[0.9rem] leading-relaxed text-paper-mute">
                  Bộ sưu tập hình ảnh đang được bổ sung.
                </p>
              )}
            </Reveal>

            {/* Dải thời gian liên quan — trục dọc, năm chạy bên trái */}
            {relatedEvents.length > 0 ? (
              <Reveal variant="settle" className="mt-16">
                <ProseHeading level="h2">Mốc thời gian liên quan</ProseHeading>
                <ol className="mt-8 border-l border-line pl-6">
                  {relatedEvents.map((event) => (
                    <li key={event.id} className="relative pb-8 last:pb-0">
                      <span
                        aria-hidden
                        className="absolute -left-[1.9rem] top-1.5 size-2 rotate-45 border border-gold-dim bg-ink"
                      />
                      <p className="font-mono text-[0.72rem] tabular-nums tracking-[0.12em] text-gold">
                        {event.year}
                        {event.dateLabel ? ` · ${event.dateLabel}` : ""}
                      </p>
                      <h3 className="mt-2 text-pretty font-display text-lg uppercase leading-snug text-paper">
                        {event.title}
                      </h3>
                      <p className="mt-2.5 max-w-[58ch] text-pretty text-[0.86rem] leading-[1.75] text-paper-mute">
                        {event.summary}
                      </p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            ) : null}

            {/* 9 · Nguồn tham khảo — trung thực khi chưa có nguồn */}
            <Reveal variant="settle">
              <ProseHeading level="h2">Nguồn tham khảo</ProseHeading>
            </Reveal>
            <Reveal variant="up">
              {site.sources.length > 0 ? (
                <>
                  <p className="mt-6 text-[0.85rem] leading-relaxed text-paper-faint">
                    {site.sources.length} nguồn đã được đối chiếu trực tiếp. Dưới
                    đây là nơi kiểm chứng từng thông tin trên trang này.
                  </p>
                  <ul className="mt-5 space-y-5">
                    {site.sources.map((source) => (
                      <li
                        key={source.id}
                        className="border-l-2 border-line-strong pl-5"
                      >
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-[0.95rem] leading-snug text-paper underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-gold hover:decoration-gold"
                          >
                            {source.title}
                          </a>
                        ) : (
                          <p className="text-[0.95rem] leading-snug text-paper">
                            {source.title}
                          </p>
                        )}
                        {source.publisher ? (
                          <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper-faint">
                            {source.publisher}
                          </p>
                        ) : null}
                        {source.note ? (
                          <p className="mt-2.5 text-pretty text-[0.85rem] leading-relaxed text-paper-mute">
                            {source.note}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-6 border-l-2 border-gold-dim bg-ink-900/60 px-5 py-4 text-pretty text-[0.88rem] leading-relaxed text-paper-mute">
                  Nguồn tham khảo đang được bổ sung. Nội dung trên trang này chưa
                  được đối chiếu với hồ sơ lưu trữ chính thức — vui lòng tham khảo
                  nguồn độc lập khi sử dụng cho mục đích học tập.
                </p>
              )}
            </Reveal>
          </div>

          {/* ── Cột phụ ───────────────────────────────────────────────── */}
          <aside className="lg:col-span-5">
            <div className="space-y-8 lg:sticky lg:top-32">
              {/* 3 · Thông tin nhận diện */}
              <div className="border border-line bg-ink-800/70 p-7">
                <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-paper-faint">
                  Thông tin nhận diện
                </h2>

                <dl className="mt-6 space-y-4 font-mono text-[0.72rem] leading-relaxed">
                  <div>
                    <dt className="text-paper-faint">Giai đoạn</dt>
                    <dd className="mt-1 text-paper-dim">
                      {periodLabel(site.period)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-paper-faint">Loại địa điểm</dt>
                    <dd className="mt-1 text-paper-dim">
                      {categoryLabel(site.category)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-paper-faint">Chủ đề</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {site.topics.map((topic) => (
                        <span
                          key={topic}
                          className="border border-line-strong px-2 py-1 text-[0.62rem] uppercase tracking-[0.12em] text-paper-mute"
                        >
                          {topicLabel(topic)}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-paper-faint">Địa chỉ</dt>
                    <dd className="mt-1 text-paper-dim">
                      {address ?? (
                        <span className="text-paper-faint">{PENDING_LABEL}</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* 8 · Vị trí trên bản đồ */}
              <div className="relative border border-line bg-ink-900 p-7">
                <GridField className="opacity-[0.06]" />
                <h2 className="relative font-mono text-[0.62rem] uppercase tracking-[0.24em] text-paper-faint">
                  Vị trí trên bản đồ
                </h2>

                <div className="relative mt-6 space-y-4">
                  {coordinates ? (
                    <>
                      <p className="font-mono text-[0.68rem] leading-relaxed text-paper-mute">
                        {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                      </p>
                      {approximate ? (
                        <p className="border-l-2 border-gold-dim pl-3 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.14em] text-gold-dim">
                          {APPROXIMATE_BADGE_LABEL} — tọa độ mang tính ước lượng,
                          không dùng làm vị trí chính xác.
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p className="border-l-2 border-line-strong pl-3 text-[0.85rem] leading-relaxed text-paper-mute">
                      Địa điểm này chưa được xác minh nên chưa hiển thị trên bản
                      đồ. Chúng tôi ưu tiên tính chính xác hơn là hiển thị vị
                      trí chưa kiểm chứng.
                    </p>
                  )}

                  <Button href="/ban-do" variant="outline" size="sm">
                    Xem vị trí trên bản đồ
                  </Button>
                </div>
              </div>

              {/* 5 · Sự kiện liên quan */}
              {relatedEvents.length > 0 ? (
                <div className="border border-line bg-ink-800/70 p-7">
                  <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-paper-faint">
                    Sự kiện liên quan
                  </h2>
                  <ul className="mt-6 space-y-4">
                    {relatedEvents.map((event) => (
                      <li key={event.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                        <p className="font-mono text-[0.68rem] tabular-nums text-gold">
                          {event.year}
                          {event.dateLabel ? ` · ${event.dateLabel}` : ""}
                        </p>
                        <p className="mt-1.5 text-[0.88rem] leading-snug text-paper-dim">
                          {event.title}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* 10 · Các địa điểm liên quan */}
              {relatedSites.length > 0 ? (
                <div className="border border-line bg-ink-800/70 p-7">
                  <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-paper-faint">
                    Địa điểm liên quan
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {relatedSites.map((related) => (
                      <li key={related.id}>
                        <Link
                          href={`/ho-so/${related.slug}`}
                          className="text-[0.9rem] text-paper-dim transition-colors duration-300 hover:text-flag-bright"
                        >
                          {related.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}