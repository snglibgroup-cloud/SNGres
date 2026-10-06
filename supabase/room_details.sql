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
