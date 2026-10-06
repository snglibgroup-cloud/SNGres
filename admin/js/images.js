// Ảnh: nén trong trình duyệt rồi gửi lên Cloudflare R2 (qua Worker).
// Nếu config.js chưa có R2_UPLOAD_URL thì dùng kho ảnh Supabase như cũ.
const R2=()=>(CFG.R2_UPLOAD_URL||'').replace(/\/$/,'');
const isUrl=p=>/^https?:\/\//.test(p||'');

async function compressImage(file,maxSide=1600,quality=.82){
  try{
    const bmp=await createImageBitmap(file);
    const k=Math.min(1,maxSide/Math.max(bmp.width,bmp.height));
    const c=document.createElement('canvas');c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);
    c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);
    const blob=await new Promise(r=>c.toBlob(r,'image/webp',quality));
    return blob&&blob.size<file.size?blob:file;
  }catch(_){return file}}

// trả về giá trị lưu vào rooms.image_path (R2: link đầy đủ; Supabase: tên file)
async function uploadImage(file){
  const blob=await compressImage(file);
  if(blob.size>3*1024*1024)throw new Error('Ảnh vẫn lớn hơn 3MB sau khi nén, hãy chọn ảnh nhỏ hơn.');
  if(R2()){
    const {data:{session}}=await sb.auth.getSession();
    const r=await fetch(R2()+'/',{method:'POST',headers:{Authorization:'Bearer '+session.access_token,'Content-Type':blob.type||file.type},body:blob});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error||('HTTP '+r.status));
    return j.url}
  const path=crypto.randomUUID()+'.'+({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'})[blob.type||file.type];
  const {error}=await sb.storage.from(BUCKET).upload(path,blob,{contentType:blob.type||file.type,upsert:false});
  if(error)throw new Error(error.message);
  return path}

async function removeImage(p){
  if(!p)return;
  try{
    if(isUrl(p)){
      if(!R2())return;
      const {data:{session}}=await sb.auth.getSession();
      await fetch(R2()+'/?key='+encodeURIComponent(p.split('/').pop()),{method:'DELETE',headers:{Authorization:'Bearer '+session.access_token}})}
    else await sb.storage.from(BUCKET).remove([p])
  }catch(_){}}
