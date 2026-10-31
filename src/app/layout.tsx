import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CapsulePlayer } from "@/components/audio/CapsulePlayer";
import { CurtainTransition } from "@/components/gallery/CurtainTransition";
import { GalleryProvider } from "@/components/gallery/GalleryProvider";
import { RoomMap } from "@/components/gallery/RoomMap";
import { FilmGrain } from "@/components/layout/FilmGrain";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AutoScrollControl } from "@/components/nav/AutoScrollControl";
import { ScrollProvider } from "@/lib/gsap/ScrollProvider";
import { MotionPreferenceProvider } from "@/lib/gsap/motionPreference";
import { SITE } from "@/lib/navigation";
import "./globals.css";

/* -------------------------------------------------------------------------
 * Font
 *
 * Font chữ thường (Inter, JetBrains Mono) khai subset "vietnamese" — BẮT BUỘC
 * cho dự án này. Thiếu nó, toàn bộ tiếng Việt có dấu sẽ rơi về font dự phòng
 * và hỏng bố cục.
 *
 * Font hiển thị thì nạp qua <link>, xem ghi chú bên dưới.
 * ---------------------------------------------------------------------- */

/**
 * Font hiển thị (display serif) — NẠP QUA <link> THẲNG TỪ GOOGLE FONTS.
 *
 * KHÔNG dùng `next/font/google` cho font này. Đã đo trực tiếp:
 *
 *   next/font  → file .woff2 nội bộ, @font-face + unicode-range đúng,
 *                file CÓ glyph ọ (U+1ECD), ộ (U+1ED2), ậ (U+1EAD)
 *                → nhưng dấu vẫn TÁCH khỏi chữ: dấu sắc của Á bay lên cao
 *                  lệch trái, dấu nặng dưới Ọ rơi khỏi chữ, dấu mũ của Ộ/Ậ
 *                  nổi lên rất cao.
 *
 *   <link> CDN → cùng font đó, tải trực tiếp từ Google → dấu nằm ĐÚNG.
 *
 * Vì cùng family + cùng nguồn, chỉ khác đường phân phối, nên lỗi nằm ở
 * `next/font` chứ không phải ở font hay ở CSS của trang. Đã loại trừ các
 * giả thuyết khác bằng thí nghiệm trên chính trang: `overflow: hidden`,
 * `line-height: .94`, `text-transform: uppercase`, `text-shadow`,
 * `text-rendering`, `font-synthesis`, font hệ thống — tất cả đều hỏng
 * y như nhau; mã ký tự trong DOM là precomposed đúng (U+00E1, U+1ECD).
 *
 * Inter và JetBrains Mono vẫn dùng next/font: chữ thường render chuẩn.
 */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "vietnamese"],
  weight: ["500"],
  display: "swap",
});

/* -------------------------------------------------------------------------
 * Metadata — spec §0: tiếng Việt là ngôn ngữ chính
 * ---------------------------------------------------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL("https://dia-chi-do.vercel.app"),
  title: {
    default: `${SITE.name} — Khát vọng độc lập cho thành phố`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "lịch sử Sài Gòn",
    "địa chỉ đỏ",
    "di sản lịch sử",
    "cách mạng Việt Nam",
    "bảo tàng số",
    "giáo dục lịch sử",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE.name,
    title: `${SITE.name} — Khát vọng độc lập cho thành phố`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Khát vọng độc lập cho thành phố`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${jetbrains.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Font hiển thị — xem ghi chú dài ngay trên `inter` bên dưới.
          Nạp bằng <link> thay vì next/font vì next/font làm dấu tiếng Việt
          bị tách khỏi chữ cái ở tiêu đề hero (đo và ghi chú lại trong source).
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- rule
            nhắm Pages Router (pages/_document); <head> trong root layout của
            App Router áp dụng cho mọi route. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@400..900&display=swap"
        />
      </head>
      <body
        className="flex min-h-full flex-col bg-ink text-paper antialiased"
        suppressHydrationWarning
      >
        {/*
          MotionPreferenceProvider đặt NGOÀI ScrollProvider: ScrollProvider
          cần đọc cờ "có được phép chuyển động không" để quyết định có khởi
          tạo Lenis hay không. Nếu đảo thứ tự, ScrollProvider sẽ đọc giá
          trị mặc định của context (tức `false`) và Lenis không bao giờ chạy.

          ScrollProvider bọc ngoài cùng để Lenis điều khiển cuộn của cả trang.
          Nội dung Header/Footer đặt BÊN TRONG provider — chúng là con của
          cây điều khiển, nên không đứt khỏi nhịp cuộn.
        */}
        <MotionPreferenceProvider>
          <ScrollProvider>
            {/*
              GalleryProvider đặt trong ScrollProvider vì nó điều khiển hai
              thứ đều cần nhịp cuộn: rèm chuyển phòng (đóng màn hình trong
              lúc route đổi) và sơ đồ phòng (mở giữa lúc người xem đang
              cuộn). Nếu đảo thứ tự, chúng sẽ không đồng bộ với Lenis.
            */}
            <GalleryProvider>
              <a
                href="#noi-dung-chinh"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-gold focus:bg-ink-900 focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-gold"
              >
                Bỏ qua tới nội dung chính
              </a>

              <Header />

              <main id="noi-dung-chinh" className="flex-1">
                {children}
              </main>

              <Footer />

              {/* Trình phát nhạc nền — nằm ngoài `main` để nhạc không bị
                  cắt khi đổi phòng. */}
              <CapsulePlayer />

              {/* Chế độ tự cuộn — nút icon giữa đáy trang, dùng chung cho mọi
                  phòng. Nằm cạnh CapsulePlayer nên vùng đáy có đúng ba điểm
                  chạm: nhạc (trái), tự cuộn (giữa), hỏi đáp (phải). */}
              <AutoScrollControl />

              {/* Sơ đồ phòng + rèm chuyển phòng. */}
              <RoomMap />
              <CurtainTransition />

              <FilmGrain />
            </GalleryProvider>
          </ScrollProvider>
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}
