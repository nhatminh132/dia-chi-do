"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AUTO_SCROLL_SPEEDS,
  autoScrollStep,
  type AutoScrollSpeed,
} from "@/lib/scroll/scrollBudget";
import { useScrollApi } from "@/lib/scroll/scrollContext";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ĐỘNG CƠ AUTO-SCROLL
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Cuộn trang theo nhịp đều — một tay đọc thay người xem, để họ ngồi xem như
 * xem phim. Đây là chế độ xem của một bảo tàng số, không phải tiện ích cuộn
 * của trình duyệt.
 *
 * ── Cố ý KHÔNG dùng `lenis.scrollTo(…, { duration })` ─────────────────────
 *
 * `scrollTo` phải biết đích TRƯỚC khi bắt đầu chạy. Với auto-scroll, đích đổi
 * liên tục (trang dài ra khi ảnh tải, người xem dừng lại, chạm đáy…), và mỗi
 * lần gọi lại là một tween mới chồng lên tween cũ — nhịp sẽ giật.
 *
 * Nên ở đây điều khiển **từng khung hình**, mỗi khung hình cộng một bước
 * `autoScrollStep(dt, speed)` — không nhiều hơn trần tốc độ, không phụ thuộc
 * máy nhanh hay chậm.
 *
 * ── Vì sao chia bước theo thời gian thật ──────────────────────────────────
 *
 * Nếu qua khung hình nào cũng cộng cứng `speed × dt` thì khi máy rớt khung
 * (dt lớn) bước nhảy lớn đúng bằng phần thời gian đã mất — clip lại bị "tua"
 * đúng tại những lúc máy yếu nhất, tức y hệt lỗi mà `scrollBudget` sinh ra để
 * chặn. Nên mỗi bước tỉ lệ với dt nhưng **luôn bị kẹp vào `autoScrollStep`**:
 * máy yếu cuộn chậm hơn, không bao giờ nhảy.
 *
 * ── Dừng ở đầu Part 03 ────────────────────────────────────────────────────
 *
 * Chế độ tự cuộn chỉ phục vụ phần mở đầu của trang chủ (cờ đỏ → thành phố →
 * kho · kháng chiến · bản đồ). Tới đầu cảnh 03 thì nó **tự dừng và dừng hẳn**
 * ở đúng mép trên của cảnh, để người xem chủ động quyết định có đi tiếp hay
 * không — phần sau là nơi tương tác, không phải nơi để máy cuộn hộ.
 *
 * Nếu người xem bấm phát khi đã ở SAU cảnh 03 (hoặc trang không có cảnh 03,
 * ví dụ các phòng khác), điểm dừng bị bỏ qua và hành vi cũ — chạy tới đáy —
 * được giữ nguyên. Riêng trang CÓ cảnh 03 mà người xem đã ở sau mốc đó thì
 * `start()` từ chối chạy: vùng hoạt động của chế độ này chỉ là Part 01–02.
 * `useAutoScrollZone()` trả cờ "còn trong vùng" để `AutoScrollControl` ẩn hẳn
 * capsule khi ra khỏi Part 02.
 *
 * ── Nhường quyền cho người xem ────────────────────────────────────────────
 *
 * Bánh xe, chạm, bàn phím, nút chuột, hoặc bất kỳ lệnh cuộn nào khác đều
 * DỪNG auto-scroll. Không có ngoại lệ: người xem cầm lái thì máy phải buông.
 */

/** Khung hình cơ sở — dùng để quy đổi bước theo dt thay vì theo số khung hình. */
const FRAME_MS = 1000 / 60;

/** Nơi lưu lựa chọn tốc độ, để lần xem sau giữ nguyên. */
const SPEED_STORAGE_KEY = "dia-chi-do:autoscroll-speed";

/** Điểm dừng của chế độ tự cuộn: đầu Part 03 của trang chủ. */
const STOP_AT_SELECTOR = "#chapter-03";

/** Chạm đáy trang coi như xong. */
function atDocumentEnd(): boolean {
  const doc = document.documentElement;
  return window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
}

/**
 * Vị trí (px trong document) của đầu Part 03; `null` khi trang không có cảnh
 * này. Đọc mỗi khung hình vì ảnh phía trên có thể tải xong và đẩy cảnh xuống.
 */
