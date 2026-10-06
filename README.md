# SNGres (GitHub Pages + Supabase)

Web tìm phòng trọ chạy hoàn toàn bằng file tĩnh trên **GitHub Pages**; dữ liệu, đăng nhập admin và ảnh nằm trên **Supabase**. Không cần máy chủ PHP.

```
index.html        Trang chủ cho khách (đọc phòng từ Supabase, gửi đặt lịch / SĐT)
config.js         Địa chỉ + anon key của Supabase (công khai được)
css/              base.css (khung, header, footer) · home.css (trang chủ, bộ lọc, thẻ phòng) · detail.css (trang chi tiết)
js/               core (kết nối) · state (hằng số, bộ lọc) · listing (danh sách) · detail (chi tiết + đặt lịch)
                  events (sự kiện) · settings (logo/văn bản tùy biến) · main (khởi chạy)
admin/
  index.html      Trang quản trị: đăng nhập, phòng, khách, giao diện & văn bản
  css/admin.css
  js/             core · auth (đăng nhập, tải dữ liệu) · rooms · site (văn bản) · customers
supabase/
  schema.sql      Bảng, phân quyền (RLS), kho ảnh
  seed.sql        29 phòng mẫu (tùy chọn)
  site_settings.sql  Bảng văn bản/logo tùy biến + cột SĐT Zalo (đã nằm trong schema.sql; DB cũ chỉ cần chạy file này)
.github/workflows/pages.yml   Tự deploy lên GitHub Pages khi push
```

## 1. Tạo dự án Supabase
1. Vào supabase.com → **New project** (chọn vùng Singapore cho gần Việt Nam).
2. Mở **SQL Editor → New query**, dán toàn bộ `supabase/schema.sql` → **Run**.
3. (Tùy chọn) Chạy tiếp `supabase/seed.sql` để có 29 phòng mẫu.
4. **Authentication → Users → Add user → Create new user**: nhập email + mật khẩu, tick *Auto Confirm User*.
5. Quay lại SQL Editor, chạy (sửa email cho đúng):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'email-cua-ban@gmail.com';
   ```
6. **Authentication → Sign In / Providers → Email**: tắt *Allow new users to sign up* (admin chỉ do bạn tạo).
7. **Project Settings → API**: copy *Project URL* và *anon public key*.

## 2. Điền cấu hình
Mở `config.js`, thay `SUPABASE_URL` và `SUPABASE_ANON_KEY`. Chỉ dùng **anon key**, tuyệt đối không dùng `service_role`.

## 3. Đưa lên GitHub
```bash
git init
git add .
git commit -m "NhàTrọ+ lần đầu"
git branch -M main
git remote add origin https://github.com/<tai-khoan>/<ten-repo>.git
git push -u origin main
```
Trên GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Sau khi workflow chạy xong, web nằm ở `https://<tai-khoan>.github.io/<ten-repo>/` và trang quản trị ở `.../admin/`.

## Tùy biến logo & văn bản
Đăng nhập `admin/index.html` → tab **Giao diện & văn bản**: sửa logo, thanh thông báo, tên 4 mục menu, giới thiệu/tổng đài/bản quyền ở chân trang. Dữ liệu lưu trong bảng `site_settings`.

## Bảo mật
- Bảo vệ dữ liệu là nhờ **Row Level Security** trong `schema.sql`, không phải nhờ giấu link admin: khách chỉ đọc được phòng đang hiển thị và chỉ *gửi* được đặt lịch / SĐT; chỉ tài khoản có trong bảng `admins` mới sửa/xóa được dữ liệu, đọc danh sách khách và tải ảnh lên.
- Anon key công khai là bình thường. Khóa `service_role` thì không bao giờ được đưa vào repo.
- Ảnh: tối đa 3MB, chỉ JPG/PNG/WebP (ràng buộc ngay trên bucket).
- Form đặt lịch chưa có giới hạn số lần gửi theo IP (Supabase không cung cấp sẵn ở mức này). Nếu bị spam, có thể thêm Cloudflare Turnstile hoặc Edge Function có rate limit.
- Nên bật *Point-in-time recovery* hoặc tự sao lưu database định kỳ.

## Lưu ý
Một số mục ở trang chi tiết phòng (tiện nghi trong phòng, bảng chi phí điện/nước, số phòng cụ thể 101, 102...) vẫn tự sinh từ dữ liệu phòng, chưa có ô nhập trong admin. Diện tích, mô tả, ảnh, giá, tiện ích chính và số phòng trống thì lấy đúng theo admin nhập.
