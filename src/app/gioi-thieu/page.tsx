import type { Metadata } from "next";
import { ParallaxBackdrop } from "@/components/anim/ParallaxBackdrop";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GridField } from "@/components/media/CinematicPlate";
import { Prose, ProseHeading } from "@/components/ui/Prose";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PENDING_LABEL } from "@/lib/content-status";
import { TEAM } from "@/data/team";

export const metadata: Metadata = {
  title: "Giới thiệu dự án",
  description:
    "ĐỊA CHỈ ĐỎ — một không gian triển lãm lịch sử dành cho thế hệ trẻ, xây dựng nhằm tìm hiểu hành trình đấu tranh giành độc lập của Sài Gòn.",
};

/** Nội dung theo Idea.txt §9. */
const EDUCATION_GOALS = [
  "Tìm hiểu các địa điểm và sự kiện lịch sử tại Sài Gòn.",
  "Nhận thức vai trò của các phong trào yêu nước và cách mạng.",
  "Kết nối lịch sử thành phố với tiến trình đấu tranh giành độc lập của Việt Nam.",
  "Mở rộng góc nhìn về các phong trào giải phóng dân tộc ở Đông Nam Á.",
  "Khuyến khích học sinh chủ động nghiên cứu và kiểm chứng tư liệu lịch sử.",
];

const METHODS = [
  "Thu thập thông tin từ các nguồn đáng tin cậy.",
  "Đối chiếu thông tin giữa nhiều nguồn khi cần.",
  "Sử dụng hình ảnh có nguồn gốc và quyền sử dụng phù hợp.",
  "Tổ chức nội dung theo địa điểm, thời gian và chủ đề.",
  "Xây dựng trải nghiệm tương tác để hỗ trợ việc học lịch sử.",
];

/** Thông tin nhóm do nhóm cung cấp. Trường nào chưa có thì để PENDING_LABEL. */
const TEAM_INFO: { label: string; value: string | null }[] = [
  { label: "Tên nhóm", value: TEAM.name },
  { label: "Thành viên", value: TEAM.members.join(", ") },
  { label: "Lớp", value: TEAM.className },
  { label: "Trường", value: TEAM.school },
  { label: "Giáo viên hướng dẫn", value: TEAM.teacher },
];

export default function GioiThieuPage() {
  return (
    <>
      {/* Đầu trang */}
      <section className="relative isolate overflow-hidden border-b border-line">
        {/* Nền trôi theo cuộn — trước đây trang này gần như đứng yên. */}
        <ParallaxBackdrop
          strength={64}
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, #5E0715 0%, #120A0C 45%, #0A0A0A 80%)",
          }}
        />
        <ParallaxBackdrop strength={30} className="opacity-[0.05]">
          <GridField />
        </ParallaxBackdrop>
        <Container width="wide" className="relative py-24 sm:py-28 lg:py-36">
          <Reveal variant="stagger">
            <SectionLabel index="06" title="About the project" />
            <h1 className="mt-7 text-balance font-display text-[clamp(2.2rem,6.5vw,5rem)] uppercase leading-[1.03] text-paper">
              Về Địa chỉ đỏ
            </h1>
            <p className="mt-7 max-w-2xl text-balance font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.2em] text-gold sm:text-[0.85rem]">
              Một không gian triển lãm lịch sử dành cho thế hệ trẻ
            </p>
          </Reveal>
        </Container>
      </section>

      <Container width="wide" className="py-24 sm:py-28 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal variant="stagger" childrenSelector="p">
              <Prose size="lg">
                <p>
                  ĐỊA CHỈ ĐỎ là dự án học tập được xây dựng nhằm tìm hiểu hành
                  trình đấu tranh giành độc lập của Sài Gòn trong dòng chảy của
                  phong trào đấu tranh giành độc lập ở Đông Nam Á.
                </p>
                <p>
                  Thông qua hình thức bảo tàng số, dự án giới thiệu các địa
                  điểm có liên quan đến Đảng Cộng sản Việt Nam và quá trình đấu
                  tranh cách mạng dưới sự lãnh đạo của Đảng.
                </p>
                <p>
                  Website kết hợp bản đồ tương tác, hồ sơ di tích, dòng thời
                  gian, hình ảnh tư liệu và hoạt động kiểm tra kiến thức nhằm
                  giúp lịch sử trở nên trực quan, dễ tiếp cận và hấp dẫn hơn đối
                  với học sinh.
                </p>
              </Prose>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal variant="up" className="lg:sticky lg:top-32">
              {/* Thông tin nhóm do nhóm cung cấp; trường thiếu hiện trạng thái chờ */}
              <div className="border border-line bg-ink-800/70 p-7">
                <h2 className="font-mono text-[0.64rem] uppercase tracking-[0.24em] text-paper-faint">
                  Thông tin nhóm
                </h2>
                <dl className="mt-6 space-y-4">
                  {TEAM_INFO.map((field) => (
                    <div key={field.label}>
                      <dt className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-paper-faint">
                        {field.label}
                      </dt>
                      <dd
                        className={
                          field.value
                            ? "mt-1.5 text-[0.9rem] text-paper-dim"
                            : "mt-1.5 text-[0.9rem] text-paper-faint"
                        }
                      >
                        {field.value ?? PENDING_LABEL}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Mục tiêu + phương pháp */}
        <div className="mt-24 grid gap-14 border-t border-line pt-16 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="stagger">
            <ProseHeading>Mục tiêu giáo dục</ProseHeading>
            <ul className="mt-6 space-y-3">
              {EDUCATION_GOALS.map((goal, index) => (
                <li
                  key={goal}
                  className="flex gap-4 border-b border-line pb-3 text-[0.92rem] leading-relaxed text-paper-dim"
                >
                  <span className="shrink-0 font-mono text-[0.62rem] tabular-nums text-flag-bright">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {goal}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="stagger">
            <ProseHeading>Phương pháp thực hiện</ProseHeading>
            <ul className="mt-6 space-y-3">
              {METHODS.map((method, index) => (
                <li
                  key={method}
                  className="flex gap-4 border-b border-line pb-3 text-[0.92rem] leading-relaxed text-paper-dim"
                >
                  <span className="shrink-0 font-mono text-[0.62rem] tabular-nums text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {method}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal variant="up" className="mt-16 flex flex-wrap gap-4">
          <Button href="/ban-do">Khám phá địa chỉ đỏ</Button>
          <Button href="/" variant="outline">
            Về trang chủ
          </Button>
        </Reveal>
      </Container>
    </>
  );
}