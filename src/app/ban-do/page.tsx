import type { Metadata } from "next";
import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { MapExplorer } from "@/components/map/MapExplorer";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Bản đồ địa chỉ đỏ",
  description:
    "Lịch sử không chỉ được ghi lại trong sách. Nó còn hiện diện trong những con đường, ngôi nhà và địa điểm đã chứng kiến các phong trào đấu tranh của thành phố.",
};

/**
 * Trang bản đồ địa chỉ đỏ.
 *
 * Đây là Server Component. Toàn bộ tương tác nằm trong `MapExplorer`
 * (Client Component), và bản thân bản đồ Leaflet được nạp động với
 * `ssr: false` bên trong nó — vì vậy cây server KHÔNG bao giờ chạm tới
 * `leaflet`, hoàn toàn không hỏng.
 *
 * `MapExplorer` lấy dữ liệu từ `getPublicSites()` — chỉ những địa điểm đã
 * qua cổng kiểm duyệt mới tới được tay người dùng.
 */
export default function BanDoPage() {
  return (
    <ChapterFrame
      index="01"
      label="Red Address Map"
      title="Bản đồ ký ức"
      headingLevel="h1"
      description="Lịch sử không chỉ được ghi lại trong sách. Nó còn hiện diện trong những con đường, ngôi nhà và địa điểm đã chứng kiến các phong trào đấu tranh của thành phố. Hãy khám phá những địa chỉ đỏ tại Sài Gòn, tìm hiểu câu chuyện phía sau mỗi địa điểm và kết nối chúng thành một hành trình xuyên thời gian."
      plate="grid"
    >
      <MapExplorer />

      <div className="mt-16 flex flex-wrap justify-center gap-4">
        <Button href="/dong-thoi-gian" variant="outline">
          Tiếp tục khám phá lịch sử
        </Button>
      </div>
    </ChapterFrame>
  );
}