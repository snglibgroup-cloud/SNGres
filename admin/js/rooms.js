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
<td class="pr">${r.discount?`<s style="color:#999;font-weight:400">${num(r.price_min)}</s> `:''}${num(d)}${+r.price_max!==+r.price_min?' – '+num(r.price_max):''}</td>
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
    if(r.image_path)await sb.storage.from(BUCKET).remove([r.image_path]);
    toast('Đã xóa phòng');loadAll()}};

// ---------- form thêm / sửa ----------
$('add').onclick=()=>openForm(null);
$('fcancel').onclick=()=>{$('ov').hidden=true};
function openForm(r){
  editing=r;$('mt').textContent=r?'Sửa phòng #'+r.id:'Thêm phòng mới';$('ferr').hidden=true;
  const set=(id,v)=>$(id).value=v??'';
  set('f-name',r?.name);$('f-type').value=r?.type||TYPES[0];$('f-city').value=r?.city||CITIES[0];
  set('f-district',r?.district);set('f-address',r?.address);
  set('f-pmin',r?num(r.price_min):'');set('f-pmax',r?num(r.price_max):'');set('f-disc',r?.discount??0);
  set('f-free',r?.free_rooms??1);set('f-total',r?.total_rooms??1);set('f-area',r?.area);set('f-desc',r?.description);
  document.querySelectorAll('#f-am input').forEach(i=>i.checked=!!r&&(r.amenities||[]).includes(i.value));
  $('f-hot').checked=!!r?.hot;$('f-active').checked=r?r.is_active:true;
  $('f-img').value='';$('f-rm').checked=false;
  $('f-pv').hidden=!r?.image_path;if(r?.image_path)$('f-pvi').style.backgroundImage=`url('${imgUrl(r.image_path)}')`;
  $('ov').hidden=false;$('ov').scrollTop=0}

$('rf').onsubmit=async e=>{e.preventDefault();
  const v=id=>$(id).value.trim(),errs=[];
  const rec={name:v('f-name'),type:v('f-type'),city:v('f-city'),district:v('f-district'),address:v('f-address'),
    free_rooms:+v('f-free'),total_rooms:+v('f-total'),price_min:+v('f-pmin'),price_max:+v('f-pmax'),discount:+v('f-disc')||0,
    area:v('f-area')?+v('f-area'):null,description:v('f-desc')||null,hot:$('f-hot').checked,is_active:$('f-active').checked,
    amenities:[...document.querySelectorAll('#f-am input:checked')].map(i=>i.value)};
  if(!rec.name||!rec.district||!rec.address)errs.push('Vui lòng nhập tên, quận/huyện và địa chỉ.');
  if(rec.total_rooms<1)errs.push('Tổng số phòng phải từ 1 trở lên.');
  if(rec.free_rooms<0||rec.free_rooms>rec.total_rooms)errs.push('Số phòng trống phải từ 0 đến tổng số phòng.');
  if(!(rec.price_min>0))errs.push('Giá thấp nhất phải lớn hơn 0 (đơn vị: triệu đồng).');
  if(rec.price_max<rec.price_min)errs.push('Giá cao nhất phải lớn hơn hoặc bằng giá thấp nhất.');
  if(rec.discount<0||rec.discount>90)errs.push('Giảm giá từ 0 đến 90%.');
  const file=$('f-img').files[0];
  if(file){if(!['image/jpeg','image/png','image/webp'].includes(file.type))errs.push('Chỉ chấp nhận ảnh JPG, PNG hoặc WebP.');
    else if(file.size>3*1024*1024)errs.push('Ảnh tối đa 3MB.')}
  const fail=m=>{$('ferr').innerHTML=m.map(esc).join('<br>');$('ferr').hidden=false;$('ov').scrollTop=0;$('fsave').disabled=false};
  if(errs.length)return fail(errs);
  $('fsave').disabled=true;
  let newPath=null;
  if(file){newPath=crypto.randomUUID()+'.'+({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'})[file.type];
    const {error}=await sb.storage.from(BUCKET).upload(newPath,file,{contentType:file.type,upsert:false});
    if(error)return fail(['Tải ảnh thất bại: '+error.message])}
  const old=editing?.image_path||null;
  rec.image_path=newPath||($('f-rm').checked?null:old);
  const {error}=editing?await sb.from('rooms').update(rec).eq('id',editing.id):await sb.from('rooms').insert(rec);
  if(error){if(newPath)await sb.storage.from(BUCKET).remove([newPath]);return fail(['Lưu thất bại: '+error.message])}
  if(old&&old!==rec.image_path)await sb.storage.from(BUCKET).remove([old]);
  $('fsave').disabled=false;$('ov').hidden=true;toast(editing?'Đã lưu thay đổi':'Đã thêm phòng mới');loadAll()};
