-- =====================================================================
-- Nhiều ảnh cho mỗi phòng (an toàn khi chạy lại)
-- Chạy trong Supabase -> SQL Editor
-- =====================================================================
alter table public.rooms
  add column if not exists images text[] not null default '{}'
    check (cardinality(images) <= 12);

-- Đưa ảnh đại diện cũ vào danh sách ảnh mới
update public.rooms
   set images = array[image_path]
 where image_path is not null and cardinality(images) = 0;
