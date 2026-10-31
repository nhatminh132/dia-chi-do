import Link from "next/link";
import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { Reveal } from "@/components/anim/Reveal";
import { ArchivalPlate } from "@/components/media/ArchivalPlate";
import { GridField } from "@/components/media/CinematicPlate";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { APPROXIMATE_BADGE_LABEL, PENDING_LABEL, isApproximate, publicAddress } from "@/lib/content-status";
import { getFeaturedSites, periodLabel, topicLabel } from "@/lib/content";
import { getScene } from "@/lib/scenes";

/**
 * CẢNH 04 — DẤU VẾT KHÁNG CHIẾN
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  Nội dung theo Idea.txt §2.3: ba địa điểm tiêu biểu, mỗi địa điểm mang
 *  nhãn trạng thái kiểm chứng nếu nội dung chưa được đối chiếu.
 *
 *  ── Ngôn ngữ thị giác "khám phá địa điểm" ─────────────────────────────────
 *
 *  Bốn yếu tố, đều tiết chế:
 *
 *   1. KHUNG LƯU TRỮ — mỗi địa điểm có một khung ảnh có số hiệu tấm, đúng
 *      ngôn ngữ của một tấm in trong kho lưu trữ. Không có ảnh nào được
 *      công bố, và đó là quyết định biên tập — nên khung được dựng thành
 *      TẤM LƯU TRỮ có số hiệu, chứ không phải một ô xám trống.
 *
 *   2. NHÃN BIÊN TẬP — chủ đề, giai đoạn, địa chỉ, nhãn toạ độ xấp xỉ.
 *
 *   3. ĐƯỜNG KẺ MẢNH — một sợi dọc chạy suốt lưới trên desktop, nối các
 *      địa điểm thành một hành trình thay vì những thẻ rời rạc.
 *
 *   4. CHUYỂN ĐỘNG TIẾT CHẾ — thẻ trôi vào nhẹ, không nhảy.
 *
 *  ── Công bố dựng lại ──────────────────────────────────────────────────────
 *
 *  Nền của cảnh này là MỘT DỰNG LẠI (nếu clip được thêm vào). Người xem có
 *  thể tưởng rằng đó là phim tư liệu thật, nên công bố bắt buộc phải nằm
 *  NGAY TRONG CẢNH, không giấu ở trang nguồn. Nội dung công bố lấy từ
 *  manifest (`src/data/scenes.ts`) để chỉ sửa ở một chỗ.
 */
export function RedAddressesSection() {
  const scene = getScene("scene-04-resistance");
  const featured = getFeaturedSites();

  return (
    <ChapterFrame
      id="chapter-04"
      index="04"
      label="Traces of Resistance"
      title="Những địa chỉ lưu giữ ký ức."
      description="Ẩn sau những con đường và công trình của thành phố là những câu chuyện lịch sử đáng được tìm hiểu. Khám phá các địa điểm gắn với hành trình đấu tranh cách mạng tại Sài Gòn."
      plate="grid"
      scene={scene}
    >
      <GridField className="opacity-[0.035]" />

      {/* Công bố dựng lại — ngay trong cảnh, không giấu. */}
      {scene?.reconstructionDisclosure ? (
        <Reveal variant="up" respectReducedMotion>
          <p className="mt-2 max-w-3xl border-l-2 border-gold-dim bg-ink-900/60 px-5 py-4 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.14em] text-gold-dim">
            {scene.reconstructionDisclosure}
          </p>
        </Reveal>
      ) : null}

      <div className="relative">
        {/* Sợi dọc nối các địa điểm — chỉ trên desktop. */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[-0.9rem] top-2 hidden w-px bg-gradient-to-b from-transparent via-line-strong to-transparent lg:block"
        />

        <Reveal
          variant="drift"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
          respectReducedMotion
        >
          {featured.map((site, index) => {
            const address = publicAddress(site);
            const approximate = isApproximate(site);

            return (
              <article
                key={site.id}
                className="group relative flex flex-col border border-line bg-ink-800 transition-[border-color,transform,background-color] duration-500 ease-cinematic hover:-translate-y-1 hover:border-flag-red/60 hover:bg-ink-700"
              >
                {/* Số thứ tự — neo thị giác cho lưới */}
                <span
                  aria-hidden
                  className="absolute right-5 top-5 font-mono text-[0.62rem] tabular-nums tracking-[0.18em] text-paper-faint"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Khung hình ảnh. Không có ảnh nào được công bố cho các
                    địa điểm này, và đó là quyết định biên tập chứ không phải
                    thiếu sót — nên khung được dựng thành một TẤM LƯU TRỮ có
                    số hiệu, cùng ngôn ngữ thị giác với bàn sáng ở hero. */}
                <div className="relative aspect-4/3 border-b border-line bg-ink-900">
                  <ArchivalPlate
                    plate={`Plate ${String(index + 1).padStart(2, "0")}`}
                    title="Tư liệu ảnh chưa công bố"
                    note="Chờ xác minh nguồn lưu trữ"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-flag-bright">
                      {topicLabel(site.topics[0])}
                    </span>
                    <StatusBadge status={site.status} />
                  </div>

                  <h3 className="mt-4 font-display text-[1.35rem] uppercase leading-tight text-paper">
                    {site.name}
                  </h3>

                  <p className="mt-3 flex-1 text-pretty text-[0.9rem] leading-relaxed text-paper-mute">
                    {site.summary}
                  </p>

                  {/* Trạng thái địa chỉ / tọa độ — trung thực, không bịa */}
                  <dl className="mt-5 space-y-1.5 border-t border-line pt-4 font-mono text-[0.66rem] leading-relaxed">
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-paper-faint">Giai đoạn</dt>
                      <dd className="text-paper-mute">{periodLabel(site.period)}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-paper-faint">Địa chỉ</dt>
                      <dd className="text-paper-mute">
                        {address ?? <span className="text-paper-faint">{PENDING_LABEL}</span>}
                      </dd>
                    </div>
                    {approximate ? (
                      <div className="flex gap-2">
                        <dt className="shrink-0 text-gold-dim">Vị trí</dt>
                        <dd className="text-gold-dim">{APPROXIMATE_BADGE_LABEL}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/ho-so/${site.slug}`}
                      className="inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-paper-dim transition-colors duration-300 hover:text-flag-bright"
                    >
                      Khám phá di tích
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                    <Link
                      href="/ban-do"
                      className="inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-paper-faint transition-colors duration-300 hover:text-flag-bright"
                    >
                      Xem trên bản đồ
                      <span aria-hidden>↗</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>

      <Reveal variant="up" className="mt-14 flex justify-center" respectReducedMotion>
        <Button href="/ban-do" variant="outline" size="lg">
          Xem tất cả địa chỉ đỏ
        </Button>
      </Reveal>
    </ChapterFrame>
  );
}
