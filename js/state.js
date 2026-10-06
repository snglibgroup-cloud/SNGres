const hue=n=>[...n].reduce((a,c)=>a+c.charCodeAt(0),0)%360;
const bgc=(n,k=0)=>`linear-gradient(135deg,hsl(${(hue(n)+k*35)%360} 60% 78%),hsl(${(hue(n)+k*35+40)%360} 55% 64%))`;
const bg=(r,k=0)=>r[14]?`url('${r[14]}') center/cover no-repeat`:bgc(r[0],k);
const fmt=(a,b)=>a==b?a+' triệu':a+' - '+b+' triệu';
const dis=r=>r[10]?Math.round(r[6]*1000*(100-r[10])/100)/1000:r[6];
const TYPES=["Phòng trọ","Căn hộ","Ký túc xá","Mặt bằng"];
const CITIES=['Tp. Hồ Chí Minh','Tp. Cần Thơ','Tỉnh Bình Dương','Tp. Hà Nội','Tp. Đà Nẵng','Tỉnh Vĩnh Long','Tỉnh Thừa Thiên Huế','Tỉnh Long An','Tỉnh Tây Ninh','Tỉnh Trà Vinh','Tỉnh Đồng Tháp','Tỉnh Quảng Nam','Tỉnh Đồng Nai','Tỉnh Hậu Giang','Tỉnh Tiền Giang','Tỉnh Đắk Lắk','Tỉnh Kiên Giang','Tỉnh Bà Rịa - Vũng Tàu','Tỉnh An Giang'];
const dists=()=>[...new Set(R.filter(r=>!st.city||r[11]==st.city).map(r=>r[2]))].sort();
const inCity=r=>!st.city||r[11]==st.city;
const PR=[["≤ 2 triệu",0,2],["2 - 3 triệu",2,3],["3 - 4 triệu",3,4],["4 - 5 triệu",4,5],["5 - 6 triệu",5,6],["6 - 8 triệu",6,8],["8 - 12 triệu",8,12],["> 12 triệu",12,999]];
const AM=["Có máy lạnh","Không máy lạnh","Nuôi thú cưng","Có gác","Không gác","Có ban công","Có cửa sổ","Nhận xe điện","Giờ tự do"];
let st={city:"Tp. Hồ Chí Minh",tab:"Tất cả",dist:"",ward:"",house:"",addr:"",photo:"",hot:false,map:false,type:"",sort:"",q:"",cat:"Tất cả",pr:new Set(),am:new Set()},cart=new Set(),fav=new Set();
const store={get(k){try{return localStorage.getItem(k)}catch(_){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(_){}}};
{const c=store.get('nt_city');if(c!==null&&(c===''||CITIES.includes(c)))st.city=c;}

const wardOf=r=>(r[3].split(',').map(x=>x.trim()).find(p=>/^(P\.|Xã|Phường)/.test(p)))||'';
const scope=()=>R.filter(r=>inCity(r)&&(!st.dist||r[2]==st.dist));
