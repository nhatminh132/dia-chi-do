import type { Metadata } from "next";
import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { TimelineExplorer } from "@/components/timeline/TimelineExplorer";
import { GridField } from "@/components/media/CinematicPlate";

export const metadata: Metadata = {
  title: "Dòng thời gian",
  description:
    "Tìm hiểu những cột mốc tiêu biểu của hành trình đấu tranh giải phóng dân tộc, từ quá trình tìm đường cứu nước đến thắng lợi của sự nghiệp thống nhất đất nước.",
};

/**
 * Trang dòng thời gian.
 *
 * Khung là Server Component, phần danh sách là Client Component vì có bộ
 * lọc. Dữ liệu lấy từ `src/data/events.ts` qua `getEvents()` — trang này
 * KHÔNG chứa lại bất kỳ nội dung sự kiện nào.
 */
export default function DongThoiGianPage() {
  return (
    <ChapterFrame
      index="02"
      label="Timeline"
      title="Hành trình lịch sử"
      headingLevel="h1"
      description="Tìm hiểu những cột mốc tiêu biểu của hành trình đấu tranh giải phóng dân tộc, từ quá trình tìm đường cứu nước đến thắng lợi của sự nghiệp thống nhất đất nước."
      plate="ember"
    >
      <GridField className="opacity-[0.035]" />

      <TimelineExplorer />
    </ChapterFrame>
  );
}