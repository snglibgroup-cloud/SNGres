const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CFG=window.NT_CONFIG||{};
const TYPES=['Phòng trọ','Căn hộ','Ký túc xá','Mặt bằng'];
const CITIES=['Tp. Hồ Chí Minh','Tp. Cần Thơ','Tỉnh Bình Dương','Tp. Hà Nội','Tp. Đà Nẵng','Tỉnh Vĩnh Long','Tỉnh Thừa Thiên Huế','Tỉnh Long An','Tỉnh Tây Ninh','Tỉnh Trà Vinh','Tỉnh Đồng Tháp','Tỉnh Quảng Nam','Tỉnh Đồng Nai','Tỉnh Hậu Giang','Tỉnh Tiền Giang','Tỉnh Đắk Lắk','Tỉnh Kiên Giang','Tỉnh Bà Rịa - Vũng Tàu','Tỉnh An Giang'];
const AMS=['Có máy lạnh','Có gác','Có ban công','Có cửa sổ','Nhận xe điện','Giờ tự do','Nuôi thú cưng'];
const STATUS={new:'Mới',contacted:'Đã liên hệ',done:'Hoàn tất',cancelled:'Đã hủy'};
const BUCKET='room-images',PER=20;
const SET_DEF={"lead_title": "Chưa tìm được phòng ưng ý?", "lead_desc": "Để lại số điện thoại, nhân viên sẽ gọi tư vấn và dẫn xem phòng miễn phí trong vòng 15 phút.", "lead_placeholder": "Nhập số điện thoại", "lead_btn": "Nhận tư vấn", "book_zalo_label": "SĐT Zalo (nếu khác số điện thoại ở trên)", "book_zalo_ph": "Để trống nếu dùng chung số trên","logo_main": "SNGres", "logo_accent": "", "announce": "Phòng trống thực tế · Dẫn xem tận nơi · Không mất phí môi giới 🚀", "nav_search": "Tìm phòng", "nav_apartment": "Căn hộ", "nav_dorm": "Ký túc xá", "nav_space": "Mặt bằng", "footer_desc": "Nền tảng tìm phòng trọ, căn hộ dịch vụ.", "footer_contact": "Tổng đài: 1900 0000", "copyright": "© 2026 SNGres."},SET_KEYS=Object.keys(SET_DEF);
let sb,ROOMS=[],BK=[],LD=[],SET={},editing=null,S={q:'',type:'',page:1};

function toast(m,bad){const t=$('ts');t.textContent=m;t.classList.toggle('bad',!!bad);t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2600)}
const num=n=>+(+n).toFixed(2);
const dt=x=>x?new Date(x).toLocaleString('vi-VN',{hour12:false}):'—';
const imgUrl=p=>/^https?:\/\//.test(p)?p:CFG.SUPABASE_URL+'/storage/v1/object/public/'+BUCKET+'/'+encodeURIComponent(p);
const opts=(a,sel)=>a.map(x=>`<option${x===sel?' selected':''}>${esc(x)}</option>`).join('');
function showLogin(msg){$('app').hidden=true;$('login').hidden=false;$('lerr').hidden=!msg;$('lerr').textContent=msg||''}
