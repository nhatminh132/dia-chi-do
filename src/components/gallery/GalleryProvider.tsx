"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Route } from "next";
import type { Room } from "@/data/rooms";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  NHÂN VẬT ĐIỀU KHIỂN CỦA "BẢO TÀNG ẢO"
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ở đây có ba khái niệm, và việc tách bạch chúng là mấu chốt để mọi thứ
 * hoạt động:
 *
 *  1. SƠ ĐỒ (mapOpen) — lớp phủ toàn màn hình hiển thị mặt bằng các phòng.
 *     Người xem chọn phòng từ đó.
 *
 *  2. HÀNH TRÌNH (travel) — quá trình "đi" từ phòng này sang phòng khác.
 *     Gồm 3 nhịp: rèm CHE kín màn hình → đổi route → rèm MỞ để lộ phòng mới.
 *
 *  3. TRẠNG THÁI RÈM (phase) — "idle" | "closing" | "opening".
 *
 * Vì sao không gộp 1 và 2? Vì có những lần điều hướng KHÔNG cần rèm: bấm
 * nút Back của trình duyệt, hoặc dán trực tiếp một URL. Lúc đó không có
 * "chuyến đi" nào để diễn, chỉ cần trang mới hiện ra. Vì vậy `phase` tách
 * khỏi `mapOpen`: sơ đồ đóng lại (mất focus) nhưng chuyến đi vẫn diễn ra.
 *
 * ── Vì sao phải chờ `pathname` đổi rồi mới mở rèm ─────────────────────────
 *
 * `router.push()` là bất đồng bộ. Nếu mở rèm ngay lập tức, người xem sẽ
 * thấy màn hình đen trước khi nội dung mới kịp tải — nhìn như lỗi. Ta mở
 * rèm khi `pathname` ĐÃ đổi, tức là phòng mới đã thực sự tới nơi. Có thêm
 * một đồng hồ an toàn 4 giây: nếu route không tới (lỗi mạng, route lỗi) thì
 * rèm vẫn mở, người xem không bị kẹt trong màn hình đen.
 */

/** Nhịp của chuyến hành trình. */
export type TravelPhase = "idle" | "closing" | "opening";

interface GalleryContextValue {
  /** Sơ đồ phòng đang mở hay không. */
  mapOpen: boolean;
  openMap: () => void;
  closeMap: () => void;
  /** Bắt đầu đi tới một phòng (rèm sẽ che, đổi route, rồi mở). */
  travelTo: (room: Room) => void;
  /** Nhịp hiện tại của chuyến hành trình. */
  phase: TravelPhase;
  /** Phòng đang đi tới. */
  target: Room | null;
  /** Rèm đã che kín → được phép đổi route. */
  covered: boolean;
  markCovered: () => void;
  /** Rèm đã mở xong → trở về idle. */
  completeTravel: () => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mapOpen, setMapOpen] = useState(false);
  const [phase, setPhase] = useState<TravelPhase>("idle");
  const [target, setTarget] = useState<Room | null>(null);
  const [covered, setCovered] = useState(false);

  /*
    Điều chỉnh state TRONG LÚC RENDER thay vì trong effect.

    Lý do: quy tắc `react-hooks/set-state-in-effect` của React Compiler cấm
    gọi setState đồng bộ trong thân effect — effect sẽ sinh thêm một vòng
    render và có thể lặp. Pattern "điều chỉnh state khi prop đổi" trong lúc
    render là cách React chính thức xử lý việc này, và chỉ chạy MỘT lần
    cho mỗi lần `pathname` đổi (vì `lastPath` được cập nhật ngay).

    Ở đây có hai việc cùng lúc xảy ra khi route đổi:
      1. Đóng sơ đồ (nếu đang mở) — ví dụ người xem bấm Back của trình
         duyệt trong lúc sơ đồ đang che màn hình.
      2. Nếu đang giữa chuyến hành trình và route mới ĐÃ tới nơi → mở rèm.
  */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMapOpen(false);
    if (phase === "closing" && target && pathname === target.href) {
      setPhase("opening");
    }
  }

  // Rèm đã che kín và đang chờ route mới → đổi route.
  useEffect(() => {
    if (phase !== "closing" || !covered || !target) return;
    router.push(target.href as Route);
  }, [phase, covered, target, router]);

  // Đồng hồ an toàn: route không tới trong 4 giây thì mở rèm bằng mọi cách,
  // không để người xem bị kẹt trong màn hình đen.
  useEffect(() => {
    if (phase !== "closing") return;
    const id = window.setTimeout(() => setPhase("opening"), 4000);
    return () => window.clearTimeout(id);
  }, [phase]);

  const openMap = useCallback(() => setMapOpen(true), []);
  const closeMap = useCallback(() => setMapOpen(false), []);

  const travelTo = useCallback(
    (room: Room) => {
      // Đang ở phòng này rồi → chỉ đóng sơ đồ, không diễn chuyến đi.
      if (room.href === pathname) {
        setMapOpen(false);
        return;
      }
      setMapOpen(false);
      setCovered(false);
      setTarget(room);
      setPhase("closing");
    },
    [pathname],
  );

  const markCovered = useCallback(() => setCovered(true), []);

  const completeTravel = useCallback(() => {
    setPhase("idle");
    setTarget(null);
    setCovered(false);
  }, []);

  const value = useMemo<GalleryContextValue>(
    () => ({
      mapOpen,
      openMap,
      closeMap,
      travelTo,
      phase,
      target,
      covered,
      markCovered,
      completeTravel,
    }),
    [mapOpen, openMap, closeMap, travelTo, phase, target, covered, markCovered, completeTravel],
  );

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}

/** Hook truy cập nhân vật điều khiển của bảo tàng ảo. */
export function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error("useGallery phải nằm trong <GalleryProvider>.");
  }
  return ctx;
}