function stopAtOffset(): number | null {
  const el = document.querySelector(STOP_AT_SELECTOR);
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY;
}

/**
 * Người xem có đang ở vùng auto-scroll được phép chạy không?
 *
 * Vùng đó là Part 01–02 của trang chủ — đúng phần có nền clip scrub mà chế độ
 * tự cuộn phục vụ. Trang không có `#chapter-03` (các phòng khác) trả `true` để
 * giữ nguyên hành vi cũ.
 */
export function useAutoScrollZone(): boolean {
  const [inZone, setInZone] = useState(true);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const limit = stopAtOffset();
      const next = limit === null ? true : window.scrollY < limit - 1;
      setInZone((previous) => (previous === next ? previous : next));
    };

    // Gom về một lần đo mỗi khung hình: sự kiện `scroll` bắn rất dày.
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return inZone;
}

function readStoredSpeed(): AutoScrollSpeed {
  if (typeof window === "undefined") return 1;
  try {
    const raw = Number(window.localStorage.getItem(SPEED_STORAGE_KEY));
    return (AUTO_SCROLL_SPEEDS as readonly number[]).includes(raw)
      ? (raw as AutoScrollSpeed)
      : 1;
  } catch {
    return 1;
  }
}

type AutoScrollSession = {
  running: boolean;
  frame: number | null;
  last: number;
  /** Vị trí cuộn lúc bắt đầu — dùng để biết điểm dừng có nằm phía trước. */
  origin: number;
};

