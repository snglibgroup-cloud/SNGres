const $=id=>document.getElementById(id);
function toast(m){const t=$('ts');t.textContent=m;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),1800)}
// name,type,district,address,free,total,min,max,amenities,hot,discount
let R=[];
const CFG=window.NT_CONFIG||{};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sbq=(path,opt={})=>fetch(CFG.SUPABASE_URL+'/rest/v1/'+path,{...opt,headers:{apikey:CFG.SUPABASE_ANON_KEY,...(String(CFG.SUPABASE_ANON_KEY).startsWith('eyJ')?{Authorization:'Bearer '+CFG.SUPABASE_ANON_KEY}:{}),'Content-Type':'application/json',...(opt.headers||{})}});
const imgUrl=p=>/^https?:\/\//.test(p||'')?p:p?CFG.SUPABASE_URL+'/storage/v1/object/public/room-images/'+encodeURIComponent(p):null;
// name,type,district,address,free,total,min,max,amenities,hot,discount,city,photo,id,image,area,desc
const toRow=x=>[esc(x.name),x.type,esc(x.district),esc(x.address),+x.free_rooms,+x.total_rooms,+x.price_min,+x.price_max,x.amenities||[],x.hot?1:0,+x.discount||0,x.city,1,x.id,imgUrl(x.image_path||(x.images&&x.images[0])),x.area?+x.area:null,x.description?esc(x.description):null,Array.isArray(x.units)?x.units:[],x.room_amenities||[],x.costs||{},x.details||{},x.nearby||'',!!x.verified,(x.images&&x.images.length?x.images:(x.image_path?[x.image_path]:[])).map(p=>imgUrl(p))];
function loadRooms(){
  if(!CFG.SUPABASE_URL||CFG.SUPABASE_URL.includes('xxxx'))return Promise.reject(new Error('config'));
  return sbq('rooms?select=*&is_active=eq.true&order=id.desc').then(r=>r.ok?r.json():Promise.reject(new Error('http'))).then(rows=>rows.map(toRow))}
