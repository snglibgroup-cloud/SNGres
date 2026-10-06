// ---------- giao diện & văn bản ----------
const sget=k=>SET[k]!==undefined?SET[k]:SET_DEF[k];
function renderSite(){SET_KEYS.forEach(k=>$('s-'+k).value=sget(k));$('lgm').textContent=sget('logo_main');$('lga').textContent=sget('logo_accent')}
$('sreset').onclick=()=>{SET_KEYS.forEach(k=>$('s-'+k).value=SET_DEF[k]);toast('Đã điền giá trị mặc định - bấm Lưu để áp dụng')};
$('sf').onsubmit=async e=>{e.preventDefault();
  const rows=SET_KEYS.map(k=>({key:k,value:$('s-'+k).value.trim(),updated_at:new Date().toISOString()}));
  if(!rows.find(x=>x.key==='logo_main').value)return toast('Tên thương hiệu không được để trống',true);
  $('ssave').disabled=true;
  const {error}=await sb.from('site_settings').upsert(rows,{onConflict:'key'});
  $('ssave').disabled=false;
  if(error)return toast('Lưu thất bại: '+error.message+' (đã chạy site_settings.sql chưa?)',true);
  rows.forEach(x=>SET[x.key]=x.value);renderSite();toast('Đã lưu - website sẽ cập nhật ngay khi tải lại')};
