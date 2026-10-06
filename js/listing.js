function fillDist(){$('fd').innerHTML='<option value="">Chọn dữ liệu</option>'+dists().map(d=>`<option>${d}</option>`).join('')}
function fill(){
  const co=`<option value="">Tất cả khu vực</option>`+CITIES.map(c=>`<option>${c}</option>`).join('');
  $('city').innerHTML=co;$('fcity').innerHTML=co;
  fillDist();
  $('ft').innerHTML='<option value="Tất cả">Loại phòng</option>'+TYPES.map(d=>`<option>${d}</option>`).join('');
  $('fp').innerHTML='<option value="">Khoảng giá</option>'+PR.map((p,i)=>`<option value="${i}">${p[0]}</option>`).join('');
  $('ac').innerHTML='<span class="l">Tiện ích</span>'+AM.map(a=>`<button type="button" data-a="${a}">${a}</button>`).join('');
  $('tabs').innerHTML=["Tất cả",...TYPES].map(t=>`<button data-t="${t}">${t}</button>`).join('');
  $('sd').innerHTML=["Giá dưới 2 triệu","Có máy lạnh","Có gác lửng","Nuôi thú cưng","Nhận xe điện","Căn hộ có ban công","Ký túc xá giờ tự do","Mặt bằng kinh doanh"].map(x=>`<a data-q="${x}">${x}</a>`).join('');
}
function match(r){
  if(!inCity(r))return false;
  if(st.tab!="Tất cả"&&r[1]!=st.tab)return false;
  if(st.cat!="Tất cả"&&r[1]!=st.cat)return false;
  if(st.dist&&r[2]!=st.dist)return false;
  if(st.ward&&wardOf(r)!=st.ward)return false;
  if(st.house&&r[0]!=st.house)return false;
  if(st.addr&&!(r[0]+' '+r[3]).toLowerCase().includes(st.addr.toLowerCase()))return false;
  if(st.photo==='1'&&!r[12])return false;
  if(st.photo==='0'&&r[12])return false;
  if(st.hot&&!r[9])return false;
  if(st.q){const s=(r[0]+r[2]+r[3]).toLowerCase();if(!s.includes(st.q.toLowerCase()))return false}
  if(st.pr.size&&![...st.pr].some(i=>r[6]<=PR[i][2]&&r[7]>=PR[i][1]))return false;
  for(const a of st.am){
    if(a=="Không máy lạnh"){if(r[8].includes("Có máy lạnh"))return false}
    else if(a=="Không gác"){if(r[8].includes("Có gác"))return false}
    else if(!r[8].includes(a))return false}
  return true}
function setCity(v){st.city=v;st.dist=st.ward=st.house='';store.set('nt_city',v);store.set('nt_dist','');toast('Đã lưu khu vực: '+(v||'Tất cả khu vực'));fillDist();deals();tiles();render()}
function syncUI(){
  $('city').value=$('fcity').value=st.city;$('fd').value=st.dist;
  $('fp').value=st.pr.size?String([...st.pr][0]):'';$('fs').value=st.sort;
  $('ft').value=st.tab;$('fam').textContent=st.am.size?`Tiện ích (${st.am.size})`:'Tiện ích'}