export function useAutoScroll() {
  const api = useScrollApi();
  const [active, setActive] = useState(false);
  const [speed, setSpeed] = useState<AutoScrollSpeed>(1);
  const inZone = useAutoScrollZone();

  const session = useRef<AutoScrollSession>({
    running: false,
    frame: null,
    last: 0,
    origin: 0,
  });

  /* ── Khôi phục tốc độ đã chọn (chỉ sau khi mount) ─────────────────── */
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- đọc localStorage một lần sau mount; không thể khởi tạo state bằng window khi SSR */
    setSpeed(readStoredSpeed());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  /* ── Ghi lựa chọn tốc độ ───────────────────────────────────────────── */
  useEffect(() => {
    try {
      window.localStorage.setItem(SPEED_STORAGE_KEY, String(speed));
    } catch {
      /* Chế độ riêng tư chặn localStorage — bỏ qua, nút vẫn chạy. */
    }
  }, [speed]);

  /**
   * Vòng rAF nằm TRỌN trong một effect, phụ thuộc `active` và `speed`.
   *
   *  Cách ngây thơ — một hàm `tick` ngoài effect rồi tự `requestAnimationFrame`
   *  lại chính nó — vừa không qua được `react-hooks/immutability` (đọc một
   *  biến trước khi nó được khai báo), vừa giữ đóng một `api` cũ nếu provider
   *  đổi. Đưa vòng lặp vào effect thì mọi thứ nó cần đều là biến cục bộ, và
   *  việc huỷ là một dòng `cancelAnimationFrame`.
   *
   *  Effect tự tắt mình bằng `setActive(false)` khi chạm đáy trang hoặc khi
   *  tới đầu Part 03: đổi state → effect chạy cleanup → vòng lặp dừng, và
   *  không khung hình nào còn sống sót để cuộn tiếp.
   */
  useEffect(() => {
    if (!active) return;

    const s = session.current;
    s.last = performance.now();

    /** Đi một quãng `distance` từ vị trí hiện tại, qua Lenis nếu có. */
    const move = (top: number) => {
      if (api) {
        // Lenis dẫn đường: nó tự kẹp vào `limit` và phát `scroll` cho
        // ScrollTrigger, nên clip scrub vẫn khớp từng khung hình.
        api.scrollTo(top, { duration: 0.18 });
      } else {
        // Nhánh dự phòng: máy không dùng cuộn mượt. `instant` để trình duyệt
        // không tự bật smooth của riêng nó.
        window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
      }
    };

    const tick = (now: number) => {
      if (!s.running) return;

      const dt = Math.min(100, Math.max(1, now - s.last));
      s.last = now;

      if (atDocumentEnd()) {
        s.running = false;
        setActive(false);
        return;
      }

      // Bước tỉ lệ với thời gian thật, nhưng luôn bị kẹp vào trần/khung hình:
      // máy rớt khung thì cuộn chậm lại, không nhảy.
      const step = Math.min(
        autoScrollStep(dt, speed),
        autoScrollStep(FRAME_MS, speed) * (dt / FRAME_MS),
      );
      const top = window.scrollY + step;

      // Điểm dừng chỉ có hiệu lực khi nó nằm TRƯỚC vị trí lúc bắt đầu; nếu
      // người xem đã đi qua cảnh 03 rồi thì bấm phát vẫn cuộn tiếp như cũ.
      const limit = stopAtOffset();
      const shouldStop =
        limit !== null && limit > s.origin + 2 && top >= limit;

      move(shouldStop ? limit : top);

      if (shouldStop) {
        s.running = false;
        setActive(false);
        return;
      }

      s.frame = requestAnimationFrame(tick);
    };

    s.running = true;
    s.frame = requestAnimationFrame(tick);

    return () => {
      s.running = false;
      if (s.frame !== null) cancelAnimationFrame(s.frame);
      s.frame = null;
    };
  }, [active, api, speed]);

  const start = useCallback(() => {
    /*
      Chỉ chạy trong Part 01–02.

      Ngoài vùng đó (từ đầu cảnh 03 trở đi) nút phát không có nghĩa gì: phần
      sau là nơi đọc và tương tác, không phải nơi để máy cuộn hộ. Chặn ngay ở
      đây chứ không chỉ ẩn nút, để không có đường nào khác bật được nó.
    */
    const fence = stopAtOffset();
    if (fence !== null && window.scrollY >= fence - 2) return;

    const s = session.current;

    if (atDocumentEnd()) {
      // Đang ở cuối trang: đưa về đầu để còn gì mà chạy — hành vi quen thuộc
      // của mọi nút "phát" khi đã hết phim.
      if (api) api.scrollTo(0, { duration: 0.6 });
      else window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }

    // Ghi lại điểm xuất phát SAU khi có thể đã nhảy về đầu trang.
    s.origin = atDocumentEnd() ? 0 : window.scrollY;

    s.running = true;
    setActive(true);
  }, [api]);

  const stop = useCallback(() => {
    const s = session.current;
    s.running = false;
    setActive(false);
  }, []);

  const toggle = useCallback(() => {
    if (session.current.running) stop();
    else start();
  }, [start, stop]);

  /**
   * Nhường quyền. Gắn ở pha capture trên `window` để bắt được cả khi Lenis đã
   * chặn sự kiện ở `document` — capture chạy trước nên vẫn thấy.
   *
   * `keydown` chỉ tính các phím cuộn/điều hướng; Tab hay Escape không làm
   * dừng — người dùng đang điều hướng bàn phím chứ không cầm lái cuộn.
   */
  useEffect(() => {
    if (!active) return;

    /*
      Bỏ qua thao tác phát sinh BÊN TRONG capsule điều khiển. Nếu không, cú
      `mousedown` lên chính nút pause sẽ dừng auto-scroll trước khi `click`
      kịp chạy, rồi `toggle` thấy "đang dừng" và phát lại — nút pause thành
      nút phát. Cùng lý do với phím Space/Enter khi chọn tốc độ.
    */
    const fromControl = (event: Event) => {
      const target = event.target;
      return target instanceof Element && target.closest("[data-autoscroll-ui]") !== null;
    };

    const surrender = (event: Event) => {
      if (!fromControl(event)) stop();
    };

    const onKey = (event: KeyboardEvent) => {
      if (fromControl(event)) return;

      const keys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
        "Spacebar",
      ];
      if (keys.includes(event.key)) surrender(event);
    };

    const options = { capture: true, passive: true } as const;
    window.addEventListener("wheel", surrender, options);
    window.addEventListener("touchstart", surrender, options);
    window.addEventListener("mousedown", surrender, options);
    window.addEventListener("keydown", onKey, options);

    return () => {
      window.removeEventListener("wheel", surrender, options);
      window.removeEventListener("touchstart", surrender, options);
      window.removeEventListener("mousedown", surrender, options);
      window.removeEventListener("keydown", onKey, options);
    };
  }, [active, stop]);

  return { active, toggle, stop, speed, setSpeed, inZone };
}
