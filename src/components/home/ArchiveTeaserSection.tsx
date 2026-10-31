import Link from "next/link";
import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { Reveal } from "@/components/anim/Reveal";
import { ArchivalReveal } from "@/components/cinematic/ArchivalReveal";
import { Button } from "@/components/ui/Button";
import { GridField } from "@/components/media/CinematicPlate";
import { getFeaturedSites } from "@/lib/content";
import { publicAddress } from "@/lib/content-status";
import { getScene } from "@/lib/scenes";

/**
 * CẢNH 03 — MỞ KHO LƯU TRỮ
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  Nội dung theo Idea.txt §2.6, bốn danh mục lấy nguyên văn.
 *
 *  ── WOW #2 nằm ở đâu ──────────────────────────────────────────────────────
 *
 *  Phần `archival` của khung chương là dải tấm lưu trữ: mỗi tấm là ẢNH THẬT
 *  (nếu đã có) hoặc khung trưng bày trống có ghi rõ là trống — kèm chú thích,
 *  ngày, địa điểm và LIÊN KẾT NGUỒN thật.
 *
 *  Toàn bộ lấy từ `getFeaturedSites()` — tức đúng những hồ sơ đã qua cổng
 *  kiểm duyệt nội dung. Không có ảnh bịa, không có chú thích bịa.
 *
 *  ── Vì sao bốn danh mục vẫn hiện ──────────────────────────────────────────
 *
 *  Bốn danh mục trả lời "kho này có những gì". Dải tấm lưu trữ trả lời "kho
 *  này đang mở ra thứ gì". Cả hai cần có; bỏ bớt một sẽ mất một phần của
 *  câu chuyện.
 */
const COLLECTIONS = [
  {
    id: "anh-tieu-lieu",
    name: "Ảnh tư liệu",
    description:
      "Ảnh lịch sử, ảnh nhân vật, ảnh sự kiện và hình ảnh các địa điểm qua nhiều giai đoạn.",
  },
  {
    id: "ban-do-lich-su",
    name: "Bản đồ lịch sử",
    description:
      "Bản đồ thành phố và các địa điểm có liên quan đến phong trào đấu tranh.",
  },
  {
    id: "van-ban-tai-lieu",
    name: "Văn bản và tài liệu",
    description:
      "Văn bản lịch sử, tài liệu tuyên truyền, tài liệu lưu trữ và các nguồn đã được xác minh.",
  },
  {
    id: "hien-vat-di-tich",
    name: "Hiện vật và di tích",
    description:
      "Hình ảnh hiện vật, không gian trưng bày và các dấu tích lịch sử.",
  },
] as const;

export function ArchiveTeaserSection() {
  const scene = getScene("scene-03-archive");
  const featured = getFeaturedSites();

  /* Mỗi hồ sơ tiêu biểu đóng góp MỘT tấm lưu trữ cho dải trưng bày.
     Lấy từ dữ liệu thật — không ghép tấm nào cho hồ sơ nào cả. */
  const archivalItems = featured
    .filter((site) => site.images.length > 0)
    .map((site, index) => ({
      item: site.images[0],
      location: publicAddress(site) ?? undefined,
      sources: site.sources,
      siteName: site.name,
      siteHref: `/ho-so/${site.slug}`,
      plate: `Plate ${String(index + 1).padStart(2, "0")}`,
    }));

  return (
    <ChapterFrame
      id="chapter-03"
      index="03"
      label="Opening the Archive"
      title="Những chứng tích của thời gian."
      description="Ảnh lịch sử, bản đồ, văn bản và những tư liệu giúp tái hiện bối cảnh của các phong trào đấu tranh tại Sài Gòn."
      plate="paper"
      scene={scene}
      archival={
        archivalItems.length ? (
          <ArchivalReveal items={archivalItems} />
        ) : null
      }
    >
      <GridField className="opacity-[0.035]" />

      {/* Lời dẫn cảnh — nói thẳng điều người xem sắp thấy. */}
      <Reveal variant="up" respectReducedMotion>
        <p className="measure max-w-3xl text-pretty text-[0.95rem] leading-[1.85] text-paper-mute">
          Mỗi tấm dưới đây là một vị trí trưng bày trong kho. Tấm nào đã có
          ảnh thì hiện ảnh; tấm nào chưa được công bố thì vẫn để trống và ghi
          rõ là trống — bảo tàng không trang trí bằng ảnh minh họa.
        </p>
      </Reveal>

      <Reveal
        variant="drift"
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        respectReducedMotion
      >
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.id}
            href="/tu-lieu"
            className="group flex flex-col border border-line bg-ink-800/70 transition-[border-color,transform,background-color] duration-500 ease-cinematic hover:-translate-y-1 hover:border-gold/50 hover:bg-ink-700"
          >
            {/* Khung ảnh trưng bày — trạng thái tư liệu, không phải ảnh giả */}
            <div className="relative aspect-3/2 overflow-hidden border-b border-line bg-ink-900">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #A2977F 0 1px, transparent 1px 7px)",
                }}
              />
              <span className="absolute inset-0 grid place-items-center px-4 text-center font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.14em] text-paper-faint">
                Tư liệu đang được bổ sung
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-[1.05rem] uppercase leading-snug text-paper">
                {collection.name}
              </h3>
              <p className="mt-3 flex-1 text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
                {collection.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper-faint transition-colors duration-300 group-hover:text-gold">
                Xem danh mục
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </Reveal>

      <Reveal variant="up" className="mt-14 flex justify-center" respectReducedMotion>
        <Button href="/tu-lieu" variant="outline" size="lg">
          Mở kho tư liệu
        </Button>
      </Reveal>
    </ChapterFrame>
  );
}
