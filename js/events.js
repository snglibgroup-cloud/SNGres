// events
document.addEventListener('click',e=>{
  const f=e.target.closest('[data-f]');if(f){e.stopPropagation();const i=+f.dataset.f;fav.has(i)?fav.delete(i):fav.add(i);render();return}
  const c=e.target.closest('.rc,.dl,.ni,.pin');if(c){detail(+c.dataset.i);return}
  const t=e.target.closest('.tabs button[data-t],.jt');if(t&&t.dataset.t){st.tab=t.dataset.t;render();return}
  const d=e.target.closest('[data-d]');if(d){st.dist=d.dataset.d;$('fd').value=st.dist;render();$('lst').scrollIntoView({behavior:'smooth'});return}
  const q=e.target.closest('[data-q]');if(q){const v=q.dataset.q;st.am.clear();st.pr.clear();if(v.startsWith('Giá'))st.pr.add(0);else if(AM.includes(v))st.am.add(v);else if(v=='Có gác lửng')st.am.add('Có gác');else if(v.includes('Căn hộ'))st.tab='Căn hộ';else if(v.includes('Ký túc'))st.tab='Ký túc xá';else if(v.includes('Mặt bằng'))st.tab='Mặt bằng';render();$('lst').scrollIntoView({behavior:'smooth'});return}
  const p=e.target.closest('[data-p]');if(p){const i=+p.dataset.p;st.pr.has(i)?st.pr.delete(i):st.pr.add(i);render();return}
  const a=e.target.closest('[data-a]');if(a){const v=a.dataset.a;st.am.has(v)?st.am.delete(v):st.am.add(v);render();return}
  const s=e.target.closest('[data-s]');if(s)go(+s.dataset.s)});
$('ft').onchange=e=>{st.tab=e.target.value;render()};
$('fam').onclick=()=>$('amw').classList.toggle('open');
document.addEventListener('click',e=>{if(!e.target.closest('#amw'))$('amw').classList.remove('open')});
$('city').onchange=$('fcity').onchange=e=>setCity(e.target.value);
$('fd').onchange=e=>{st.dist=e.target.value;st.ward=st.house='';store.set('nt_dist',st.dist);render()};
$('fs').onchange=e=>{st.sort=e.target.value;render()};
$('fp').onchange=e=>{st.pr.clear();if(e.target.value!=='')st.pr.add(+e.target.value);render()};
$('fq').oninput=e=>{st.q=e.target.value.trim();render()};
$('fgo2').onclick=()=>$('lst').scrollIntoView({behavior:'smooth'});
$('sf').onsubmit=e=>{e.preventDefault();st.q=$('q').value.trim();$('fq').value=st.q;st.cat=$('sc').value;render();$('lst').scrollIntoView({behavior:'smooth'})};
$('nf').onsubmit=e=>{e.preventDefault();const f=e.target,ph=f.querySelector('input').value.trim();
sbq('leads',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({phone:ph})}).then(x=>{if(x.ok){f.reset();toast('Đã gửi! Nhân viên sẽ liên hệ bạn sớm.')}else toast('Gửi thất bại, vui lòng kiểm tra lại số điện thoại')}).catch(()=>toast('Không kết nối được máy chủ'))};
$('bl').onclick=e=>{e.preventDefault();toast('Tính năng đăng nhập chưa được kết nối')};
$('bf').onclick=()=>openDr('fav');
$('bc').onclick=()=>openDr('cart');
