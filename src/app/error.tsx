"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Bắt lỗi cấp route — Next.js yêu cầu đây phải là Client Component.
 *
 * Copy cố tình trung thực: không giả vờ "không có gì sai". Người xem được
 * nút thử lại ngay, không bị đẩy ra trang chủ mất ngữ cảnh.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 py-24">
      <Container width="narrow" className="text-center">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-flag-bright">
          Lỗi tải trang
        </p>

        <h1 className="mt-6 text-balance font-display text-[clamp(1.9rem,5vw,3.2rem)] uppercase leading-[1.1] text-paper">
          Có gì đó chưa đúng
        </h1>

        <p className="mx-auto mt-5 max-w-md text-pretty text-sm leading-relaxed text-paper-mute">
          Trang này gặp sự cố khi tải dữ liệu. Bạn có thể thử lại, hoặc quay về
          trang chủ để tiếp tục khám phá.
        </p>

        {error.digest ? (
          <p className="mt-4 font-mono text-[0.68rem] tracking-wide text-paper-faint">
            Mã lỗi: {error.digest}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={reset}>Thử lại</Button>
          <Button href="/" variant="outline">
            Về trang chủ
          </Button>
        </div>
      </Container>
    </div>
  );
}