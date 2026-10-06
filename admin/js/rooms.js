// ---------- phần nhập chi tiết phòng ----------
const RAMS=['Giường','Nệm','Tủ quần áo','Thang máy','Wifi','Kệ bếp','Nước nóng','Tủ lạnh'];
const COSTS=[['Điện','VD: 3.8k/kWh'],['Nước','VD: 100k/người'],['Dịch vụ','VD: 200k/phòng'],['Giữ xe','VD: 100k/xe'],['Internet','VD: 100k/phòng'],['Giặt','VD: 50k/người'],['Đặt cọc','VD: 1 tháng'],['Xe điện','VD: Nhận xe điện']];
const DETS=[['Toilet','VD: Riêng'],['Máy giặt','VD: Chung'],['Để xe','VD: Chung'],['Giờ giấc','VD: 23h – 5h']];
$('f-ram').innerHTML=RAMS.map(a=>`<label><input type="checkbox" value="${esc(a)}"> ${esc(a)}</label>`).join('');
const kvIn=a=>a.map(([k,ph])=>`<div><label class="l">${esc(k)}</label><input data-k="${esc(k)}" maxlength="60" placeholder="${esc(ph)}"></div>`).join('');
$('f-costs').innerHTML=kvIn(COSTS);$('f-dets').innerHTML=kvIn(DETS);
function addUnit(u={}){const d=document.createElement('div');d.className='urow';
  d.innerHTML=`<input class="u-no" maxlength="10" placeholder="Số phòng *" value="${esc(u.no||'')}"><input class="u-fl" maxlength="20" placeholder="Lầu (tùy chọn)" value="${esc(u.floor||'')}"><input class="u-pr vnd" type="text" inputmode="numeric" placeholder="Giá đ/tháng (tùy chọn)" value="${u.price>0?vnd(u.price):''}"><button type="button" class="btn r s u-x">✕</button>`;
  $('f-units').appendChild(d)}
$('f-uadd').onclick=()=>addUnit();
$('f-units').onclick=e=>{const x=e.target.closest('.u-x');if(x)x.parentElement.remove()};
const readKV=id=>Object.fromEntries([...document.querySelectorAll('#'+id+' input')].map(i=>[i.dataset.k,i.value.trim()]).filter(x=>x[1]));
const fillKV=(id,o)=>document.querySelectorAll('#'+id+' input').forEach(i=>i.value=(o&&o[i.dataset.k])||'');

// ---------- tab ----------
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x===b));
  ['rooms','bookings','leads','site'].forEach(t=>$('v-'+t).hidden=t!==b.dataset.tab)});

// ---------- danh sách phòng ----------
function renderRooms(){
  const q=S.q.toLowerCase();
  const L=ROOMS.filter(r=>(!S.type||r.type===S.type)&&(!q||(r.name+' '+r.address+' '+r.district).toLowerCase().includes(q)));
  const pages=Math.max(1,Math.ceil(L.length/PER));S.page=Math.min(S.page,pages);
  $('rcount').textContent='· '+L.length+' phòng';
  const rows=L.slice((S.page-1)*PER,S.page*PER);
  $('rt').innerHTML=rows.length?`<table><tr><th></th><th>Phòng</th><th>Loại</th><th>Khu vực</th><th>Trống</th><th>Giá (triệu)</th><th>Trạng thái</th><th></th></tr>`+rows.map(r=>{
    const d=r.discount?Math.round(r.price_min*(100-r.discount)*10)/1000:r.price_min;
    return `<tr data-id="${r.id}"><td><span class="th" style="${r.image_path?`background-image:url('${esc(imgUrl(r.image_path))}')`:''}"></span></td>
<td class="nm"><b>${esc(r.name)}</b><small>${esc(r.address)}</small></td><td><span class="tag">${esc(r.type)}</span></td>
<td>${esc(r.district)}<br><small class="mut">${esc(r.city)}</small></td><td>${r.free_rooms}/${r.total_rooms}</td>
<td class="pr">${r.discount?`<s style="color:#999;font-weight:400">${vnd(r.price_min)}</s> `:''}${vnd(d)}đ${+r.price_max!==+r.price_min?' – '+vnd(r.price_max)+'đ':''}</td>
<td>${r.is_active?'<span class="tag ok">Đang hiển thị</span>':'<span class="tag off">Đang ẩn</span>'} ${r.hot?'<span class="tag hot">Hot</span>':''} ${r.discount?`<span class="tag blue">-${r.discount}%</span>`:''}</td>
<td><div class="acts"><button class="btn g s" data-a="edit">Sửa</button><button class="btn g s" data-a="toggle">${r.is_active?'Ẩn':'Hiện'}</button><button class="btn r s" data-a="del">Xóa</button></div></td></tr>`}).join('')+'</table>'
    :'<div class="empty">Chưa có phòng nào. Bấm "+ Thêm phòng" để bắt đầu.</div>';
  $('rp').innerHTML=pages>1?Array.from({length:pages},(_,i)=>`<button data-p="${i+1}" class="${i+1===S.page?'on':''}">${i+1}</button>`).join(''):''}
