// ---------- khởi động ----------
$('ft').innerHTML+=opts(TYPES);$('f-type').innerHTML=opts(TYPES);$('f-city').innerHTML=opts(CITIES);
$('f-am').innerHTML=AMS.map(a=>`<label><input type="checkbox" value="${esc(a)}"> ${esc(a)}</label>`).join('');
if(!CFG.SUPABASE_URL||CFG.SUPABASE_URL.includes('xxxx')||!window.supabase){showLogin('Chưa cấu hình Supabase. Hãy điền SUPABASE_URL và SUPABASE_ANON_KEY trong config.js.')}
else{sb=supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY);
  sb.auth.getSession().then(({data})=>data.session?enter():showLogin())}

$('lf').onsubmit=async e=>{e.preventDefault();if(!sb)return;$('lbtn').disabled=true;$('lerr').hidden=true;
  const {error}=await sb.auth.signInWithPassword({email:$('lem').value.trim(),password:$('lpw').value});
  $('lbtn').disabled=false;
  if(error)return showLogin((/invalid login/i.test(error.message)?'Sai email hoặc mật khẩu.':'Lỗi đăng nhập: '+error.message));
  $('lpw').value='';enter()};

async function enter(){
  const {data,error}=await sb.from('admins').select('user_id').maybeSingle();
  if(error||!data){await sb.auth.signOut();return showLogin('Tài khoản này chưa được cấp quyền quản trị. Hãy thêm user_id vào bảng admins (xem README).')}
  $('login').hidden=true;$('app').hidden=false;loadAll()}

$('out').onclick=async()=>{await sb.auth.signOut();ROOMS=BK=LD=[];showLogin()};

async function loadAll(){
  const [r,b,l,st]=await Promise.all([
    sb.from('rooms').select('*').order('id',{ascending:false}).range(0,4999),
    sb.from('bookings').select('*').order('created_at',{ascending:false}).range(0,499),
    sb.from('leads').select('*').order('created_at',{ascending:false}).range(0,499),
    sb.from('site_settings').select('key,value')]);
  if(!st.error){SET={};(st.data||[]).forEach(x=>SET[x.key]=x.value)}
  if(r.error||b.error||l.error)toast('Không tải được dữ liệu: '+(r.error||b.error||l.error).message,true);
  ROOMS=r.data||[];BK=b.data||[];LD=l.data||[];
  $('dl').innerHTML=[...new Set(ROOMS.map(x=>x.district))].sort().map(d=>`<option value="${esc(d)}">`).join('');
  renderRooms();renderBK();renderLD();renderSite()}
