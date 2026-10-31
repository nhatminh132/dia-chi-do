"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHydrated } from "@/hooks/useMediaQuery";
import { useMotionEnabled } from "@/lib/gsap/motionPreference";
import { SCROLL_BUDGET, maxDistanceFor } from "@/lib/scroll/scrollBudget";
import { ScrollApiProvider, type ScrollApi } from "@/lib/scroll/scrollContext";
import { gsap, ScrollTrigger } from "./gsap";
import { MotionReadyProvider } from "./motionReady";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SCROLL PROVIDER — Lenis + GSAP ScrollTrigger
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Trái tim của toàn bộ hệ chuyển động cuộn.
 *
 *  ── Vì sao KHÔNG dùng <ReactLenis> ──────────────────────────────────────
 *
 *  ReactLenis giữ instance trong React state và phát ra qua ref
 *  (`useImperativeHandle(ref, ..., [lenis])`). Ref chỉ được cập nhật ở
 *  lần render KẾT TIẾP, nên trong effect của provider, `ref.current.lenis`
 *  vẫn là `undefined` — ta sẽ không bao giờ gắn được driver `raf()`.
 *
 *  Hậu quả rất nghiêm trọng: Lenis chặn sự kiện wheel rồi chỉ đẩy vị trí
 *  cuộn trong `raf()`. Không có driver ⇒ **con lăn chuột chết hoàn toàn**,
 *  trang chỉ còn cuộn được bằng bàn phím.
 *
 *  Nên ở đây ta tự khởi tạo Lenis trong effect: nhận instance NGAY LẬP
 *  TỨC trong cùng effect, và vòng đời create/destroy hoàn toàn rõ ràng —
 *  đúng nghĩa cả với React StrictMode remount hai lần.
 *
 *  ── Chiến lược: MỘT vòng lặp duy nhất ──────────────────────────────────
 *
 *    lenis.on("scroll", ScrollTrigger.update)   Lenis đẩy vị trí → GSAP cập nhật
 *    gsap.ticker.add((t) => lenis.raf(t*1000))  GSAP điều khiển nhịp khung hình
 *    gsap.ticker.lagSmoothing(0)                 tắt bù lag để scrub khớp nhịp
 *
 *    `autoRaf: false` là BẮT BUỘC. Bật `autoRaf: true` đồng thời với
 *    `gsap.ticker.add(...)` tạo HAI requestAnimationFrame cùng đẩy Lenis →
 *    nhấp nháy và scrub rớt nhịp.
 *
 *  ── HẠN MỨC TỐC ĐỘ CUỘN (`virtualScroll`) ───────────────────────────────
 *
 *    Lenis áp mỗi sự kiện bánh xe bằng `scrollTo(targetScroll + delta)` —
 *    delta CỘNG DỒN vào đích. Một cú lăn 5 nấc đẩy đích đi 5 lần ngay trong
 *    một khung hình. Với nền là clip `scrollScrub`, đích nhảy một cú lớn là
 *    clip nhảy theo: mắt đọc ra là "tua nhanh".
 *
 *    Nên delta được gom lại trong ĐÚNG một khung hình rồi kẹp xuống trần
 *    `SCROLL_BUDGET.maxSpeed` px/giây trước khi trả về cho Lenis. Kẹp ở đây
 *    chứ không kẹp ở phía nghe `scroll`: Lenis mới là nơi sinh ra độ dài cú
 *    nhảy, sửa ở ngõ vào thì cả quán tính lẫn vị trí đích đều đúng.
 *
 *    PHẠM VI: chỉ Part 01–02 của trang chủ (tính tới đầu `#chapter-03`).
 *    Từ Part 03 trở đi bánh xe chạy tự do — xem ghi chú tại `capApplies`.
 *
 *    `smoothWheel: false` là hệ quả bắt buộc — xem ghi chú tại chỗ khai báo.
 *
 *  ── Reduced motion: KHÔNG KHỞI TẠO LENIS ────────────────────────────────
 *
 *    Khi người dùng bật giảm chuyển động, ta không chạm vào Lenis — trình
 *    duyệt cuộn native, tự nhiên, không bị chiếm quyền, đúng yêu cầu brief.
 */

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  const hydrated = useHydrated();
  const motionEnabled = useMotionEnabled();
  const smoothEnabled = hydrated && motionEnabled;

  // Bật khi bố cục đã ổn định — xem giải thích dài trong `motionReady.tsx`.
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    if (!smoothEnabled) return;

    // ── HẠN MỨC: kẹp delta bánh xe theo trần tốc độ ──────────────────────
    //
    // Ngữ nghĩa: mỗi sự kiện bánh xe chỉ được đi quãng tối đa mà trần cho
    // phép trong khoảng thời gian TỪ SỰ KIỆN TRƯỚC tới giờ. Tức là tốc độ
    // trung bình của một cơn lăn không bao giờ vượt trần, dù tay quay nhanh
    // hay trackpad phát ra hàng chục sự kiện trong một khung hình.
    //
    // Phần dư bị BỎ (chiến lược "absorb"): người xem muốn đi một quãng, không
    // muốn đi cùng quãng đó nhưng bò tiếp vài giây sau khi đã ngừng tay.
    //
    // Bản cũ cộng dồn `carried` rồi lại trừ nó khỏi `deltaY`, nên khi phần
    // được duyệt nhỏ hơn phần mang theo thì `deltaY` ra SỐ ÂM — trang chạy
    // ngược chiều con lăn. Bỏ hẳn cơ chế mang theo.
    const wheelGate = { at: 0 };

    /*
      ── PHẠM VI ÁP TRẦN: CHỈ PART 01–02 ──────────────────────────────────

      Phần mở đầu của trang chủ (cờ đỏ → thành phố) có nền là clip được
      `scrollScrub` theo vị trí cuộn, nên ở đó trần tốc độ là thứ giữ cho clip
      không bị "tua". Từ đầu Part 03 trở đi (kho · kháng chiến · bản đồ, Đông
      Nam Á, ký ức) người xem đọc và tương tác — kẹp tốc độ ở đó chỉ làm trang
      ì, không bảo vệ được gì.

      Mốc là offset document của `#chapter-03`. Trang không có mốc này (các
      phòng khác) thì giữ nguyên hành vi cũ: kẹp trên toàn trang.

      Đọc lại tối đa 4 lần/giây: ảnh phía trên tải xong sẽ đẩy mốc xuống, nhưng
      không cần chính xác tới từng khung hình — sai số vài chục px ở mép Part 03
      không ai nhận ra.
    */
    const capEnd = { offset: null as number | null, at: 0 };

    const readCapEnd = () => {
      const element = document.querySelector<HTMLElement>("#chapter-03");
      capEnd.offset = element
        ? element.getBoundingClientRect().top + window.scrollY
        : null;
      capEnd.at = performance.now();
    };

    /** Còn nằm trong vùng phải kẹp tốc độ không? */
    const capApplies = () => {
      const now = performance.now();
      if (capEnd.at === 0 || now - capEnd.at > 250) readCapEnd();
      // Không có Part 03 ⇒ kẹp trên toàn trang (hành vi cũ).
      if (capEnd.offset === null) return true;
      // Đã tới đầu Part 03 ⇒ thả cho cuộn tự do.
      return window.scrollY < capEnd.offset - 1;
    };

    const lenis = new Lenis({
      // Bắt buộc — driver là gsap.ticker bên dưới, không phải RAF riêng.
      autoRaf: false,

      // `smoothWheel` PHẢI là true thì trần tốc độ mới có tác dụng.
      //
      //   Trong Lenis: `if (!(syncTouch && isTouch || smoothWheel && isWheel))
      //   → isScrolling = "native"; return`. Với `smoothWheel: false`, Lenis
      //   đọc `virtualScroll` xong rồi GIAO bánh xe lại cho trình duyệt cuộn
      //   native — mọi phép kẹp bên trên bị bỏ qua. Đo thật: trần 900 hay 260
      //   đều cho bánh xe ~1.750–2.000 px/s, tức là không kẹp gì cả.
      //
      //   Bật true thì `scrollTo(targetScroll + delta, { lerp })` mới là đường
      //   đi của bánh xe, và delta đã bị kẹp ở `virtualScroll` mới là thứ được
      //   cộng vào đích.
      smoothWheel: true,

      /*
        Quán tính giữa các khung hình. Đây là chỗ "smooth" thật sự nằm sau
        khi bánh xe đi đường thô: delta đã đúng trên một khung hình, còn
        Lenis vẫn trượt dần tới đích với hệ số damp.

        0.07 (chậm hơn mặc định 0.1) là cố ý: mỗi khung hình chỉ đi ~7% quãng
        còn lại, nên ngay cả khi đích bị đẩy đi thì cú trượt cũng trải ra
        nhiều khung hình — clip scrub có thời gian vẽ đủ khung, không rách.
      */
      lerp: 0.07,

      virtualScroll: (data) => {
        // Ctrl + lăn = zoom trình duyệt. Lenis cũng bỏ qua — để nó lo.
        if (data.event.ctrlKey) return true;

        const now = performance.now();
        // Sự kiện đầu tiên sau một quãng nghỉ: KHÔNG thưởng cả quãng nghỉ
        // thành một cú nhảy. Tính như một khung hình 16ms.
        const dt =
          wheelGate.at === 0
            ? 16
            : Math.min(1000, Math.max(1, now - wheelGate.at));
        wheelGate.at = now;

        // Ngoài phạm vi kẹp: trả delta nguyên vẹn, bánh xe chạy như trang
        // thường. Vẫn cập nhật `wheelGate` ở trên để lúc quay lại Part 02
        // không bị tính bù một cú nhảy.
        if (!capApplies()) return true;

        const limit = maxDistanceFor(dt, SCROLL_BUDGET.maxSpeed);
        if (Math.abs(data.deltaY) > limit) {
          data.deltaY = Math.sign(data.deltaY) * limit;
        }

        // Lenis đọc `deltaY` SAU khi hàm này trả về. `true` = không huỷ sự
        // kiện, chỉ sửa lượng cuộn.
        return true;
      },

      // Giữ cuộn chạm tay nguyên bản — đồng bộ cảm ứng hay gây khó chịu
      // trên thiết bị cầm tay và phá cảm giác "cuộn tự nhiên".
      syncTouch: false,
      // Anchor / hash link phải hoạt động.
      anchors: true,
      // Lenis KHÔNG tự tôn trọng cài đặt giảm chuyển động của hệ điều hành.
      //
      // Cổng kiểm soát đã nằm ở `motionEnabled` (xem `motionPreference.tsx`),
      // và quyết định của dự án là luôn cho phép chuyển động. Nếu để Lenis
      // tự quyết, nó sẽ TẮT việc cuộn mượt khi hệ thống bật "giảm chuyển
      // động" — và `lenis.on("scroll", ScrollTrigger.update)` im lặng, khiến
      // ScrollTrigger không được cập nhật: nội dung kẹt ở trạng thái ẩn.
      respectReducedMotion: false,
    });

      lenisRef.current = lenis;

      // 1) Lenis đẩy vị trí cuộn → ScrollTrigger cập nhật phép đo
      lenis.on("scroll", ScrollTrigger.update);

      // 2) Một RAF duy nhất cho cả Lenis và GSAP
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // 3) Đo lại khi kích thước đổi (ảnh tải xong, xoay máy, sidebar mở).
      //    Gom nhiều sự kiện resize liên tiếp thành một lần đo.
      let timer: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          lenis.resize();
          ScrollTrigger.refresh();
        }, 160);
      };
      window.addEventListener("resize", onResize);

      // 4) Dọn dẹp đầy đủ — thứ tự quan trọng: bỏ driver TRƯỚC khi hủy Lenis,
      //    nếu không ticker sẽ gọi `raf()` trên một instance đã chết.
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", onResize);
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisRef.current = null;
      };
    }, [smoothEnabled]);

  // --- Đặt lại vị trí khi điều hướng sang trang khác.
  //
  //     Next.js chỉ cuộn về đầu bằng native scroll, nên nếu Lenis đang nắm
  //     quyền thì hai bên lệch nhau: người xem nhảy về giữa trang mới và
  //     ScrollTrigger đo sai mọi vị trí trigger.
  useEffect(() => {
    const lenis = lenisRef.current;

    if (lenis) {
      // `immediate: true` — chuyển trang phải tức thì, không trượt mượt
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    ScrollTrigger.refresh();
  }, [pathname]);

  // ════════════════════════════════════════════════════════════════════════
  //  BẬT CỜ "BỐ CỤC ĐÃ ỔN ĐỊNH" — điều kiện tiên quyết cho mọi ScrollTrigger
  // ════════════════════════════════════════════════════════════════════════
  //
  //  Số liệu đo thật trên trang chủ (1440×900), chiều cao tài liệu theo thời gian:
  //
  //      t =  242 ms   1463 px     ← cây DOM còn "gập", chỉ ~1 viewport
  //      t =  750 ms   9733 px     ← sự kiện `load`
  //      t = 1346 ms  10353 px     ← ổn định
  //
  //  Ngưỡng nguy hiểm là vùng 1463px: mọi phần tử nằm dưới ~738px đều cho
  //  `start` âm ⇒ ScrollTrigger coi là "đã lọt" ở scrollY = 0 ⇒ `once: true`
  //  tiêu tốt vĩnh viễn. Còn từ 750ms trở đi thì sai số nằm trong vài trăm px
  //  và `refresh()` sửa được.
  //
  //  Vì vậy điều kiện làm cờ là: **tài liệu đã `load` xong** (tín hiệu vòng đời
  //  thật, không phải đoán) **và đã qua hai khung hình** để trình duyệt áp nốt
  //  layout. Không dùng `setTimeout`: số 300ms chỉ đúng với máy này.
  //
  //  `document.fonts.ready` đã được thử và BỊ LOẠI: nó resolve ở 4ms, sớm hơn
  //  cả lúc Next bắt đầu hydrate, nên vô dụng ở đây.
  useEffect(() => {
    let alive = true;

    const settle = () => {
      if (!alive) return;

      ScrollTrigger.refresh();

      requestAnimationFrame(() => {
        if (!alive) return;

        // Đo lại lần hai: sau khung hình đầu, cây DOM thường đã chính thức
        // có chiều cao cuối cùng.
        ScrollTrigger.refresh();
        setLayoutReady(true);
      });
    };

    if (document.readyState === "complete") {
      settle();
    } else {
      // `load` là tín hiệu vòng đời thật: mọi nguồn tài nguyên tĩnh đã xong.
      window.addEventListener("load", settle, { once: true });
    }

    return () => {
      alive = false;
      window.removeEventListener("load", settle);
    };
  }, []);

  // Tự đo lại khi bố cục đổi SAU khi cờ đã bật (ảnh tải xong, đổi kích thước).
  //
  //  Ở đây CỐ Ý chỉ gọi `ScrollTrigger.refresh()` mà KHÔNG hạ cờ `layoutReady`.
  //
  //  Đã thử biến thể "hạ cờ rồi bật lại" và nó gây hại: mỗi lần hạ cờ, effect
  //  của `Reveal` dọn dẹp rồi dựng lại tween. Với `variant="stagger"` (các
  //  thẻ trong dải thời gian được ghim), tween đang chạy bị cắt giữa chừng và
  //  để lại các phần tử con ở opacity 0.42–0.85 — kẹt vĩnh viễn, người xem cuộn
  //  tới thấy thẻ mờ mà không bao giờ sáng hết.
  //
  //  `ScrollTrigger.refresh()` đo lại `start`/`end` của trigger ĐANG TỒN TẠI
  //  mà không đụng vào tween nào. Đó đúng là công cụ dành cho việc này.
  useEffect(() => {
    let alive = true;
    let raf = 0;
    let lastHeight = document.documentElement.scrollHeight;

    const watch = () => {
      if (!alive) return;

      const h = document.documentElement.scrollHeight;
      if (h !== lastHeight) {
        lastHeight = h;
        ScrollTrigger.refresh();
      }

      raf = requestAnimationFrame(watch);
    };

    raf = requestAnimationFrame(watch);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  // ════════════════════════════════════════════════════════════════════════
  //  CẦU NỐI CUỘN cho component ngoài provider (nút auto-scroll, chỉ dẫn…)
  // ════════════════════════════════════════════════════════════════════════
  //
  //  Hàm đọc `lenisRef.current` tại thời điểm GỌI, không phải lúc render —
  //  nhờ vậy một object ổn định dùng được cho cả đời provider. Giá trị `null`
  //  là tín hiệu thật: máy không chạy cuộn mượt, nơi gọi tự dùng native.
  //
  //  `stop()` tồn tại vì Lenis giữ quán tính trong `targetScroll`; muốn dừng
  //  hẳn (người xem chạm vào để giành lái) thì phải xoá target, không chỉ
  //  ngừng gọi thêm lệnh cuộn.
  const scrollApi = useMemo<ScrollApi>(
    () => ({
      scrollTo: (target, options) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, {
            duration: options?.duration,
            lock: options?.lock,
            force: true,
          });
          return;
        }
        window.scrollTo({ top: target, behavior: "instant" as ScrollBehavior });
      },
      stop: () => lenisRef.current?.stop(),
    }),
    [],
  );

  return (
    <ScrollApiProvider value={scrollApi}>
      <MotionReadyProvider value={layoutReady}>{children}</MotionReadyProvider>
    </ScrollApiProvider>
  );
}
