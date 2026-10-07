// Hỗ trợ giao diện mobile: nav dưới, vuốt banner, thanh đặt lịch cố định ở trang chi tiết
(function(){
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  /* 1. Thanh điều hướng dưới: tô sáng mục đang xem */
  const mbHome=document.querySelector('.mb [data-mb="home"]'),mbFind=document.querySelector('.mb [data-mb="find"]');
  let tick=false;
  function mbSync(){
    tick=false;
    const l=document.getElementById('lst');if(!l||!mbHome||!mbFind)return;
    const inList=l.getBoundingClientRect().top<innerHeight*.45;
    mbFind.classList.toggle('on',inList);mbHome.classList.toggle('on',!inList);
  }
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(mbSync)}},{passive:true});
  mbHome&&mbHome.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:'smooth'})});
  mbSync();

  /* 2. Vuốt ngang để đổi banner (go, cur, SL nằm trong listing.js) */
  const ban=document.getElementById('ban');
  if(ban&&typeof go==='function'){
    let x0=null,y0=0;
    ban.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
    ban.addEventListener('touchend',e=>{
      if(x0===null)return;
      const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;x0=null;
      if(Math.abs(dx)<40||Math.abs(dx)<Math.abs(dy)*1.3)return;
      const n=SL.length;go((cur+(dx<0?1:-1)+n)%n);
    },{passive:true});
  }

  /* 3. Trang chi tiết: thanh giá + nút hành động dính đáy màn hình */
  const pg=document.getElementById('pg');
  const bar=document.createElement('div');
  bar.className='stk';bar.setAttribute('role','region');bar.setAttribute('aria-label','Đặt lịch xem phòng');
  bar.innerHTML='<div class="sp"><small>Giá thuê / tháng</small><b id="stkp"></b></div><button type="button" class="a" id="stkc">Tư vấn</button><button type="button" class="b" id="stkb">Đặt lịch xem</button>';
  document.body.appendChild(bar);
  let io=null;
  function detailSync(){
    const on=!pg.hidden&&!!document.getElementById('ct');
    document.body.classList.toggle('on-detail',on);
    if(io){io.disconnect();io=null}
    if(!on){bar.classList.remove('on');return}
    const bp=document.getElementById('bp');
    document.getElementById('stkp').textContent=bp?bp.textContent:'';
    bar.classList.add('on');
    // ẩn thanh khi khung đặt lịch đã hiện trên màn hình
    const side=pg.querySelector('.side .cd:nth-child(2)');
    if('IntersectionObserver' in window&&side){
      io=new IntersectionObserver(es=>bar.classList.toggle('on',!es[0].isIntersecting),{threshold:.35});
      io.observe(side);
    }
    // giá đổi khi chọn phòng khác
    if(bp&&!bp._mo){bp._mo=new MutationObserver(()=>{document.getElementById('stkp').textContent=bp.textContent});bp._mo.observe(bp,{childList:true,characterData:true,subtree:true})}
  }
  new MutationObserver(detailSync).observe(pg,{attributes:true,attributeFilter:['hidden'],childList:true});
  addEventListener('hashchange',()=>setTimeout(detailSync,0));
  document.getElementById('stkc').onclick=()=>{const c=document.getElementById('ct');if(c)c.click()};
  document.getElementById('stkb').onclick=()=>{
    const t=document.getElementById('bkt'),f=document.getElementById('bfm');if(!t)return;
    if(!f.classList.contains('open'))t.click();else f.scrollIntoView({behavior:'smooth',block:'center'});
  };
  detailSync();
})();