$('q').oninput=e=>{S.q=e.target.value.trim();S.page=1;renderRooms()};
$('ft').onchange=e=>{S.type=e.target.value;S.page=1;renderRooms()};
$('reload').onclick=()=>loadAll().then(()=>toast('Đã làm mới'));
$('rp').onclick=e=>{const b=e.target.closest('[data-p]');if(b){S.page=+b.dataset.p;renderRooms()}};
$('rt').onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;
  const r=ROOMS.find(x=>x.id==b.closest('tr').dataset.id);if(!r)return;
  if(b.dataset.a==='edit')return openForm(r);
  if(b.dataset.a==='toggle'){const {error}=await sb.from('rooms').update({is_active:!r.is_active}).eq('id',r.id);
    if(error)return toast('Lỗi: '+error.message,true);toast('Đã cập nhật hiển thị');return loadAll()}
  if(b.dataset.a==='del'){if(!confirm(`Xóa phòng "${r.name}"? Không thể hoàn tác.`))return;
    const {error}=await sb.from('rooms').delete().eq('id',r.id);
    if(error)return toast('Lỗi: '+error.message,true);
    for(const p of roomPaths(r))await removeImage(p);
    toast('Đã xóa phòng');loadAll()}};

// ---------- form thêm / sửa ----------
$('add').onclick=()=>openForm(null);
$('fcancel').onclick=()=>{$('ov').hidden=true};
// ----- nhiều ảnh: imgs = [{path,url} (đã có) | {file,url} (mới chọn)], ảnh đầu là ảnh bìa -----
const MAXIMG=12;let imgs=[];
const roomPaths=r=>r?(r.images&&r.images.length?r.images:(r.image_path?[r.image_path]:[])):[];
function drawGal(){
  $('f-gal').innerHTML=imgs.map((m,k)=>`<div class="gi${k?'':' cv'}" data-k="${k}" title="${k?'Bấm để đặt làm ảnh bìa':'Ảnh bìa'}" style="background-image:url('${esc(m.url)}')">${k?'':'<span class="gcv">Ảnh bìa</span>'}<button type="button" class="gx" data-x="${k}" aria-label="Xóa ảnh">×</button></div>`).join('');
  $('f-cnt').textContent=imgs.length?`(${imgs.length}/${MAXIMG})`:''}
$('f-gal').onclick=e=>{
  const x=e.target.closest('[data-x]');
  if(x){const [m]=imgs.splice(+x.dataset.x,1);if(m.file)URL.revokeObjectURL(m.url);drawGal();return}
  const t=e.target.closest('.gi');
  if(t&&+t.dataset.k>0){const [m]=imgs.splice(+t.dataset.k,1);imgs.unshift(m);drawGal()}};
$('f-img').onchange=e=>{
  const msgs=[];
  for(const f of e.target.files){
    if(imgs.length>=MAXIMG){msgs.push('Tối đa '+MAXIMG+' ảnh.');break}
    if(!['image/jpeg','image/png','image/webp'].includes(f.type)){msgs.push(f.name+': chỉ nhận JPG, PNG, WebP.');continue}
    if(f.size>15*1024*1024){msgs.push(f.name+': ảnh gốc tối đa 15MB.');continue}
    imgs.push({file:f,url:URL.createObjectURL(f)})}
  e.target.value='';drawGal();if(msgs.length)toast(msgs[0])};

function openForm(r){
  editing=r;$('mt').textContent=r?'Sửa phòng #'+r.id:'Thêm phòng mới';$('ferr').hidden=true;
  const set=(id,v)=>$(id).value=v??'';
  set('f-name',r?.name);$('f-type').value=r?.type||TYPES[0];$('f-city').value=r?.city||CITIES[0];
  set('f-district',r?.district);set('f-address',r?.address);
  set('f-pmin',r?vnd(r.price_min):'');set('f-pmax',r?vnd(r.price_max):'');set('f-disc',r?.discount??0);
  set('f-free',r?.free_rooms??1);set('f-total',r?.total_rooms??1);set('f-area',r?.area);set('f-desc',r?.description);
  document.querySelectorAll('#f-am input').forEach(i=>i.checked=!!r&&(r.amenities||[]).includes(i.value));
  $('f-hot').checked=!!r?.hot;$('f-active').checked=r?r.is_active:true;
  $('f-units').innerHTML='';(r?.units||[]).forEach(addUnit);
  document.querySelectorAll('#f-ram input').forEach(i=>i.checked=!!r&&(r.room_amenities||[]).includes(i.value));
  fillKV('f-costs',r?.costs);fillKV('f-dets',r?.details);set('f-nearby',r?.nearby);$('f-ver').checked=!!r?.verified;
  $('f-img').value='';imgs=roomPaths(r).map(p=>({path:p,url:imgUrl(p)}));drawGal();
  $('ov').hidden=false;$('ov').scrollTop=0}

