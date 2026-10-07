// Yêu thích & Lịch hẹn: lưu trên máy khách + bảng trượt bên phải
const FC={
  save(){store.set('nt_fav',JSON.stringify([...fav].map(i=>R[i]&&R[i][13])));store.set('nt_cart',JSON.stringify([...cart].map(i=>R[i]&&R[i][13])))},
  load(){const ix=k=>{try{return JSON.parse(store.get(k)||'[]')}catch(_){return[]}};
    const back=(a,S)=>a.forEach(id=>{const i=R.findIndex(r=>r[13]==id);if(i>=0)S.add(i)});back(ix('nt_fav'),fav);back(ix('nt_cart'),cart)}
};
// Lịch đã đặt (lưu trên máy khách để hiện trong mục Lịch hẹn)
const BK={
  list(){try{const a=JSON.parse(store.get('nt_booked')||'[]');return Array.isArray(a)?a:[]}catch(_){return[]}},
  add(x){const a=this.list();a.unshift(x);store.set('nt_booked',JSON.stringify(a.slice(0,30)))},
  del(k){const a=this.list();a.splice(k,1);store.set('nt_booked',JSON.stringify(a))}
};
let DR=null;
function drEl(){if(DR)return DR;DR=document.createElement('div');DR.className='dro';DR.hidden=true;
  DR.innerHTML='<div class="drb"></div><aside class="drp" role="dialog" aria-modal="true"><div class="drh"><b id="drt"></b><button type="button" class="drx" aria-label="Đóng">✕</button></div><div class="drc" id="drc"></div></aside>';
  document.body.appendChild(DR);
  DR.addEventListener('click',e=>{
    if(e.target.closest('.drb,.drx')){closeDr();return}
    let x;
    if(x=e.target.closest('[data-dv]')){const i=+x.dataset.dv;closeDr();detail(i);return}
    if(x=e.target.closest('[data-dx]')){const i=+x.dataset.dx,S=DR.dataset.k=='fav'?fav:cart;S.delete(i);render();drRender();return}
    if(x=e.target.closest('[data-dc]')){cart.add(+x.dataset.dc);render();toast('Đã thêm vào lịch hẹn');drRender();return}
    if(x=e.target.closest('[data-bx]')){BK.del(+x.dataset.bx);render();drRender();return}
    if(e.target.closest('#drgo')){drSend();return}
    if(e.target.closest('#drclr')){const S=DR.dataset.k=='fav'?fav:cart;S.clear();render();drRender()}
  });
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!DR.hidden)closeDr()});
  return DR}
function openDr(k){const d=drEl();d.dataset.k=k;d.hidden=false;document.body.style.overflow='hidden';drRender();requestAnimationFrame(()=>d.classList.add('on'))}
function closeDr(){if(!DR)return;DR.classList.remove('on');document.body.style.overflow='';setTimeout(()=>{DR.hidden=true},250)}
function drItem(i,k){const r=R[i];
  return `<div class="dri"><i class="dth" data-dv="${i}" style="background:${bg(r)}"></i><div class="dif"><b data-dv="${i}">${esc(r[0])}</b><small>${esc(r[3])}, ${esc(r[2])}</small><span>${fmt(dis(r),r[7])}</span>${k=='fav'&&!cart.has(i)?`<button type="button" class="dlk" data-dc="${i}">+ Thêm vào lịch hẹn</button>`:''}${k=='fav'&&cart.has(i)?'<em class="dok">✓ Đã trong lịch hẹn</em>':''}</div><button type="button" class="ddx" data-dx="${i}" aria-label="Bỏ">✕</button></div>`}
