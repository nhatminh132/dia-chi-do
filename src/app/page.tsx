import { ChatCapsule } from "@/components/chat/ChatCapsule";
import { ChapterRail } from "@/components/cinematic/ChapterRail";
import { ArchiveResistanceMapSection } from "@/components/home/ArchiveResistanceMapSection";
import { ClosingSection } from "@/components/home/ClosingSection";
import { EndCredits } from "@/components/home/EndCredits";
import { Hero } from "@/components/home/Hero";
import { SoutheastAsiaSection } from "@/components/home/SoutheastAsiaSection";
import { StorySection } from "@/components/home/StorySection";

/**
 * Trang chủ — bảy cảnh cinematic.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  BẢN ĐỒ BẢY CẢNH
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   01  chapter-01            Cờ đỏ                    Hero
 *   02  chapter-02            Thành phố và ký ức         StorySection
 *       chapter-02-journey      └ nhịp B: dòng thời gian
 *   03  chapter-03            Kho · Kháng chiến · Bản đồ ArchiveResistanceMapSection
 *   04  chapter-06            Đông Nam Á                SoutheastAsiaSection
 *   05  chapter-07            Ký ức vẫn còn đây         ClosingSection
 *       chapter-07-quiz         └ nhịp cuối: thử thách lịch sử
 *
 *  ── Thứ tự này khác bản V1, và đó là chủ ý ────────────────────────────────
 *
 *  Bản V1 đi: mở đầu → lời mở đầu → địa chỉ đỏ → dòng thời gian → Đông Nam
 *  Á → kho tư liệu → thử thách → kết thúc.
 *
 *  Storyboard V2 yêu cầu: cờ → thành phố → MỞ KHO LƯU TRỮ → dấu vết kháng
 *  chiến → bản đồ → Đông Nam Á → ký ức. Kho lưu trữ được lên trước vì nó
 *  là chỗ giới thiệu BẰNG CHỨNG trước khi dẫn tới các địa điểm; bản đồ
 *  được đặt sau dấu vết kháng chiến vì bản đồ là nơi các địa điểm hội tụ.
 *
 *  ── Không nội dung nào bị mất ────────────────────────────────────────────
 *
 *  Mọi mục của bản V1 vẫn còn, chỉ đổi chỗ và được đặt trong một cảnh:
 *
 *   • Văn xuôi "Một thành phố…"          → nhịp A của cảnh 02
 *   • Dòng thời gian ghim ngang            → nhịp B của cảnh 02
 *   • Bốn danh mục kho tư liệu             → cảnh 03
 *   • Ba địa chỉ đỏ tiêu biểu             → cảnh 04
 *   • Đông Nam Á                           → cảnh 06
 *   • Đoạn kết + thông điệp               → cảnh 07
 *   • Thử thách lịch sử                    → nhịp cuối của cảnh 07
 *
 *  THÊM MỚI (không thay thế): dải tấm lưu trữ ở cảnh 03, và bản đồ thật ở
 *  cảnh 05.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Chỉ báo chương — bảy mục, đúng thứ tự bảy cảnh. */
const SCENE_NAV = [
  { id: "chapter-01", number: "01", label: "Cờ đỏ" },
  {
    id: "chapter-02",
    number: "02",
    label: "Thành phố",
    /* Cảnh 02 gồm cả phần văn xuôi và dòng thời gian. */
    ids: ["chapter-02-journey"],
  },
  { id: "chapter-03", number: "03", label: "Kho · Kháng chiến · Bản đồ" },
  { id: "chapter-06", number: "04", label: "Đông Nam Á" },
  {
    id: "chapter-07",
    number: "05",
    label: "Ký ức",
    ids: ["chapter-07-quiz"],
  },
] as const;

export default function Home() {
  return (
    <>
      <ChapterRail chapters={SCENE_NAV} />

      <Hero />
      <StorySection />
      <ArchiveResistanceMapSection />
      <SoutheastAsiaSection />
      <ClosingSection />
      <EndCredits />

      <ChatCapsule />
    </>
  );
}

