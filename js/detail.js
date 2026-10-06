// detail
const vnd=m=>Math.round(m*1e6).toLocaleString('en-US');
const rooms=r=>(r[17]||[]).map(u=>({no:String(u.no||'').trim(),floor:String(u.floor||'').trim(),p:+u.price>0?+u.price:null})).filter(u=>u.no);
const uPrice=(r,u)=>u&&u.p!=null?u.p:dis(r);
let P={};
const COST=[["⚡","Điện"],["💧","Nước"],["💲","Dịch vụ"],["🅿️","Giữ xe"],["📶","Internet"],["🧺","Giặt"],["💰","Đặt cọc"],["🛵","Xe điện"]];
function info(r,i){const A=a=>r[8].includes(a),RA=a=>(r[18]||[]).includes(a),X=esc,rs=rooms(r);
const am=[["🛏️","Giường",RA('Giường')],["🛌","Nệm",RA('Nệm')],["👔","Tủ quần áo",RA('Tủ quần áo')],["🛗","Thang máy",RA('Thang máy')],["📶","Wifi",RA('Wifi')],["❄️","Máy lạnh",A('Có máy lạnh')||RA('Máy lạnh')],["🍳","Kệ bếp",RA('Kệ bếp')],["🚿","Nước nóng",RA('Nước nóng')],["🧊","Tủ lạnh",RA('Tủ lạnh')],["🪜","Gác",A('Có gác')||RA('Gác')]].filter(a=>a[2]);
const C=r[19]||{},cs=COST.map(c=>[c[0],c[1],String(C[c[1]]||'').trim()]).filter(c=>c[2]);
const D=r[20]||{},dt=[["Toilet",D['Toilet']],["Giờ giấc",A('Giờ tự do')?'Tự do':D['Giờ giấc']],["Máy giặt",D['Máy giặt']],["Cửa sổ",A('Có cửa sổ')?'Có':''],["Ban công",A('Có ban công')?'Có':''],["Thú cưng",A('Nuôi thú cưng')?'Có':''],["Để xe",D['Để xe']],["Xe điện",A('Nhận xe điện')?'Có':'']].map(d=>[d[0],String(d[1]||'').trim()]).filter(d=>d[1]);
const good=v=>['Riêng','Có','Tự do'].includes(v);
const poiA=String(r[21]||'').split('\n').map(l=>l.trim()).filter(Boolean).slice(0,12).map(l=>{const q=l.split('|');return [q[0].trim(),(q[1]||'').trim()]});
const ar=r[15],desc=r[16],fl=rs[0]?rs[0].floor:'',area=wardOf(r)||r[3];
P.txt=[r[0],'Địa chỉ: '+r[3]+', '+r[2]+', '+r[11],'Giá: '+vnd(dis(r)),ar?'Diện tích: '+ar+'m²':'',am.length?'Tiện ích: '+am.map(a=>a[1]).join(', '):'',
cs.length?'Chi phí: '+cs.map(c=>c[1]+' '+c[2]).join('; '):'',dt.length?'Thông tin chi tiết ('+r[1]+'): '+dt.map(d=>d[0]+' '+d[1]).join('; '):'',desc?'Mô tả: '+desc:'',
'Vị trí: '+area+' | '+r[2]+' | '+r[11],poiA.length?'Tiện ích xung quanh: '+poiA.map(q=>q[0]+(q[1]?' ('+q[1]+'p)':'')).join(' | '):''].filter(Boolean).join('\n');
const sec=(t,body,em)=>`<div class="sx"><h4><span>${t}</span>${em||''}</h4>${body}</div>`;
return `<div class="c2 ib"><div class="sx hd">
<div class="tp"><div class="pzw"><small>Giá thuê mỗi tháng</small><div class="pz"><b>${vnd(dis(r))}</b><u>đ</u></div></div><div class="tpr">${r[22]?'<span class="vf">✔ Đã xác thực</span>':''}<button type="button" class="cpb" data-cp="all"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg><span>Copy</span></button></div></div>
<div class="adr"><span>📍</span>${r[3]}, ${r[2]}, ${r[11]}</div>
${(ar||rs.some(u=>u.floor))?`<div class="st"><div id="stpos"${fl?'':' hidden'}><small>Vị trí</small><b id="stposv">${X(fl)}</b></div>${ar?`<div><small>Diện tích</small><b>${ar}m²</b></div>`:''}</div>`:''}</div>
${am.length?sec('Tiện nghi trong phòng',`<div class="am">${am.map(a=>`<span class="on"><i>${a[0]}</i>${a[1]}</span>`).join('')}</div>`,`<em class="cnt">${am.length}</em>`):''}
${cs.length?sec('Chi phí &amp; điều kiện',`<ul class="lv">${cs.map(c=>`<li><i>${c[0]}</i><span>${c[1]}</span><em></em><b>${X(c[2])}</b></li>`).join('')}</ul>`):''}
${dt.length?sec('Thông tin chi tiết',`<div class="kv">${dt.map(d=>`<div><span>${d[0]}</span><b class="${good(d[1])?'y':''}">${X(d[1])}</b></div>`).join('')}</div>`,`<em>${r[1]}</em>`):''}
<div class="sx ds"><h4><span>${desc?'Mô tả':'Khu vực'}</span></h4><div id="cpd">${desc?`<p>${desc}</p>`:''}
<div class="nb"><div><small>Khu vực</small><b>${area} · ${r[2]} · ${r[11]}</b></div>${poiA.length?`<div><small>Xung quanh có</small><div class="pl">${poiA.map(q=>`<span>${X(q[0])}${q[1]?`<em>${X(q[1])} phút</em>`:''}</span>`).join('')}</div></div>`:''}</div></div></div></div>`}
function page(i){const r=R[i],rs=rooms(r);P={i,tab:0,dur:"12 tháng",n:1,rm:0};
$('pg').innerHTML=`<div class="bc"><a href="#/">Cho thuê</a><i>/</i>${r[11]}<i>/</i>${r[2]}<i>/</i><b>${r[0]}</b></div>
<div class="hd2"><div><div class="chips2"><span>${r[1]}</span>${r[9]?'<span class="hot">Hot 🔥</span>':''}${r[22]?'<span class="ok">✔ Đã xác thực</span>':''}<span>Trống ${r[4]}/${r[5]} phòng</span></div><h1>${r[0]}</h1></div>
<div class="pr2"><b>${fmt(dis(r),r[7])}</b><small>mỗi tháng</small></div></div>
<div class="dg2"><div>
<div class="gm" id="gm" style="background:${bg(r)}"><button type="button" class="hbt ${fav.has(i)?'on':''}" id="hb" aria-label="Yêu thích"><svg viewBox="0 0 24 24"><path d="M12 20s-8-5-8-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 15 12 20 12 20z"/></svg><span>${fav.has(i)?'Đã thích':'Yêu thích'}</span></button></div>
${info(r,i)}
<a class="bkl" href="#/">← Quay lại trang chủ</a></div>
<aside class="side"><div class="cd"><div class="cdh"><b>Phòng trống</b><small>${r[4]} phòng</small></div>
${rs.length?`<div class="rb" id="rl">${rs.map((x,k)=>`<button type="button" data-m="${k}" class="${k?'':'on'}"><b>${esc(x.no)}</b>${+uPrice(r,x).toFixed(2)} tr${x.floor?`<em>${esc(x.floor)}</em>`:''}</button>`).join('')}</div>`:(r[4]?'':'<div class="tx" id="rl">Hiện đã hết phòng trống.</div>')}</div>
<div class="cd"><div class="cdh"><b>Đặt lịch xem</b><span class="pc" id="bp">${vnd(rs.length?uPrice(r,rs[0]):dis(r))}đ</span></div>
<button type="button" class="ctv" id="ct"><span class="ci"><svg viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20c0 1.5-1.5 2-4 2h-2"/></svg></span><span class="ct"><b>Nhận tư vấn miễn phí</b><small>Nhân viên sẽ liên hệ giúp bạn chọn phòng ưng ý</small></span></button>
<div class="fm fold" id="bfm">
<div class="gt">Thông tin liên hệ</div>
<div class="fl2"><label>Tên khách hàng <em>*</em></label><input id="bn" type="text" autocomplete="name"></div>
<div class="fl2"><label>Số điện thoại <em>*</em></label><input id="bt" type="tel" inputmode="numeric" autocomplete="tel"></div>
<div class="fl2 f" data-hide="book_zalo_label"><label data-set="book_zalo_label"></label><input id="bz" type="tel" inputmode="numeric" data-ph="book_zalo_ph"></div>
<div class="gt">Lịch xem phòng</div>
<div class="fl2 f"><label>Ngày/giờ xem <em>*</em></label><input id="bd" type="datetime-local"></div>
<div class="gt">Nhu cầu ở</div>
<div class="fl2"><label>Số người ở <em>*</em></label><select id="bq"><option value="">Chọn</option>${[1,2,3,4,5,6].map(n=>`<option>${n}</option>`).join('')}</select></div>
<div class="fl2"><label>Số lượng xe <em>*</em></label><select id="bv"><option value="">Chọn</option>${[0,1,2,3].map(n=>`<option>${n}</option>`).join('')}</select></div>
<div class="fl2"><label>Nuôi thú cưng <em>*</em></label><select id="bpet"><option value="">Chọn</option><option>Không</option><option>Có</option></select></div>
<div class="fl2"><label>Thời gian vào ở <em>*</em></label><input id="bm" type="text" list="bml" placeholder="Dự kiến..." autocomplete="off"><datalist id="bml"><option value="Cần phòng ở ngay"><option value="3 ngày"><option value="5 ngày"><option value="7 ngày"><option value="15 ngày"><option value="Xem xong mới chọn"><option value="Giữa tháng này"><option value="Cuối tháng này"><option value="Đầu tháng sau"><option value="Giữa tháng sau"><option value="Cuối tháng sau"></datalist></div>
<div class="fl2 f"><label>Ghi chú</label><input id="bg" type="text" placeholder="Nhập ghi chú (tùy chọn)"></div></div>
<button type="button" class="bkb" id="bk">Đặt lịch xem phòng</button></div></aside></div>`}
const mark=(sel,x)=>document.querySelectorAll(sel).forEach(o=>o.classList.toggle('on',o==x));
$('pg').addEventListener('click',e=>{const c=k=>e.target.closest(k);let x;const r=R[P.i];
if(x=c('#rl button')){P.rm=+x.dataset.m;mark('#rl button',x);{const u=rooms(r)[P.rm];$('bp').textContent=vnd(uPrice(r,u))+'đ';const sp=$('stpos');if(sp){sp.hidden=!u.floor;$('stposv').textContent=u.floor}}}
else if(x=c('[data-cp]')){const t=P.txt,fb=()=>{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(_){}a.remove()};(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(fb);x.classList.add('done');x.lastChild.textContent='Đã copy!';setTimeout(()=>{x.classList.remove('done');x.lastChild.textContent='Copy'},1500)}
else if(c('#ad')){const i=P.i;cart.has(i)?cart.delete(i):cart.add(i);render();$('ad').textContent=cart.has(i)?'Đã có trong lịch hẹn ✓':'Thêm vào lịch hẹn';toast(cart.has(i)?'Đã thêm vào lịch hẹn':'Đã bỏ khỏi lịch hẹn')}
else if(x=c('#hb')){const i=P.i,on=!fav.has(i);on?fav.add(i):fav.delete(i);render();x.classList.toggle('on',on);x.lastChild.textContent=on?'Đã thích':'Yêu thích';if(on){x.classList.remove('pop');void x.offsetWidth;x.classList.add('pop')}toast(on?'Đã thêm vào yêu thích':'Đã bỏ khỏi yêu thích')}
else if(c('#ct')){const f=$('bfm');if(!f.classList.contains('open')){f.classList.add('open');$('bk').textContent='Xác nhận đặt lịch';$('bk').classList.add('go')}f.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>$('bn').focus({preventScroll:true}),400);toast('Điền tên và số điện thoại để nhân viên liên hệ tư vấn')}
else if(c('#bk')&&!$('bfm').classList.contains('open')){$('bfm').classList.add('open');$('bk').textContent='Xác nhận đặt lịch';$('bk').classList.add('go');$('bfm').scrollIntoView({behavior:'smooth',block:'center'})}
else if(c('#bk')){const v=k=>$(k).value.trim();
if(['bn','bt','bd','bq','bv','bpet','bm'].some(k=>!v(k)))return toast('Vui lòng điền đủ các mục có dấu *');
if(!/^0\d{9}$/.test(v('bt')))return toast('Số điện thoại chưa đúng (10 số, bắt đầu bằng 0)');
if(v('bz')&&!/^0\d{9}$/.test(v('bz')))return toast('SĐT Zalo chưa đúng (10 số, bắt đầu bằng 0)');
const rs=rooms(r),btn=$('bk');btn.disabled=true;
sbq('bookings',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({room_id:r[13],room_no:rs.length?String(rs[P.rm].no):null,name:v('bn'),phone:v('bt'),zalo_phone:v('bz')||null,visit_at:v('bd')?new Date(v('bd')).toISOString():null,people:+v('bq'),vehicles:+v('bv'),pet:v('bpet'),move_in:v('bm'),note:v('bg')||null})})
.then(x=>{btn.disabled=false;if(x.ok){['bn','bt','bz','bd','bq','bv','bpet','bm','bg'].forEach(k=>$(k).value='');toast('Đã gửi yêu cầu xem phòng! Nhân viên sẽ liên hệ bạn sớm.')}else toast('Gửi thất bại, vui lòng thử lại')})
.catch(()=>{btn.disabled=false;toast('Không kết nối được máy chủ')})}});


function detail(i){location.hash='#/phong/'+R[i][13]}
function route(){const m=location.hash.match(/^#\/phong\/(\d+)$/),mn=document.querySelector('main.w');
const ix=m?R.findIndex(r=>r[13]==+m[1]):-1;if(ix>=0){mn.style.display='none';$('pg').hidden=false;page(ix);applySettings(SETV);scrollTo(0,0)}else{mn.style.display='';$('pg').hidden=true}}
addEventListener('hashchange',route);

