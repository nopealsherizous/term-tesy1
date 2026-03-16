# 🏫 THPT Cẩm Bình — Cổng Thông Tin Học Sinh

Cổng thông tin học sinh trường THPT Cẩm Bình, năm học 2025–2026.

---

## 📁 Cấu trúc dự án

```
thpt-cambinh/
├── public/
│   └── index.html              ← Trang web chính (SPA)
├── src/
│   ├── css/
│   │   ├── tokens.css          ← Màu sắc, khoảng cách
│   │   ├── base.css            ← Reset, typography
│   │   ├── animations.css      ← Animations
│   │   └── components/
│   │       ├── header.css
│   │       ├── modal.css
│   │       ├── table.css
│   │       └── cards.css
│   └── js/
│       ├── app.js              ← Entry point chính
│       ├── core/
│       │   ├── router.js       ← Điều hướng URL
│       │   └── store.js        ← State toàn cục
│       ├── utils/
│       │   ├── search.js       ← Tìm kiếm + dấu thanh
│       │   └── date.js         ← Ngày tháng
│       ├── modules/
│       │   ├── zodiac.js       ← Cung hoàng đạo
│       │   ├── menh.js         ← Ngũ hành / Mệnh
│       │   ├── numerology.js   ← Thần số học
│       │   └── compatibility.js← Tương hợp
│       └── pages/
│           ├── home.js         ← Trang chủ
│           ├── students.js     ← Danh sách học sinh
│           ├── student-detail.js← Chi tiết + modal
│           ├── birthdays.js    ← Sinh nhật
│           ├── news.js         ← Tin tức
│           └── stats.js        ← Thống kê
├── data/
│   ├── public/
│   │   ├── students-public.json← Dữ liệu học sinh (không có CMND/SĐT)
│   │   ├── classes.json        ← Danh sách lớp
│   │   └── news.json           ← Tin tức
│   └── private/                ← ⚠️ KHÔNG commit lên git public!
│       └── students-private.json← CMND, SĐT (bảo mật)
├── api/
│   ├── submit-article.js       ← API gửi bài viết
│   └── get-private.js          ← API lấy dữ liệu nhạy cảm (có bảo vệ)
├── .gitignore                  ← Bảo vệ data/private/
├── vercel.json                 ← Cấu hình Vercel
└── package.json
```

---

## 🚀 Hướng dẫn Deploy lên Vercel

### Bước 1: Cài đặt Vercel CLI

Mở Terminal (hoặc Command Prompt trên Windows), chạy:

```bash
npm install -g vercel
```

### Bước 2: Đăng nhập Vercel

```bash
vercel login
```

Làm theo hướng dẫn (đăng nhập qua GitHub hoặc email).

### Bước 3: Upload dự án

1. Giải nén file zip vào thư mục `thpt-cambinh`
2. Mở Terminal, `cd` vào thư mục đó:

```bash
cd thpt-cambinh
vercel
```

3. Trả lời các câu hỏi:
   - **Set up and deploy?** → `Y`
   - **Which scope?** → Chọn tài khoản của bạn
   - **Link to existing project?** → `N`
   - **Project name?** → `thpt-cambinh` (hoặc tên khác)
   - **Directory?** → `.` (dấu chấm = thư mục hiện tại)
   - **Override build settings?** → `N`

4. Vercel sẽ deploy và cho bạn URL như: `thpt-cambinh.vercel.app`

### Bước 4: Deploy production

```bash
vercel --prod
```

---

## 🔧 Cách chạy local (thử nghiệm trên máy)

```bash
# Cài serve
npm install -g serve

# Chạy server
serve . -p 3000
```

Mở trình duyệt: `http://localhost:3000/public`

---

## 📊 Cập nhật dữ liệu học sinh

### Thêm/sửa học sinh trong `data/public/students-public.json`:

