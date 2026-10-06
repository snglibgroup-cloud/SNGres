-- =====================================================================
-- NhàTrọ+  ·  Cấu trúc database cho Supabase
-- Chạy toàn bộ file này trong Supabase → SQL Editor → New query → Run
-- =====================================================================

-- ---------- Bảng phòng ----------
create table if not exists public.rooms (
  id          bigint generated always as identity primary key,
  name        text    not null check (char_length(name) between 1 and 150),
  type        text    not null check (type in ('Phòng trọ','Căn hộ','Ký túc xá','Mặt bằng')),
  city        text    not null check (char_length(city) between 1 and 80),
  district    text    not null check (char_length(district) between 1 and 80),
  address     text    not null check (char_length(address) between 1 and 255),
  free_rooms  int     not null default 0 check (free_rooms >= 0),
  total_rooms int     not null default 1 check (total_rooms >= 1),
  price_min   numeric(7,2) not null check (price_min > 0),
  price_max   numeric(7,2) not null,
  amenities   text[]  not null default '{}',
  hot         boolean not null default false,
  discount    int     not null default 0 check (discount between 0 and 90),
  area        int     check (area between 1 and 10000),
  description text    check (char_length(description) <= 3000),
  image_path  text,                       -- tên file trong bucket room-images
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (price_max >= price_min),
  check (free_rooms <= total_rooms)
);
create index if not exists rooms_active_idx on public.rooms (is_active, id desc);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists rooms_touch on public.rooms;
create trigger rooms_touch before update on public.rooms
  for each row execute function public.touch_updated_at();

-- ---------- Danh sách admin ----------
-- Chỉ tài khoản có trong bảng này mới được quản trị.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Khách đặt lịch xem phòng ----------
create table if not exists public.bookings (
  id         bigint generated always as identity primary key,
  room_id    bigint references public.rooms(id) on delete set null,
  room_name  text,
  room_no    text check (char_length(room_no) <= 10),
  name       text not null check (char_length(name) between 1 and 100),
  phone      text not null check (phone ~ '^0[0-9]{9}$'),
  visit_at   timestamptz,
  people     int check (people between 0 and 20),
  vehicles   int check (vehicles between 0 and 20),
  pet        text check (pet in ('Có','Không')),
  move_in    text check (char_length(move_in) <= 60),
  note       text check (char_length(note) <= 500),
  status     text not null default 'new' check (status in ('new','contacted','done','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists bookings_created_idx on public.bookings (created_at desc);

-- Tự điền tên phòng từ room_id (không tin dữ liệu khách gửi lên)
create or replace function public.fill_booking_room() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  select name into new.room_name from public.rooms where id = new.room_id;
  return new;
end $$;
drop trigger if exists bookings_fill on public.bookings;
create trigger bookings_fill before insert on public.bookings
  for each row execute function public.fill_booking_room();

-- ---------- Khách để lại số điện thoại ----------
create table if not exists public.leads (
  id         bigint generated always as identity primary key,
  phone      text not null check (phone ~ '^0[0-9]{9}$'),
  status     text not null default 'new' check (status in ('new','contacted','done','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- ---------- Phân quyền (Row Level Security) ----------
alter table public.rooms    enable row level security;
alter table public.admins   enable row level security;
alter table public.bookings enable row level security;
alter table public.leads    enable row level security;

-- rooms: ai cũng xem được phòng đang hiển thị; admin xem/sửa/xóa tất cả
drop policy if exists rooms_select on public.rooms;
create policy rooms_select on public.rooms for select to anon, authenticated
  using (is_active or public.is_admin());
drop policy if exists rooms_insert on public.rooms;
create policy rooms_insert on public.rooms for insert to authenticated
  with check (public.is_admin());
drop policy if exists rooms_update on public.rooms;
create policy rooms_update on public.rooms for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists rooms_delete on public.rooms;
create policy rooms_delete on public.rooms for delete to authenticated
  using (public.is_admin());

-- admins: mỗi người chỉ đọc được dòng của chính mình (để web biết có phải admin không)
drop policy if exists admins_self on public.admins;
create policy admins_self on public.admins for select to authenticated
  using (user_id = auth.uid());

-- bookings: khách (chưa đăng nhập) chỉ được GỬI, không đọc được; admin quản lý
drop policy if exists bookings_insert on public.bookings;
create policy bookings_insert on public.bookings for insert to anon, authenticated
  with check (
    status = 'new' and room_id is not null
    and exists (select 1 from public.rooms r where r.id = room_id and r.is_active)
  );
drop policy if exists bookings_select on public.bookings;
create policy bookings_select on public.bookings for select to authenticated using (public.is_admin());
drop policy if exists bookings_update on public.bookings;
create policy bookings_update on public.bookings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists bookings_delete on public.bookings;
create policy bookings_delete on public.bookings for delete to authenticated using (public.is_admin());

-- leads: tương tự bookings
drop policy if exists leads_insert on public.leads;
create policy leads_insert on public.leads for insert to anon, authenticated
  with check (status = 'new');
drop policy if exists leads_select on public.leads;
create policy leads_select on public.leads for select to authenticated using (public.is_admin());
drop policy if exists leads_update on public.leads;
create policy leads_update on public.leads for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists leads_delete on public.leads;
create policy leads_delete on public.leads for delete to authenticated using (public.is_admin());

-- Quyền truy cập Data API
grant usage on schema public to anon, authenticated;
grant select on public.rooms to anon, authenticated;
grant insert, update, delete on public.rooms to authenticated;
grant select on public.admins to authenticated;
grant insert on public.bookings, public.leads to anon, authenticated;
grant select, update, delete on public.bookings, public.leads to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- ---------- Kho ảnh (Storage) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('room-images', 'room-images', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = 3145728,
      allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "room images insert" on storage.objects;
create policy "room images insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'room-images' and public.is_admin());
drop policy if exists "room images update" on storage.objects;
create policy "room images update" on storage.objects for update to authenticated
  using (bucket_id = 'room-images' and public.is_admin());
drop policy if exists "room images delete" on storage.objects;
create policy "room images delete" on storage.objects for delete to authenticated
  using (bucket_id = 'room-images' and public.is_admin());

-- ---------- Cấp quyền admin cho tài khoản của bạn ----------
-- 1) Authentication → Users → Add user (nhập email + mật khẩu, tick "Auto Confirm User")
-- 2) Sửa email bên dưới rồi chạy riêng câu lệnh này:
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'email-cua-ban@gmail.com';

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

-- =====================================================================
-- Thông tin chi tiết phòng do admin nhập (số phòng, lầu, tiện nghi, chi phí...)
-- Chạy trong Supabase → SQL Editor (an toàn khi chạy lại)
-- =====================================================================
alter table public.rooms
  add column if not exists units          jsonb   not null default '[]'::jsonb
    check (jsonb_typeof(units) = 'array' and jsonb_array_length(units) <= 300),
  add column if not exists room_amenities text[]  not null default '{}',
  add column if not exists costs          jsonb   not null default '{}'::jsonb check (jsonb_typeof(costs) = 'object'),
  add column if not exists details        jsonb   not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  add column if not exists nearby         text    check (char_length(nearby) <= 1000),
  add column if not exists verified       boolean not null default false;
