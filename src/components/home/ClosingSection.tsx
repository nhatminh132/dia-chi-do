import Link from "next/link";
import { Reveal } from "@/components/anim/Reveal";
import { ParallaxGhost } from "@/components/anim/ParallaxGhost";
import { SceneBackdrop } from "@/components/cinematic/SceneBackdrop";
import { SceneMedia } from "@/components/cinematic/SceneMedia";
import { SceneSeam } from "@/components/cinematic/SceneSeam";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { QuizTeaserSection } from "@/components/home/QuizTeaserSection";
import { getFeaturedSites, getPublicEvents } from "@/lib/content";
import { SITE } from "@/lib/navigation";
import { getScene } from "@/lib/scenes";

/**
 * CẢNH 07 — KÝ ỨC VẪN CÒN ĐÂY
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  Đây là "màn rạp" của trang chủ (Idea.txt §2.8) — nhưng ở bản V2 nó
 *  mang thêm hai việc:
 *
 *   1. Tuyên bố kết: `LỊCH SỬ VẪN Ở ĐÂY.` — câu dứt của cả bảy cảnh.
 *
 *   2. DANH SÁCH LIÊN KẾT CÓ NGHĨA. Không phải một hàng nút quảng bá,
 *      mà là sáu lối đi tiếp: hồ sơ di tích, bản đồ, dòng thời gian, kho
 *      tư liệu, nguồn tham khảo và thử thách. Mỗi lối dẫn tới một nơi có
 *      thật trong dự án.
 *
 *  ── Vì sao tiêu đề cũ vẫn còn ────────────────────────────────────────────
 *
 *  Idea.txt §2.8 đặt tiêu đề là "LỊCH SỬ KHÔNG CHỈ ĐỂ NHỚ." Câu đó được
 *  giữ lại ở đây như dòng dẫn trước tuyên bố — nội dung không bị mất, và
 *  tuyên bố mới có chỗ đứng riêng.
 *
 *  ── Vì sao phần thử thách nằm trong cảnh này ───────────────────────────────
 *
 *  Bảy cảnh là bảy CHƯƠNG. Phần "thử thách" vốn là một chương riêng; đặt
 *  nó vào cuối cảnh 07 làm cảnh kết thúc trọn vẹn hơn: người xem đã đi hết
 *  chuyện, giờ họ có lựa chọn — đọc thêm, hoặc kiểm tra xem mình nhớ bao nhiêu.
 */
export function ClosingSection() {
  const scene = getScene("scene-07-finale");
  const featured = getFeaturedSites();
  const years = getPublicEvents().map((event) => event.year);
  const timelineRange = years.length
    ? `${Math.min(...years)} đến ${Math.max(...years)}`
    : null;

  return (
    <section
      id="chapter-07"
      aria-labelledby="closing-title"
      data-scene="scene-07-finale"
      className="relative isolate overflow-hidden border-t border-line bg-ink-900"
    >
      <SceneSeam index="07" />

      {/* ══ LỚP A — KHÍ QUYỂN PHÒNG TRƯNG BÀY ═══════════════════════════ */}
      {scene ? <SceneMedia scene={scene} /> : null}
      <SceneBackdrop sceneId="scene-07-finale" />

      {/* Lớp tối cho tương phản chữ. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.86) 46%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      <ParallaxGhost
        strength={0.9}
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 font-display text-[28rem] leading-none text-flag-bright/[0.05] select-none"
      >
        ĐỎ
      </ParallaxGhost>

      <Container width="wide" className="relative py-28 text-center sm:py-32 lg:py-40">
        <Reveal variant="settle" className="mx-auto max-w-3xl" respectReducedMotion>
          {/* Dòng dẫn — tiêu đề của đặc tả nội dung, giữ nguyên. */}
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-paper-faint">
            Lịch sử không chỉ để nhớ.
          </p>

          {/* Tuyên bố kết của cả bảy cảnh. */}
          <h2
            id="closing-title"
            className="mt-6 text-balance font-display text-[clamp(2rem,6.2vw,5rem)] uppercase leading-[1.02] text-paper text-cinematic"
          >
            Lịch sử vẫn ở đây.
          </h2>

          <Prose className="mx-auto mt-10 text-center" size="lg">
            <p>
              Lịch sử còn là cách chúng ta hiểu giá trị của độc lập, tự do và
              trách nhiệm gìn giữ những ký ức của dân tộc.
            </p>
            <p>
              Qua không gian trưng bàm ĐỊA CHỎ ĐỎ, chúng tôi mong muốn đưa
              những dấu mốc lịch sử đến gần hơn với người trẻ, để mỗi chuyến
              khám phá không chỉ là hành trình tìm hiểu quá khứ mà còn là dịp
              suy ngẫm về hiện tại và tương lai.
            </p>
          </Prose>

          {/* Thông điệp */}
          <p className="mt-14 font-mono text-[0.72rem] uppercase leading-relaxed tracking-[0.26em] text-gold sm:text-[0.88rem]">
            {SITE.tagline}
          </p>

          <div className="mt-12 flex justify-center">
            <Button href="/ban-do" size="lg" className="sm:min-w-64">
              Bắt đầu hành trình
            </Button>
          </div>
        </Reveal>

        {/* ══ DANH SÁCH LIÊN KẾT CÓ NGHĨA ═══════════════════════════════ */}
        <Reveal variant="up" className="mx-auto mt-24 max-w-5xl" respectReducedMotion>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-paper-faint">
            Tiếp tục khám phá
          </p>

          <ul className="mt-8 grid gap-px border border-line bg-line text-left sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((site) => (
              <li key={site.id}>
                <Link
                  href={`/ho-so/${site.slug}`}
                  className="group flex h-full flex-col bg-ink p-6 transition-colors duration-400 hover:bg-ink-800"
                >
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-flag-bright">
                    Hồ sơ di tích
                  </span>
                  <span className="mt-3 font-display text-[1.02rem] uppercase leading-snug text-paper">
                    {site.name}
                  </span>
                  <span className="mt-4 flex-1 text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
                    {site.summary}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper-faint transition-colors duration-300 group-hover:text-gold">
                    Mở hồ sơ
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}

            {(
              [
                { href: "/ban-do", label: "Bản đồ địa chỉ đỏ", note: "Toạ độ và địa chỉ đã kiểm chứng." },
                { href: "/dong-thoi-gian", label: "Dòng thời gian", note: timelineRange ? `Các cột mốc từ ${timelineRange}.` : "Các cột mốc lịch sử của thành phố." },
                { href: "/tu-lieu", label: "Kho tư liệu", note: "Ảnh, bản đồ, văn bản, hiện vật." },
                { href: "/nguon-tham-khao", label: "Nguồn tham khảo", note: "Mọi thông tin dẫn về nơi kiểm chứng được." },
                { href: "/thu-thach", label: "Thử thách lịch sử", note: "Kiểm tra những gì đã khám phá." },
              ] as const
            ).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex h-full flex-col bg-ink p-6 transition-colors duration-400 hover:bg-ink-800"
                >
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-flag-bright">
                    Khám phá
                  </span>
                  <span className="mt-3 font-display text-[1.02rem] uppercase leading-snug text-paper">
                    {link.label}
                  </span>
                  <span className="mt-4 flex-1 text-pretty text-[0.82rem] leading-relaxed text-paper-mute">
                    {link.note}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper-faint transition-colors duration-300 group-hover:text-gold">
                    Mở mục
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      {/* ══ NHỊP CUỐI — THỬ THÁCH LỊCH SỬ ════════════════════════════════ */}
      <QuizTeaserSection />
    </section>
  );
}
