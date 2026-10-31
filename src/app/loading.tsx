import { LoadingScreen } from "@/components/ui/LoadingScreen";

/**
 * Trạng thái chờ của toàn trang.
 * Được Next.js dùng tự động trong lúc server component đang được render.
 */
export default function Loading() {
  return <LoadingScreen />;
}
