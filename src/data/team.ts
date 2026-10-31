/**
 * Thông tin nhóm do nhóm cung cấp — một nguồn duy nhất.
 *
 * Dùng ở trang Giới thiệu và ở phần credit cuối phim. Không suy diễn thêm
 * trường nào; trường chưa có thì giữ nguyên trạng thái do nhóm xác nhận.
 */
export const TEAM = {
  name: "Địa Chỉ Đỏ",
  members: [
    "Lê Phước Nhật Minh (Nhóm trưởng)",
    "Huỳnh Nhật Hòa",
    "Phan Nhật Long",
    "Trần Thiện Nhân",
    "Nguyễn Ngọc Huyền My",
    "Đồng Minh Vũ",
    "Phan Khánh Hào",
  ],
  className: "11A1",
  school: "Trường THPT Lê Quý Đôn",
  teacher: "Không có",
} as const;

export const TEAM_MEMBERS = TEAM.members;