function bkItem(b,k){const i=R.findIndex(r=>r[13]==b.id),w=iso=>{const d=new Date(iso);return isNaN(d)?'':d.toLocaleString('vi-VN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'})};
  return `<div class="dri dbk"><i class="dth" ${i>=0?`data-dv="${i}"`:''} style="background:${i>=0?bg(R[i]):'#e6eef9'}"></i><div class="dif"><b ${i>=0?`data-dv="${i}"`:''}>${esc(b.name||'Phòng')}${b.no?' · '+esc(b.no):''}</b><span class="dst">✓ Đã đặt lịch</span><small>Hẹn xem: <b style="display:inline;cursor:default">${esc(w(b.visit))}</b></small><small>Nhân viên sẽ liên hệ xác nhận · gửi lúc ${esc(w(b.sent))}</small></div><button type="button" class="ddx" data-bx="${k}" aria-label="Xóa">✕</button></div>`}
function drRender(){const k=DR.dataset.k,S=k=='fav'?fav:cart,L=[...S].filter(i=>R[i]),B=k=='cart'?BK.list():[];
  $('drt').textContent=(k=='fav'?'Phòng yêu thích':'Lịch hẹn xem phòng')+' ('+(L.length+B.length)+')';
  let h;
  if(!L.length&&!B.length)h=`<div class="dre">${k=='fav'?'Bạn chưa thích phòng nào.<br>Bấm ♡ trên phòng để lưu lại xem sau.':'Chưa có phòng nào trong lịch hẹn.<br>Vào chi tiết phòng và bấm "Thêm vào lịch hẹn".'}</div>`;
  else{h=(B.length?`<div class="dsh">Đã đặt lịch (${B.length})</div>`+B.map((b,j)=>bkItem(b,j)).join(''):'')+(L.length&&B.length?`<div class="dsh">Chờ gửi (${L.length})</div>`:'')+L.map(i=>drItem(i,k)).join('');
    if(k=='cart'&&L.length)h+=`<div class="drf"><div class="gt">Thông tin để nhân viên liên hệ</div>
<div class="fl2"><label>Tên khách hàng <em>*</em></label><input id="dn" type="text" autocomplete="name" value="${esc(store.get('nt_name')||'')}"></div>
<div class="fl2"><label>Số điện thoại <em>*</em></label><input id="dt" type="tel" inputmode="numeric" autocomplete="tel" value="${esc(store.get('nt_phone')||'')}"></div>
<div class="fl2"><label>Ngày/giờ muốn xem <em>*</em></label><input id="dd" type="datetime-local"></div>
<div class="fl2"><label>Ghi chú</label><input id="dg" type="text" placeholder="Tùy chọn"></div>
<button type="button" class="bkb go" id="drgo">Gửi yêu cầu xem ${L.length} phòng</button></div>`;
    if(L.length)h+=`<button type="button" class="dlc" id="drclr">Xóa danh sách chờ</button>`}
  $('drc').innerHTML=h}
function drSend(){const v=k=>$(k).value.trim(),L=[...cart].filter(i=>R[i]);
  if(!v('dn')||!v('dt')||!v('dd'))return toast('Vui lòng điền đủ các mục có dấu *');
  if(!/^0\d{9}$/.test(v('dt')))return toast('Số điện thoại chưa đúng (10 số, bắt đầu bằng 0)');
  const b=$('drgo');b.disabled=true;const at=new Date(v('dd')).toISOString();
  Promise.all(L.map(i=>sbq('bookings',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({room_id:R[i][13],name:v('dn'),phone:v('dt'),visit_at:at,note:v('dg')||null})}).then(x=>x.ok)))
  .then(a=>{b.disabled=false;store.set('nt_name',v('dn'));store.set('nt_phone',v('dt'));
    const ok=L.filter((_,j)=>a[j]);ok.forEach(i=>{BK.add({id:R[i][13],name:R[i][0],no:'',visit:at,sent:new Date().toISOString()});cart.delete(i)});render();
    if(ok.length==L.length){toast('Đã gửi lịch hẹn! Nhân viên sẽ liên hệ bạn sớm.');closeDr()}
    else{toast('Gửi được '+ok.length+'/'+L.length+' phòng, vui lòng thử lại phần còn lại');drRender()}})
  .catch(()=>{b.disabled=false;toast('Không kết nối được máy chủ')})}
