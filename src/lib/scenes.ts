import { SCENES, SCENE_TOTAL_DURATION_SECONDS } from "@/data/scenes";
import type { SceneId, SceneVideo } from "@/data/types";

/**
 * ══════════════════════════════════════════════════════════════════════════
 *  BỘ CHỌN CẢNH — lớp đọc dữ liệu cho lớp cinematic
 * ══════════════════════════════════════════════════════════════════════════
 *
 *  Giao diện không import thẳng `src/data/scenes.ts` mà đi qua đây, đúng
 *  như `src/lib/content.ts` làm cho nội dung lịch sử. Một chỗ quyết định,
 *  một chỗ sửa.
 */

/** Danh sách bảy cảnh, đúng thứ tự storyboard. */
export const SCENE_LIST: SceneVideo[] = SCENES;

/** Tổng thời lượng dự kiến của tư liệu khí quyển (giây). */
export { SCENE_TOTAL_DURATION_SECONDS };

/** Lấy một cảnh theo định danh. */
export function getScene(id: SceneId): SceneVideo | undefined {
  return SCENES.find((scene) => scene.id === id);
}

/**
 * Cảnh này đã có tệp video thật chưa?
 *
 * Đây là câu hỏi DUY NHẤT được phép quyết định có render thẻ `<video>`
 * hay không. `src` rỗng ⇒ không có thẻ video nào được tạo ra, nên trình
 * duyệt không bao giờ phát sinh một request cho một URL rỗng.
 */
export function hasSceneVideo(scene: SceneVideo): boolean {
  return scene.src.trim().length > 0;
}

/** Đường dẫn nguồn đã cắt khoảng trắng — `""` nếu chưa có tư liệu. */
export function sceneSource(scene: SceneVideo): string {
  return scene.src.trim();
}

/**
 * Cảnh này là DỰNG LẠI (tái tạo) chứ không phải tư liệu gốc?
 *
 * Nếu có, mọi nơi hiển thị lớp khí quyển của cảnh phải kèm công bố.
 */
export function isReconstruction(scene: SceneVideo): boolean {
  return Boolean(scene.reconstructionDisclosure?.trim());
}

/** Danh sách cảnh đang THIẾU tư liệu — dùng cho báo cáo và trạng thái. */
export function getMissingScenes(): SceneVideo[] {
  return SCENES.filter((scene) => !hasSceneVideo(scene));
}

/**
 * Ghi chú về tư liệu còn thiếu, dùng để hiển thị trong tài liệu dự án.
 * Giữ ở đây (không hardcode ở component) để khi thêm tệp, danh sách này
 * tự rỗng đi theo.
 */
export function getMissingSceneNotes(): {
  id: SceneId;
  title: string;
  expectedPath: string;
  durationSeconds: number;
}[] {
  return getMissingScenes().map((scene) => ({
    id: scene.id,
    title: scene.title,
    expectedPath: `/video/${scene.id}.mp4`,
    durationSeconds: scene.durationSeconds,
  }));
}
