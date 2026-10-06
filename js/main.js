fill();
$('grid').innerHTML='<div class="empty">Đang tải danh sách phòng...</div>';
function ready(){const d=store.get('nt_dist');if(d&&dists().includes(d))st.dist=d;fillDist();deals();tiles();render();route()}
loadRooms().then(d=>{R=d;ready()}).catch(e=>{$('grid').innerHTML='<div class="empty">'+(e.message==='config'?'Chưa cấu hình Supabase. Hãy điền SUPABASE_URL và SUPABASE_ANON_KEY trong config.js.':'Không tải được dữ liệu phòng. Vui lòng thử lại sau.')+'</div>'});