```json
{
  "stt": 1,
  "hoTen": "NGUYỄN VĂN AN",
  "ngaySinh": "12/05/2010",
  "gioiTinh": "Nam",
  "lop": "10A1",
  "xaPhuongThuongTru": "Xã Cẩm Bình",
  "thonXom": "Thôn 1",
  "queQuan": "",
  "tenBo": "Nguyễn Văn B",
  "ngheNghiepBo": "Nông nghiệp",
  "tenMe": "Trần Thị C",
  "ngheNghiepMe": "Giáo viên"
}
```

**Lưu ý:** Không đặt CMND hoặc SĐT trong file này! Đặt vào `data/private/students-private.json`.

### Sau khi cập nhật, deploy lại:

```bash
vercel --prod
```

---

## 📰 Thêm tin tức

Sửa file `data/public/news.json`, thêm vào mảng `news`:

```json
{
  "id": "news-004",
  "title": "Tiêu đề bài viết",
  "summary": "Tóm tắt ngắn...",
  "content": "Nội dung chi tiết...",
  "author": "Tên tác giả",
  "category": "thong-bao",
  "status": "published",
  "createdAt": "2025-12-01T07:00:00Z",
  "tags": ["tag1", "tag2"]
}
```

**Danh mục (`category`):** `thong-bao` | `lich-thi` | `thanh-tich` | `hoat-dong` | `khac`

---

## 🔐 Bảo vệ dữ liệu nhạy cảm

### Dữ liệu private (CMND, SĐT) nằm trong:
```
data/private/students-private.json
```

File `.gitignore` đã loại thư mục này khỏi git. **Đừng bao giờ commit thư mục `data/private/` lên GitHub public.**

### Để admin xem dữ liệu private:

1. Thiết lập Environment Variable trong Vercel Dashboard:
   - Vào project → Settings → Environment Variables
   - Thêm: `ADMIN_KEY` = một chuỗi bí mật (vd: `thpt-cambinh-admin-2025`)

2. Gọi API:
   ```
   GET https://your-site.vercel.app/api/get-private?key=YOUR_ADMIN_KEY&stt=1
   ```

---

## 🎨 Thay đổi màu sắc

Sửa file `src/css/tokens.css`:

```css
:root {
  --red: #c0392b;   /* Màu chủ đạo (đỏ) */
  --gold: #e8a020;  /* Màu vàng */
  --blue: #1a4a8a;  /* Màu xanh */
  /* ... */
}
```

---

## ✨ Tính năng

| Tính năng | Mô tả |
|-----------|-------|
| 🏠 Trang chủ | Dashboard tổng quan, sinh nhật hôm nay, tin mới |
| 👥 Danh sách học sinh | Table view, Card view, Class view |
| 🔍 Tìm kiếm | Tìm theo tên (bỏ dấu), số CCCD (private), địa chỉ |
| 🎂 Sinh nhật | Lịch sinh nhật theo tháng |
| 📊 Thống kê | Biểu đồ theo lớp, khối, giới tính, nghề nghiệp |
| 🔮 Tử vi | Cung hoàng đạo, ngũ hành, mệnh, tuổi |
| 🔢 Số học | Numerology (số đường đời, ngày sinh...) |
| 💘 Linh hồn | Tìm người tương hợp |
| 📰 Tin tức | Đọc và gửi bài viết |
| 🌙 Dark mode | Chế độ tối/sáng |
| 📱 Mobile | Responsive, cảm ứng tốt |

---

## 🛠️ Cấu trúc URL

```
/              → Trang chủ
/students      → Danh sách học sinh
/birthdays     → Lịch sinh nhật
/stats         → Thống kê
/news          → Tin tức
/news/[id]     → Bài viết chi tiết
/submit        → Gửi bài viết
```

---

## 📞 Hỗ trợ

Nếu gặp vấn đề khi deploy, kiểm tra:
1. File `data/public/students-public.json` có đúng định dạng JSON không
2. Vercel CLI đã được cài đặt chưa (`vercel --version`)
3. Đã đăng nhập Vercel chưa (`vercel whoami`)
