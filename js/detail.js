// detail
const AMI=[["❄️","Máy lạnh","Có máy lạnh"],["🪟","Cửa sổ","Có cửa sổ"],["🪜","Gác","Có gác"],["🌿","Ban công","Có ban công"],["🛵","Xe điện","Nhận xe điện"],["🕒","Giờ tự do","Giờ tự do"],["🐾","Thú cưng","Nuôi thú cưng"]];
const vnd=m=>Math.round(m*1e6).toLocaleString('en-US');
const rooms=r=>Array.from({length:Math.min(r[4],12)},(_,k)=>({no:(1+Math.floor(k/4))*100+k%4+1,p:r[6]+(r[7]-r[6])*((k*7)%3)/2}));
let P={};
const POI=["Chợ","Siêu thị","Trường đại học","Bệnh viện","Công viên","Trạm xe buýt","Ga Metro","Khu công nghiệp","Trung tâm thương mại","Quán ăn"];
function info(r,i){const h=hue(r[0])+i*13,sd=k=>(h*(k+3)+k*7)%10<6,A=a=>r[8].includes(a),y=(c,t,f='-')=>c?t:f,ap=r[1]=='Căn hộ';
const am=[["🛏️","Giường",sd(1)],["🛌","Nệm",sd(2)],["👔","Tủ quần áo",true],["🛗","Thang máy",ap||sd(4)],["📶","Wifi",sd(5)],["❄️","Máy lạnh",A('Có máy lạnh')],["🍳","Kệ bếp",sd(6)],["🚿","Nước nóng",sd(7)],["🧊","Tủ lạnh",sd(8)],["🪜","Gác",A('Có gác')]];
const cs=[["⚡","3.8k/kWh","Điện"],["💧","100k/ng","Nước"],["💲","200k/ph","Dịch vụ"],["🅿️",y(sd(9),"100k/xe","Miễn phí"),"Giữ xe"],["📶",y(sd(5),"100k/ph","Không có"),"Internet"],["🧺",y(sd(7),"50k/ng"),"Giặt"],["💰","1 tháng","Đặt cọc"],["🛵",y(A('Nhận xe điện'),"Nhận xe điện"),"Xe điện"]];
const dt=[["Toilet",y(sd(1),"Riêng","Chung")],["Giờ giấc",y(A('Giờ tự do'),"Tự do","23h – 5h")],["Máy giặt",y(sd(7),"Chung","Riêng")],["Cửa sổ",y(A('Có cửa sổ'),"Có","Không")],["Ban công",y(A('Có ban công'),"Có","Không")],["Thú cưng",y(A('Nuôi thú cưng'),"Có","Không")],["Để xe",y(sd(9),"Chung","Riêng")],["Xe điện",y(A('Nhận xe điện'),"Có","Không")]];
const poi=POI.filter((_,k)=>(h+k*3)%10<6).slice(0,6).map(p=>p+' ('+(2+(h+p.length)%9)+'p)').join(' | ');
const poiA=POI.filter((_,k)=>(h+k*3)%10<6).slice(0,6).map(p=>[p,2+(h+p.length)%9]);
const nOn=am.filter(a=>a[2]).length,pos=["Trệt","Lầu 1","Lầu 2","Lầu 3"][h%4],good=v=>['Riêng','Có','Tự do'].includes(v);
const ar=r[15]||15+h%16,desc=r[16]||`${r[1]} tại ${r[3]}, ${r[2]}. Còn trống ${r[4]}/${r[5]} phòng${r[8].length?', '+r[8].join(', ').toLowerCase():''}; hợp sinh viên và người đi làm.`;
P.txt=[r[0],'Địa chỉ: '+r[3]+', '+r[2]+', '+r[11],'Giá: '+vnd(dis(r)),'Vị trí: '+["Trệt","Lầu 1","Lầu 2","Lầu 3"][h%4]+' | Diện tích: '+ar+'m²','Tiện ích: '+am.filter(a=>a[2]).map(a=>a[1]).join(', '),
'Chi phí: '+cs.filter(c=>c[1]!='-').map(c=>c[2]+' '+c[1]).join('; '),'Thông tin chi tiết ('+r[1]+'): '+dt.map(d=>d[0]+' '+d[1]).join('; '),'Mô tả: '+desc,'Vị trí: '+(wardOf(r)||r[3])+' | '+r[2]+' | '+r[11],'Tiện ích xung quanh: '+poi].join('\n');
return `<div class="c2 ib"><div class="sx hd">
<div class="tp"><div class="pzw"><small>Giá thuê mỗi tháng</small><div class="pz"><b>${vnd(dis(r))}</b><u>đ</u></div></div><div class="tpr"><span class="vf">✔ Đã xác thực</span><button type="button" class="cpb" data-cp="all"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg><span>Copy</span></button></div></div>
<div class="adr"><span>📍</span>${r[3]}, ${r[2]}, ${r[11]}</div>
<div class="st"><div><small>Vị trí</small><b>${pos}</b></div><div><small>Diện tích</small><b>${ar}m²</b></div><div><small>Anhome hỗ trợ</small><b>100%</b></div></div></div>
<div class="sx"><h4><span>Tiện nghi trong phòng</span><em class="cnt">${nOn}/${am.length}</em></h4><div class="am">${am.map(a=>`<span class="${a[2]?'on':'off'}"><i>${a[0]}</i>${a[1]}</span>`).join('')}</div></div>
<div class="sx"><h4><span>Chi phí &amp; điều kiện</span></h4><ul class="lv">${cs.map(c=>`<li><i>${c[0]}</i><span>${c[2]}</span><em></em><b class="${c[1]=='-'?'no':''}">${c[1]=='-'?'Không có':c[1]}</b></li>`).join('')}</ul></div>
<div class="sx"><h4><span>Thông tin chi tiết</span><em>${r[1]}</em></h4><div class="kv">${dt.map(d=>`<div><span>${d[0]}</span><b class="${good(d[1])?'y':''}">${d[1]}</b></div>`).join('')}</div></div>
<div class="sx ds"><h4><span>Mô tả</span></h4><div id="cpd"><p>${desc}</p>
<div class="nb"><div><small>Khu vực</small><b>${wardOf(r)||r[3]} · ${r[2]} · ${r[11]}</b></div><div><small>Xung quanh có</small><div class="pl">${poiA.map(q=>`<span>${q[0]}<em>${q[1]} phút</em></span>`).join('')}</div></div></div></div></div></div>`}
function page(i){const r=R[i],rs=rooms(r);P={i,tab:0,dur:"12 tháng",n:1,rm:0};
$('pg').innerHTML=`<div class="bc"><a href="#/">Cho thuê</a><i>/</i>${r[11]}<i>/</i>${r[2]}<i>/</i><b>${r[0]}</b></div>
<div class="hd2"><div><div class="chips2"><span>${r[1]}</span>${r[9]?'<span class="hot">Hot 🔥</span>':''}<span class="ok">✔ Đã xác thực</span><span>Trống ${r[4]}/${r[5]} phòng</span></div><h1>${r[0]}</h1></div>
<div class="pr2"><b>${fmt(dis(r),r[7])}</b><small>mỗi tháng · đã gồm phí quản lý</small></div></div>
<div class="dg2"><div>
<div class="gm" id="gm" style="background:${bg(r)}"><button type="button" class="hbt ${fav.has(i)?'on':''}" id="hb" aria-label="Yêu thích"><svg viewBox="0 0 24 24"><path d="M12 20s-8-5-8-10.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 15 12 20 12 20z"/></svg><span>${fav.has(i)?'Đã thích':'Yêu thích'}</span></button></div>
<div class="th2" id="gt"${r[14]?' style="display:none"':''}>${[0,1,2,3].map(k=>`<i data-k="${k}" class="${k?'':'on'}" style="background:${bg(r,k)}"></i>`).join('')}</div>
${info(r,i)}
<a class="bkl" href="#/">← Quay lại trang chủ</a></div>
<aside class="side"><div class="cd"><div class="cdh"><b>Phòng trống</b><small>${r[4]} phòng</small></div>
${rs.length?`<div class="rb" id="rl">${rs.map((x,k)=>`<button type="button" data-m="${k}" class="${k?'':'on'}"><b>${x.no}</b>${+x.p.toFixed(2)} tr</button>`).join('')}</div>`:'<div class="tx" id="rl">Hiện đã hết phòng trống.</div>'}</div>
<div class="cd"><div class="cdh"><b>Đặt lịch xem</b><span class="pc" id="bp">${rs.length?vnd(rs[0].p)+'đ':'—'}</span></div>
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
if(x=c('#gt i')){$('gm').style.background=bg(r,+x.dataset.k);mark('#gt i',x)}
else if(x=c('#rl button')){P.rm=+x.dataset.m;mark('#rl button',x);$('bp').textContent=vnd(rooms(r)[P.rm].p)+'đ'}
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

