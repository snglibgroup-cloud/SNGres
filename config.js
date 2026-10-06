// Cấu hình Supabase (Project Settings → API Keys).
// Dùng "Publishable key" (sb_publishable_...). TUYỆT ĐỐI không dán Secret key / service_role vào đây.
window.NT_CONFIG = {
  SUPABASE_URL: 'https://hczvarqmsxnvzldsmvrc.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_uBxrsUoOT2tc20_4qVSAWg_8QhsQ2HS',
  // Địa chỉ Cloudflare Worker nhận ảnh (để trống = dùng kho ảnh Supabase)
  R2_UPLOAD_URL: ''
};
