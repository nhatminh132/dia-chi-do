import { ChapterFrame } from "@/components/anim/ChapterFrame";
import { Reveal } from "@/components/anim/Reveal";
import { Chapter03Explorer } from "@/components/home/Chapter03Explorer";
import { getPublicSites } from "@/lib/content";
import { getScene } from "@/lib/scenes";

/** Part 03 — một carousel duy nhất: ảnh · địa chỉ đỏ · bản đồ cho từng hồ sơ. */
export function ArchiveResistanceMapSection() {
  const scene = getScene("scene-03-archive");
  const sites = getPublicSites();

  return (
    <ChapterFrame
      id="chapter-03"
      index="03"
      label="Archive · Resistance · Map"
      title="Những chứng tích của thời gian."
      description="Từ tư liệu lưu trữ đến những địa chỉ đỏ và bản đồ ký ức, mỗi lớp dữ liệu mở thêm một góc nhìn về lịch sử thành phố."
      plate="paper"
      scene={scene}
      slateMeta={`${sites.length} hồ sơ công khai`}
    >
      <div className="max-w-3xl">
        <Reveal variant="settle" respectReducedMotion>
          <p className="text-pretty text-[1rem] leading-[1.85] text-paper-mute">
            Ba lớp tư liệu của cùng một thành phố nằm trong một tấm thẻ duy
            nhất: ảnh lưu trữ, địa chỉ đỏ và bản đồ ký ức. Vuốt ngang để đi
            qua từng địa chỉ.
          </p>
        </Reveal>
      </div>

      <div data-merged-part="03">
        <Chapter03Explorer sites={sites} />
      </div>
    </ChapterFrame>
  );
}
