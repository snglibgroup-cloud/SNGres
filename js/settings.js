const SET_DEF={"lead_title": "Chưa tìm được phòng ưng ý?", "lead_desc": "Để lại số điện thoại, nhân viên sẽ gọi tư vấn và dẫn xem phòng miễn phí trong vòng 15 phút.", "lead_placeholder": "Nhập số điện thoại", "lead_btn": "Nhận tư vấn", "book_zalo_label": "SĐT Zalo (nếu khác số điện thoại ở trên)", "book_zalo_ph": "Để trống nếu dùng chung số trên", "contact_phone": "", "contact_note": "Lưu ý: Vui lòng liên hệ trước để xác nhận phòng còn trống hay không rồi hãy qua xem nhé, vì phòng có thể vừa được thuê.", "contact_zalo_text": "Chat Zalo tư vấn","logo_main": "SNGres", "logo_accent": "", "announce": "Phòng trống thực tế · Dẫn xem tận nơi · Không mất phí môi giới 🚀", "nav_search": "Tìm phòng", "nav_apartment": "Căn hộ", "nav_dorm": "Ký túc xá", "nav_space": "Mặt bằng", "footer_desc": "Nền tảng tìm phòng trọ, căn hộ dịch vụ.", "footer_contact": "Tổng đài: 1900 0000", "copyright": "© 2026 SNGres."};
let SETV={};
function applySettings(o){const g=k=>(o[k]!==undefined&&o[k]!==null)?o[k]:SET_DEF[k];
  document.querySelectorAll('[data-set]').forEach(e=>e.textContent=g(e.dataset.set));
  document.querySelectorAll('[data-logo]').forEach(e=>{e.textContent=g('logo_main');const a=g('logo_accent');if(a){const x=document.createElement('span');x.textContent=a;e.appendChild(x)}});
  document.querySelectorAll('[data-ph]').forEach(e=>e.placeholder=g(e.dataset.ph));
  document.querySelectorAll('[data-hide]').forEach(e=>e.hidden=!g(e.dataset.hide));SETV=o;
  const ph=String(g('contact_phone')||'').replace(/\D/g,'');document.querySelectorAll('[data-zl]').forEach(e=>e.href='https://zalo.me/'+ph);document.querySelectorAll('[data-cpv]').forEach(e=>e.textContent=g('contact_phone'));
  $('ann').textContent=g('announce');$('ann').hidden=!g('announce');
  document.title=g('logo_main')+' – Tìm phòng trọ, căn hộ dịch vụ'}
applySettings({});
sbq('site_settings?select=key,value').then(r=>r.ok?r.json():[]).then(a=>{const o={};a.forEach(x=>o[x.key]=x.value);applySettings(o)}).catch(()=>{});