$('rf').onsubmit=async e=>{e.preventDefault();
  const v=id=>$(id).value.trim(),errs=[];
  const rec={name:v('f-name'),type:v('f-type'),city:v('f-city'),district:v('f-district'),address:v('f-address'),
    free_rooms:+v('f-free'),total_rooms:+v('f-total'),price_min:vndIn(v('f-pmin'))/1e6,price_max:vndIn(v('f-pmax'))/1e6,discount:+v('f-disc')||0,
    area:v('f-area')?+v('f-area'):null,description:v('f-desc')||null,hot:$('f-hot').checked,is_active:$('f-active').checked,
    amenities:[...document.querySelectorAll('#f-am input:checked')].map(i=>i.value),
    units:[...document.querySelectorAll('#f-units .urow')].map(w=>({no:w.querySelector('.u-no').value.trim(),floor:w.querySelector('.u-fl').value.trim(),price:vndIn(w.querySelector('.u-pr').value)?vndIn(w.querySelector('.u-pr').value)/1e6:null})).filter(u=>u.no||u.floor||u.price),
    room_amenities:[...document.querySelectorAll('#f-ram input:checked')].map(i=>i.value),
    costs:readKV('f-costs'),details:readKV('f-dets'),nearby:v('f-nearby')||null,verified:$('f-ver').checked};
  if(rec.units.some(u=>!u.no))errs.push('Mỗi dòng trong danh sách phòng phải có số phòng.');
  if(new Set(rec.units.map(u=>u.no.toLowerCase())).size<rec.units.length)errs.push('Có số phòng bị trùng trong danh sách.');
  if(rec.units.some(u=>u.price!==null&&!(u.price>0)))errs.push('Giá riêng của từng phòng phải lớn hơn 0.');
  if(rec.units.length){rec.free_rooms=rec.units.length;if(rec.free_rooms>rec.total_rooms)errs.push('Danh sách có '+rec.free_rooms+' phòng trống, nhiều hơn tổng số phòng ('+rec.total_rooms+'). Hãy tăng Tổng số phòng.')}
  if(!rec.name||!rec.district||!rec.address)errs.push('Vui lòng nhập tên, quận/huyện và địa chỉ.');
  if(rec.total_rooms<1)errs.push('Tổng số phòng phải từ 1 trở lên.');
  if(rec.free_rooms<0||rec.free_rooms>rec.total_rooms)errs.push('Số phòng trống phải từ 0 đến tổng số phòng.');
  if(!(rec.price_min>0))errs.push('Giá thấp nhất phải lớn hơn 0 (nhập số tiền đầy đủ, VD: 1.500.000).');
  if(rec.price_min>0&&(Math.round(rec.price_min*1e6)%10000||Math.round(rec.price_max*1e6)%10000||rec.units.some(u=>u.price&&Math.round(u.price*1e6)%10000)))errs.push('Giá cần làm tròn đến hàng chục nghìn đồng (VD: 1.550.000).');
  if(rec.price_max<rec.price_min)errs.push('Giá cao nhất phải lớn hơn hoặc bằng giá thấp nhất.');
  if(rec.discount<0||rec.discount>90)errs.push('Giảm giá từ 0 đến 90%.');
  if(imgs.length>MAXIMG)errs.push('Tối đa '+MAXIMG+' ảnh mỗi phòng.');
  const fail=m=>{$('ferr').innerHTML=m.map(esc).join('<br>');$('ferr').hidden=false;$('ov').scrollTop=0;$('fsave').disabled=false};
  if(errs.length)return fail(errs);
  $('fsave').disabled=true;
  const uploaded=[],paths=[],total=imgs.filter(m=>m.file).length;let n=0;
  for(const m of imgs){
    if(!m.file){paths.push(m.path);continue}
    $('fsave').textContent=`Đang tải ảnh ${++n}/${total}...`;
    try{const p=await uploadImage(m.file);uploaded.push(p);paths.push(p)}
    catch(e){$('fsave').textContent='Lưu';for(const p of uploaded)await removeImage(p);return fail(['Tải ảnh thất bại: '+e.message])}}
  $('fsave').textContent='Lưu';
  const old=roomPaths(editing);
  rec.images=paths;rec.image_path=paths[0]||null;
  const {error}=editing?await sb.from('rooms').update(rec).eq('id',editing.id):await sb.from('rooms').insert(rec);
  if(error){for(const p of uploaded)await removeImage(p);return fail(['Lưu thất bại: '+error.message])}
  for(const p of old)if(!paths.includes(p))await removeImage(p);
  $('fsave').disabled=false;$('ov').hidden=true;toast(editing?'Đã lưu thay đổi':'Đã thêm phòng mới');loadAll()};
