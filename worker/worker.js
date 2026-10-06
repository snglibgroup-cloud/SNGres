// Cloudflare Worker: nhận ảnh từ trang admin, ghi vào R2.
// Chỉ tài khoản admin (có trong bảng public.admins của Supabase) mới được tải lên / xóa.
const OK_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_BYTES = 3 * 1024 * 1024;

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Max-Age': '86400',
    };
    const out = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    // 1) Kiểm tra đăng nhập + quyền admin bằng chính token của người dùng (RLS tự lọc)
    const auth = req.headers.get('Authorization') || '';
    if (!auth.startsWith('Bearer ')) return out({ error: 'Chưa đăng nhập' }, 401);
    const chk = await fetch(env.SUPABASE_URL + '/rest/v1/admins?select=user_id', {
      headers: { apikey: env.SUPABASE_KEY, Authorization: auth },
    });
    const rows = chk.ok ? await chk.json() : null;
    if (!Array.isArray(rows) || rows.length === 0) return out({ error: 'Không có quyền admin' }, 403);

    const url = new URL(req.url);

    // 2) Tải ảnh lên:  POST /  (body = file ảnh, header Content-Type = loại ảnh)
    if (req.method === 'POST') {
      const type = (req.headers.get('Content-Type') || '').split(';')[0].trim();
      const ext = OK_TYPES[type];
      if (!ext) return out({ error: 'Chỉ nhận JPG, PNG, WebP' }, 415);
      const buf = await req.arrayBuffer();
      if (buf.byteLength === 0 || buf.byteLength > MAX_BYTES) return out({ error: 'Ảnh tối đa 3MB' }, 413);
      const key = crypto.randomUUID() + '.' + ext;
      await env.BUCKET.put(key, buf, {
        httpMetadata: { contentType: type, cacheControl: 'public, max-age=31536000, immutable' },
      });
      return out({ key, url: env.PUBLIC_URL.replace(/\/$/, '') + '/' + key });
    }

    // 3) Xóa ảnh:  DELETE /?key=xxxxxxxx.webp
    if (req.method === 'DELETE') {
      const key = url.searchParams.get('key') || '';
      if (!/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key)) return out({ error: 'Tên ảnh không hợp lệ' }, 400);
      await env.BUCKET.delete(key);
      return out({ ok: true });
    }

    return out({ error: 'Không hỗ trợ' }, 405);
  },
};