function card(r,i){return `<article class="rc th" data-i="${i}"><div class="im" style="background:${bg(r)}"><div class="bd">${r[9]?'<span class="h">Hot 🔥</span>':''}${r[22]?'<span class="v">Đã xác thực</span>':''}${r[10]?`<span>-${r[10]}%</span>`:''}</div><button class="fav" data-f="${i}">${fav.has(i)?'♥':'♡'}</button></div>
<div class="rb"><b>${r[0]}</b><div class="a">${r[3]}, ${r[2]}</div><div class="f">Trống ${r[4]}/${r[5]} phòng</div><div class="pr">${r[10]?`<s style="font-size:12px;color:#888;font-weight:400">${r[6]}</s> `:''}${fmt(dis(r),r[7])}</div></div></article>`}
function render(){
  let L=R.map((r,i)=>[r,i]).filter(([r])=>match(r));
  if(st.sort=='a')L.sort((a,b)=>a[0][6]-b[0][6]);else if(st.sort=='d')L.sort((a,b)=>b[0][7]-a[0][7]);else if(st.sort=='f')L.sort((a,b)=>b[0][4]-a[0][4]);
  const none='<div class="empty">Không tìm thấy phòng phù hợp. Hãy thử bỏ bớt bộ lọc.</div>';
  if(st.map){$('grid').className='mapv';$('grid').innerHTML=L.length?L.map(([r,i])=>{const h=hue(r[0])+i*37,x=8+(h*7)%82,y=14+(h*13)%70;return `<div class="pin" data-i="${i}" style="left:${x}%;top:${y}%" title="${r[0]}">📍<small>${fmt(dis(r),r[7])}</small></div>`}).join(''):none}
  else{$('grid').className='grid';$('grid').innerHTML=L.length?L.map(([r,i])=>card(r,i)).join(''):none}
  $('rs').textContent=L.length+' kết quả';
  syncUI();
  document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t==st.tab));
  document.querySelectorAll('#ac button').forEach(b=>b.classList.toggle('on',st.am.has(b.dataset.a)));
  $('cc').textContent=cart.size;$('fc').textContent=fav.size;
}
function deals(){const D=R.map((r,i)=>[r,i]).filter(([r])=>r[10]&&inCity(r));$('deals').parentElement.style.display=D.length?'':'none';$('deals').innerHTML=D.map(([r,i])=>`<div class="dl" data-i="${i}"><i style="background:${bg(r)}"></i><span class="bg">${r[10]}% off</span><span class="lt">Ưu đãi có hạn</span><div class="p">${fmt(dis(r),r[7])} <s>${r[6]}</s></div><div>${r[0]}</div></div>`).join('')}


function tiles(){const ic={"Phòng trọ":["🏠","#e6f0ff"],"Căn hộ":["🏢","#e8f8ee"],"Ký túc xá":["🛏️","#fff0e6"],"Mặt bằng":["🏪","#f3e8ff"]};
 $('tl').innerHTML=TYPES.map(t=>`<a class="tile th jt" href="#lst" data-t="${t}"><i style="background:${ic[t][1]}">${ic[t][0]}</i><div><b>${t}</b><small>${R.filter(r=>r[1]==t&&inCity(r)).reduce((a,r)=>a+r[4],0)} phòng trống</small></div></a>`).join('')}
// banner
const SL=[["Tìm phòng nhanh, xem tận nơi, không mất phí","Phòng trống thực tế, cập nhật liên tục và nhân viên dẫn xem miễn phí.","linear-gradient(135deg,#1677ff,#4da3ff)","Tìm phòng ngay"],
["Căn hộ dịch vụ đầy đủ nội thất","Studio, 1–3 phòng ngủ, duplex tại Quận 2, Thủ Đức, Nhà Bè.","linear-gradient(135deg,#0f766e,#14b8a6)","Xem căn hộ"],
["Ký túc xá chỉ từ 0.8 triệu","Giờ giấc tự do, phù hợp sinh viên và người mới đi làm.","linear-gradient(135deg,#f97316,#fbbf24)","Xem ký túc xá"]];
$('ban').innerHTML=SL.map((s,i)=>`<div class="sl ${i?'':'on'}" style="background:${s[2]};--e:'${['🏠','🏢','🛏️'][i]}'"><h2>${s[0]}</h2><p>${s[1]}</p><a class="btn y jt" href="#lst" data-t="${['Tất cả','Căn hộ','Ký túc xá'][i]}">${s[3]}</a></div>`).join('')+'<div class="dots">'+SL.map((_,i)=>`<i class="${i?'':'on'}" data-s="${i}"></i>`).join('')+'</div>';
let cur=0;const go=n=>{cur=n;document.querySelectorAll('.sl').forEach((e,i)=>e.classList.toggle('on',i==n));document.querySelectorAll('.dots i').forEach((e,i)=>e.classList.toggle('on',i==n))};
setInterval(()=>go((cur+1)%SL.length),4500);

