// ---------- khách hàng ----------
const stSel=(t,id,s)=>`<select data-t="${t}" data-id="${id}" style="height:34px;width:auto;font-size:13px">${Object.entries(STATUS).map(([k,v])=>`<option value="${k}"${k===s?' selected':''}>${v}</option>`).join('')}</select>`;
function badge(el,n){el.hidden=!n;el.textContent=n}
function renderBK(){badge($('nb'),BK.filter(x=>x.status==='new').length);
  $('bt').innerHTML=BK.length?`<table><tr><th>Gửi lúc</th><th>Khách</th><th>Phòng</th><th>Lịch xem</th><th>Nhu cầu</th><th>Trạng thái</th><th></th></tr>`+BK.map(r=>`<tr>
<td style="white-space:nowrap">${dt(r.created_at)}</td><td class="nm"><b>${esc(r.name)}</b><a href="tel:${esc(r.phone)}">${esc(r.phone)}</a>${r.zalo_phone?`<small>Zalo: <a target="_blank" rel="noopener" href="https://zalo.me/${esc(r.zalo_phone)}">${esc(r.zalo_phone)} ↗</a></small>`:''}</td>
<td class="nm"><b>${esc(r.room_name||'(phòng đã xóa)')}</b><small>${r.room_no?'Phòng '+esc(r.room_no):''}</small></td><td style="white-space:nowrap">${dt(r.visit_at)}</td>
<td><div class="det">${r.people??0} người · ${r.vehicles??0} xe · thú cưng: <b>${esc(r.pet||'—')}</b><br>Vào ở: <b>${esc(r.move_in||'—')}</b>${r.note?'<br>Ghi chú: '+esc(r.note):''}</div></td>
<td>${stSel('bookings',r.id,r.status)}</td><td><button class="btn r s" data-t="bookings" data-del="${r.id}">Xóa</button></td></tr>`).join('')+'</table>':'<div class="empty">Chưa có yêu cầu đặt lịch nào.</div>'}
function renderLD(){badge($('nl'),LD.filter(x=>x.status==='new').length);
  $('lt').innerHTML=LD.length?`<table><tr><th>Gửi lúc</th><th>Số điện thoại</th><th>Trạng thái</th><th></th></tr>`+LD.map(r=>`<tr><td>${dt(r.created_at)}</td>
<td><a href="tel:${esc(r.phone)}"><b>${esc(r.phone)}</b></a></td><td>${stSel('leads',r.id,r.status)}</td><td><button class="btn r s" data-t="leads" data-del="${r.id}">Xóa</button></td></tr>`).join('')+'</table>':'<div class="empty">Chưa có khách nào để lại số điện thoại.</div>'}
async function custAction(e){
  const sel=e.target.closest('select[data-t]'),del=e.target.closest('[data-del]');
  if(sel&&e.type==='change'){const {error}=await sb.from(sel.dataset.t).update({status:sel.value}).eq('id',sel.dataset.id);
    if(error)return toast('Lỗi: '+error.message,true);const L=sel.dataset.t==='bookings'?BK:LD,x=L.find(i=>i.id==sel.dataset.id);if(x)x.status=sel.value;
    sel.dataset.t==='bookings'?renderBK():renderLD();return toast('Đã cập nhật trạng thái')}
  if(del&&e.type==='click'){if(!confirm('Xóa mục này?'))return;
    const {error}=await sb.from(del.dataset.t).delete().eq('id',del.dataset.del);
    if(error)return toast('Lỗi: '+error.message,true);toast('Đã xóa');loadAll()}}
['bt','lt'].forEach(id=>{$(id).addEventListener('change',custAction);$(id).addEventListener('click',custAction)});
