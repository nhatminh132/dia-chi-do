import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * 404. Giữ ngôn ngữ "bảo tàng": trang không tìm thấy được trình bày như một
 * khoang trống trong bảo tồn chứ không phải lỗi kỹ thuật.
 */
export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 py-24">
      <Container width="narrow" className="text-center">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-gold">
          Mã 404
        </p>

        <h1 className="mt-6 text-balance font-display text-[clamp(1.9rem,5vw,3.2rem)] uppercase leading-[1.1] text-paper">
          Không tìm thấy trang này
        </h1>

        <p className="mx-auto mt-5 max-w-md text-pretty text-sm leading-relaxed text-paper-mute">
          Địa chỉ bạn truy cập không tồn tại hoặc đã được chuyển sang vị trí khác.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/">Về trang chủ</Button>
          <Button href="/ban-do" variant="outline">
            Khám phá địa chỉ đỏ
          </Button>
        </div>
      </Container>
    </div>
  );
}