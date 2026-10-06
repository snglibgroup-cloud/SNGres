-- =====================================================================
-- Văn bản & logo tùy biến (admin sửa được trong trang quản trị)
-- Chạy file này trong Supabase → SQL Editor (an toàn khi chạy lại)
-- =====================================================================
create table if not exists public.site_settings (
  key        text primary key check (char_length(key) between 1 and 50),
  value      text not null default '' check (char_length(value) <= 500),
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

drop policy if exists site_settings_select on public.site_settings;
create policy site_settings_select on public.site_settings for select to anon, authenticated using (true);
drop policy if exists site_settings_insert on public.site_settings;
create policy site_settings_insert on public.site_settings for insert to authenticated with check (public.is_admin());
drop policy if exists site_settings_update on public.site_settings;
create policy site_settings_update on public.site_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists site_settings_delete on public.site_settings;
create policy site_settings_delete on public.site_settings for delete to authenticated using (public.is_admin());

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;

insert into public.site_settings (key, value) values
  ('logo_main',      'SNGres'),
  ('logo_accent',    ''),
  ('announce',       'Phòng trống thực tế · Dẫn xem tận nơi · Không mất phí môi giới 🚀'),
  ('nav_search',     'Tìm phòng'),
  ('nav_apartment',  'Căn hộ'),
  ('nav_dorm',       'Ký túc xá'),
  ('nav_space',      'Mặt bằng'),
  ('footer_desc',    'Nền tảng tìm phòng trọ, căn hộ dịch vụ.'),
  ('footer_contact', 'Tổng đài: 1900 0000'),
  ('copyright',      '© 2026 SNGres.')
on conflict (key) do nothing;

-- SĐT Zalo trong form đặt lịch + văn bản khu vực để lại SĐT
alter table public.bookings add column if not exists zalo_phone text check (zalo_phone ~ '^0[0-9]{9}$');
insert into public.site_settings (key, value) values
  ('lead_title', 'Chưa tìm được phòng ưng ý?'),
  ('lead_desc', 'Để lại số điện thoại, nhân viên sẽ gọi tư vấn và dẫn xem phòng miễn phí trong vòng 15 phút.'),
  ('lead_placeholder', 'Nhập số điện thoại'),
  ('lead_btn', 'Nhận tư vấn'),
  ('book_zalo_label', 'SĐT Zalo (nếu khác số điện thoại ở trên)'),
  ('book_zalo_ph', 'Để trống nếu dùng chung số trên')
on conflict (key) do nothing;

-- Liên hệ nhanh: Zalo + SĐT (có nút copy) + lưu ý "liên hệ xem còn phòng không"
insert into public.site_settings (key, value) values
  ('contact_phone', ''),
  ('contact_zalo_text', 'Chat Zalo tư vấn'),
  ('contact_note', 'Lưu ý: Vui lòng liên hệ trước để xác nhận phòng còn trống hay không rồi hãy qua xem nhé, vì phòng có thể vừa được thuê.')
on conflict (key) do nothing;
