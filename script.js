/* script.js */

const app = document.getElementById('app');
const userArea = document.getElementById('user-area');
const toastEl = document.getElementById('toast');

const $ = id => document.getElementById(id);
const formatIDR = x => 'Rp ' + Number(x).toLocaleString('id-ID');
const nowYear = () => new Date().getFullYear();

function showToast(msg, time=2000){
  if(!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(()=> toastEl.classList.remove('show'), time);
}

function calcAge(dobStr){
  if(!dobStr) return 0;
  const b = new Date(dobStr);
  const n = new Date();
  let age = n.getFullYear() - b.getFullYear();
  const m = n.getMonth() - b.getMonth();
  if(m<0 || (m===0 && n.getDate()<b.getDate())) age--;
  return age;
}

/* Types & Products */
const TYPES = [
  { id:'family', title:'Keluarga', icon:'👪', image:'img/Keluarga.jpeg' },
  { id:'vehicle', title:'Kendaraan', icon:'🚗', image:'img/kendaraan.jpg' },
  { id:'health', title:'Kesehatan', icon:'🏥', image:'img/kesehatan.jpg' },
  { id:'life', title:'Kematian / Jiwa', icon:'⚰️', image:'img/jiwa.jpeg' },
  { id:'accident', title:'Kecelakaan', icon:'🤕', image:'img/kecelakaan.jpeg' },
  { id:'travel', title:'Perjalanan', icon:'✈️', image:'img/travel.jpg' },
  { id:'property', title:'Properti', icon:'🏠', image:'img/properti.jpg' },
  { id:'business', title:'Bisnis', icon:'🏢', image:'img/bisnis.jpg' },
];

const PRODUCTS = {
  family: [
    { id:'F1', type:'family', title:'FamilyCare Basic', short:'Perlindungan keluarga dasar (orang tua + anak)', price:1500000, image:'img/Keluarga.jpeg' },
    { id:'F2', type:'family', title:'FamilyCare Plus', short:'Perlindungan lebih luas untuk pasangan & anak', price:3000000, image:'img/Keluarga.jpeg' },
    { id:'F3', type:'family', title:'FamilyProtect Elite', short:'Perlindungan lengkap untuk keluarga besar', price:4500000, image:'img/Keluarga.jpeg' }
  ],
  vehicle: [
    { id:'V1', type:'vehicle', title:'Auto Basic', short:'Third-party & partial cover', price:0, image:'img/kendaraan.jpg' },
    { id:'V2', type:'vehicle', title:'Auto AllRisk', short:'All-risk untuk mobil pribadi', price:0, image:'img/kendaraan.jpg' },
    { id:'V3', type:'vehicle', title:'MotorSafe', short:'Perlindungan untuk motor', price:0, image:'img/kendaraan.jpg' }
  ],
  health: [
    { id:'H1', type:'health', title:'Health Silver', short:'Rawat inap dasar', price:2000000, image:'img/kesehatan.jpg' },
    { id:'H2', type:'health', title:'Health Gold', short:'Cakupan lebih luas + check-up', price:4000000, image:'img/kesehatan.jpg' },
    { id:'H3', type:'health', title:'Health Family', short:'Perlindungan keluarga untuk rawat inap', price:3500000, image:'img/kesehatan.jpg' }
  ],
  life: [
    { id:'L1', type:'life', title:'Life 1M', short:'Santunan 1.000.000.000', price:1000000000, image:'img/jiwa.jpeg' },
    { id:'L2', type:'life', title:'Life 3M', short:'Santunan 3.500.000.000', price:3500000000, image:'img/jiwa.jpeg' },
    { id:'L3', type:'life', title:'Life Term 2M', short:'Santunan 2.000.000.000', price:2000000000, image:'img/jiwa.jpeg' }
  ],
  accident: [
    { id:'A1', type:'accident', title:'Accident Basic', short:'Santunan kecelakaan harian & cacat', price:500000, image:'img/kecelakaan.jpeg' },
    { id:'A2', type:'accident', title:'Accident Plus', short:'Santunan kecelakaan & rawat inap', price:1200000, image:'img/kecelakaan.jpeg' },
    { id:'A3', type:'accident', title:'Accident Family', short:'Perlindungan kecelakaan untuk keluarga', price:900000, image:'img/kecelakaan.jpeg' }
  ],
  travel: [
    { id:'T1', type:'travel', title:'Travel Lite', short:'Perlindungan pembatalan & medis perjalanan', price:250000, image:'img/travel.jpg' },
    { id:'T2', type:'travel', title:'Travel Pro', short:'Perlindungan perjalanan internasional', price:450000, image:'img/travel.jpg' },
    { id:'T3', type:'travel', title:'Travel Family', short:'Perlindungan untuk keluarga saat bepergian', price:600000, image:'img/travel.jpg' }
  ],
  property: [
    { id:'P1', type:'property', title:'HomeSafe', short:'Perlindungan kebakaran & bencana', price:800000, image:'img/properti.jpg' },
    { id:'P2', type:'property', title:'Property Plus', short:'Tambahan perlindungan pencurian & liability', price:1500000, image:'img/properti.jpg' },
    { id:'P3', type:'property', title:'Property Elite', short:'Perlindungan lengkap untuk properti besar', price:2500000, image:'img/properti.jpg' }
  ],
  business: [
    { id:'B1', type:'business', title:'SME Protect', short:'Perlindungan aset & kewajiban bisnis kecil', price:2000000, image:'img/bisnis.jpg' },
    { id:'B2', type:'business', title:'Enterprise Shield', short:'Perlindungan lengkap untuk usaha menengah', price:5000000, image:'img/bisnis.jpg' },
    { id:'B3', type:'business', title:'Business Liability', short:'Perlindungan tanggung jawab hukum bisnis', price:3000000, image:'img/bisnis.jpg' }
  ]
};

/* Storage */
function getUsers(){ return JSON.parse(localStorage.getItem('users')||'[]'); }
function saveUsers(u){ localStorage.setItem('users', JSON.stringify(u)); }
function findUser(email){ if(!email) return null; return getUsers().find(u=>u.email.toLowerCase()===email.toLowerCase()); }
function addUser(u){ const arr=getUsers(); arr.push(u); saveUsers(arr); }
function setCurrent(u){ localStorage.setItem('currentUser', JSON.stringify(u)); renderNav(); }
function getCurrent(){ return JSON.parse(localStorage.getItem('currentUser')||'null'); }
function logout(){ localStorage.removeItem('currentUser'); renderNav(); routeTo('home'); }
function getOrders(){ return JSON.parse(localStorage.getItem('orders')||'[]'); }
function saveOrder(o){
  const arr = getOrders();
  arr.push(o);
  localStorage.setItem('orders', JSON.stringify(arr));
}

/* ensure  */
if(!findUser('demo@example.com')) addUser({email:'demo@example.com', password:'password123', name:'Demo User', phone:'081234567890'});

/* UI & Router */
function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function renderNav(){
  if(!userArea) return;
  const u = getCurrent();
  if(!u){
    userArea.innerHTML = `<button class="nav-link" onclick="routeTo('login')">Login</button> <button class="btn btn-primary" onclick="routeTo('signup')">Sign Up</button>`;
  } else {
    userArea.innerHTML = `<span class="muted" style="margin-right:8px">Hi, ${escapeHtml(u.name)}</span>
      <button class="btn btn-ghost" onclick="routeTo('history')">Histori</button>
      <button class="btn btn-ghost" onclick="logout()">Logout</button>`;
  }
}

function routeTo(view,param){ window.location.hash = `#${view}${param?'/'+param:''}`; const p=parseHash(); render(p.v,p.p); }
function parseHash(){ const raw=window.location.hash.replace('#','')||'home'; const [v,p]=raw.split('/'); return {v,p}; }
window.addEventListener('hashchange', ()=>{ const p=parseHash(); render(p.v,p.p); });

function render(view,param){
  switch(view){
    case 'login': return renderLogin();
    case 'signup': return renderSignup();
    case 'jiwa':renderAsuransiJiwa();break;
    case 'products': return renderProducts();
    case 'type': return renderType(param);
    case 'detail': return renderDetail(param);
    case 'buy': return renderBuy(param);
    case 'checkout': return renderCheckout();
    case 'history': return renderHistory();
    default: return renderHome();
  }
}

/* Views */

/* HOME */
function renderHome(){
  document.title = "Poly Insurance's";
  const user = getCurrent();
  const featured = [];
  for(let i=0;i<TYPES.length && featured.length<3;i++){
    const arr = PRODUCTS[TYPES[i].id] || [];
    if(arr.length>0) featured.push(arr[0]);
  }

  app.innerHTML = `
    <section class="home-hero" style="background: linear-gradient(135deg, #ff914d, #a64dff); color: #fff; padding:28px; border-radius:12px; display:flex;gap:18px;align-items:center;">
      <div style="flex:1">
        <h1 style="margin:0 0 8px 0">Lindungi Masa Depan Anda 🎉</h1>
        <p style="margin:0 0 12px 0;opacity:0.95">Poly Insurance’s menyediakan berbagai pilihan asuransi untuk keluarga, kendaraan, kesehatan, jiwa, dan lainnya.</p>
        ${!user ? `
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary" onclick="routeTo('signup')">Sign Up — Buat Akun</button>
          <button class="btn btn-ghost" onclick="routeTo('login')">Login</button>
        </div>` : `<div>Halo, <strong>${escapeHtml(user.name)}</strong>! Mulai jelajahi produk kami di bawah ini.</div>`}
        <div style="margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('products')">🌟 Lihat Semua Produk</button></div>
      </div>
      <div style="width:320px"><img src="asuransi.jpg" alt="Ilustrasi" style="width:100%;border-radius:8px;box-shadow:0 8px 20px rgba(0,0,0,0.18)"></div>
    </section>

    <section style="margin-top:18px">
      <h3>Produk Favorit</h3>
      <div class="grid">
        ${featured.map(p=>`
          <div class="card">
            <img src="${p.image||'img/default.png'}" alt="${p.title}" style="height:120px;object-fit:contain">
            <h3>${escapeHtml(p.title)}</h3>
            <div class="small">${escapeHtml(p.short)}</div>
            <div style="margin-top:8px"><strong>${p.price?formatIDR(p.price):'Harga berdasarkan input'}</strong></div>
            <div style="margin-top:8px">
              <button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Detail</button>
              <button class="btn btn-primary" onclick="routeTo('buy','${p.id}')">Beli</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:10px"><button class="btn btn-ghost" onclick="routeTo('products')">Tampilkan Semua Produk</button></div>
    </section>
  `;

  // small popups
  setTimeout(()=>{ showWelcomePopup(); showPromoPopup(); }, 200);
}

function showWelcomePopup(){
  if(!localStorage.getItem('welcomeShown')){
    const d = document.createElement('div');
    d.style.position='fixed';
    d.style.right='20px';
    d.style.bottom='20px';
    d.style.background='#fff';
    d.style.color='#0b3b3b';
    d.style.padding='12px';
    d.style.borderRadius='10px';
    d.style.boxShadow='0 8px 24px rgba(0,0,0,0.18)';
    d.style.zIndex = 10001;
    d.innerHTML = `<div style="font-weight:700;margin-bottom:6px">🎉 Selamat datang!</div>
                   <div style="margin-bottom:8px">Jelajahi produk asuransi kami.</div>
                   <div style="text-align:right"><button class="btn btn-primary" id="wp_ok">Tutup</button></div>`;
    document.body.appendChild(d);
    d.querySelector('#wp_ok').addEventListener('click', ()=> d.remove());
    localStorage.setItem('welcomeShown','1');
  }
}

function showPromoPopup(){
  const user = getCurrent();
  if(user && !sessionStorage.getItem('promoShown')){
    setTimeout(()=>{
      const p = document.createElement('div');
      p.style.position='fixed';
      p.style.left='20px';
      p.style.bottom='20px';
      p.style.background='#fff';
      p.style.color='#0b3b3b';
      p.style.padding='12px';
      p.style.borderRadius='10px';
      p.style.boxShadow='0 8px 24px rgba(0,0,0,0.18)';
      p.style.zIndex = 10001;
      p.innerHTML = `<div style="font-weight:700;margin-bottom:6px">✨ Promo Mingguan</div>
                     <div style="margin-bottom:8px">Diskon premi 10% untuk Asuransi Kesehatan kode <strong>HEALTH10</strong></div>
                     <div style="display:flex;gap:8px;justify-content:flex-end">
                       <button class="btn btn-ghost" id="promo_ok">Tutup</button>
                       <button class="btn btn-primary" id="promo_view">Lihat Produk</button>
                     </div>`;
      document.body.appendChild(p);
      p.querySelector('#promo_ok').addEventListener('click', ()=> p.remove());
      p.querySelector('#promo_view').addEventListener('click', ()=> { p.remove(); routeTo('type','health'); });
    }, 1200);
    sessionStorage.setItem('promoShown','1');
  }
}

function renderProducts(){
  document.title = "Poly Insurance's";
  app.innerHTML = `
    <section>
      <h2>Jenis Asuransi</h2>
      <p class="small">Pilih kategori untuk melihat produk di dalamnya.</p>
      <div class="grid">
        ${TYPES.map(t=>`
          <div class="card">
            <img src="${t.image}" alt="${t.title}" style="height:120px;object-fit:contain">
            <h3>${t.icon} ${t.title}</h3>
            <p class="small">${escapeHtml(t.title)}</p>
            <div style="margin-top:8px"><button class="btn btn-primary" onclick="routeTo('type','${t.id}')">Lihat Produk</button></div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderType(typeId){
  const type = TYPES.find(t=>t.id===typeId);
  if(!type) return routeTo('products');
  const prods = PRODUCTS[typeId] || [];
  document.title = "Poly Insurance's";
  app.innerHTML = `
    <section>
      <h2>${type.icon} ${type.title}</h2>
      <p class="small">Produk tersedia di kategori ini.</p>
      <div class="grid">
        ${prods.map(p=>`
          <div class="card">
            <img src="${p.image||'img/default.png'}" alt="${p.title}" style="height:120px;object-fit:contain">
            <h3>${escapeHtml(p.title)}</h3>
            <div class="small">${escapeHtml(p.short)}</div>
            <div style="margin-top:8px"><button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Detail</button>
            <button class="btn btn-primary" onclick="routeTo('buy','${p.id}')">Beli</button></div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('products')">Kembali</button></div>
    </section>
  `;
}

function findProductById(id){
  for(const k of Object.keys(PRODUCTS)){
    const f = PRODUCTS[k].find(p=>p.id===id);
    if(f) return f;
  }
  return null;
}

function renderDetail(id){
  const p = findProductById(id);
  if(!p) return routeTo('products');
  document.title = "Poly Insurance's";
  app.innerHTML = `
    <section class="card" style="max-width:900px;margin:0 auto">
      <div style="display:flex;gap:16px;align-items:flex-start">
        <img src="${p.image||'img/default.png'}" alt="${p.title}" style="width:200px;height:140px;object-fit:contain">
        <div style="flex:1">
          <h2>${escapeHtml(p.title)}</h2>
          <div class="small">${escapeHtml(p.short)}</div>
          <div style="margin-top:8px"><strong>Harga contoh: </strong> ${p.price?formatIDR(p.price):'Harga tergantung input'} </div>
          <p style="margin-top:12px">Gunakan tombol Beli untuk mengisi data sesuai jenis asuransi dan menghitung premi.</p>
          <div style="margin-top:12px">
            <button class="btn btn-primary" onclick="routeTo('buy','${p.id}')">Beli</button>
            <button class="btn btn-ghost" onclick="routeTo('type','${p.type}')">Kembali</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* checkout button */
function renderCheckoutAndAttach(premium, label, onCheckout){
  const uid = 'do_checkout_' + Date.now() + '_' + Math.floor(Math.random()*1000);
  const html = `<div class="card"><strong>Hasil Perhitungan</strong>
      <div class="small" style="margin-top:6px">${label}: <strong>${formatIDR(premium)}</strong></div>
      <div style="margin-top:8px"><button id="${uid}" class="btn btn-primary">Checkout</button></div>
    </div>`;
  return { html, uid, attach: () => {
    const btn = document.getElementById(uid);
    if(!btn) {
      setTimeout(()=> {
        const retry = document.getElementById(uid);
        if(retry) retry.addEventListener('click', onCheckout);
      }, 50);
      return;
    }
    btn.addEventListener('click', onCheckout);
  }};
}

/* BUY page  */
function renderBuy(id){
  const p = findProductById(id);
  if(!p) return routeTo('products');
  const user = getCurrent();
  if(!user){ showToast('Silakan login terlebih dahulu'); return routeTo('login'); }
  document.title = "Poly Insurance's";

  // FAMILY
  if(p.type === 'family'){
    app.innerHTML = `
      <section class="card" style="max-width:760px;margin:0 auto">
        <h2>Beli ${escapeHtml(p.title)}</h2>
        <div class="small">${escapeHtml(p.short)}</div><hr>
        <div class="field"><label>Nama tertanggung</label><input id="f_name" class="input" value="${escapeHtml(user.name)}"></div>
        <div class="field"><label>Jumlah anggota keluarga yang akan ditanggung</label><input id="f_count" type="number" class="input" value="3"></div>
        <div class="field"><label>Usia anak tertua (jika ada)</label><input id="f_oldest" type="number" class="input"></div>
        <div class="field"><label>Nilai pertanggungan total (Rp)</label><input id="f_sum" type="number" class="input" value="3000000"></div>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Batal</button>
        <button id="f_calc" class="btn btn-primary">Hitung Premi</button></div>
        <div id="f_result" style="margin-top:12px"></div>
      </section>
    `;
    document.getElementById('f_calc').addEventListener('click', ()=>{
      const name = $('f_name').value.trim();
      const count = Number($('f_count').value);
      const sum = Number($('f_sum').value);
      if(!name){ showToast('Nama wajib diisi'); return; }
      if(isNaN(count) || count <= 0){ showToast('Jumlah anggota harus angka > 0'); return; }
      if(isNaN(sum) || sum <= 0){ showToast('Nilai pertanggungan harus angka > 0'); return; }

      const base = 500000;
      const premi = Math.round(base + (count-1)*0.5*base + (sum/1000000)*10000);

      const pending = { id:'ORD'+Date.now(), productId:p.id, productTitle:p.title, type:p.type, date:new Date().toISOString(), premium:premi, buyer:user.email, status:'Belum Lunas' };
      sessionStorage.setItem('pendingOrder', JSON.stringify(pending));
      routeTo('checkout');
      return;
    });
    return;
  }

  // VEHICLE
  if(p.type === 'vehicle'){
    app.innerHTML = `
      <section class="card" style="max-width:760px;margin:0 auto">
        <h2>Beli ${escapeHtml(p.title)}</h2>
        <div class="small">${escapeHtml(p.short)}</div><hr>
        <div class="field"><label>Merk</label><input id="veh_brand" class="input"></div>
        <div class="field"><label>Model</label><input id="veh_model" class="input"></div>
        <div class="field"><label>Tahun pembuatan</label><input id="veh_year" type="number" class="input" placeholder="2019"></div>
        <div class="field"><label>Harga kendaraan (Rp)</label><input id="veh_price" type="number" class="input"></div>
        <div class="field"><label>Nomor plat</label><input id="veh_plate" class="input"></div>
        <div class="field"><label>Nomor mesin</label><input id="veh_machine" class="input"></div>
        <div class="field"><label>Nomor rangka</label><input id="veh_chassis" class="input"></div>
        <div class="field"><label>Nama pemilik</label><input id="veh_owner" class="input" value="${escapeHtml(user.name)}"></div>
        <div class="field"><label>Upload foto (depan, belakang, kiri, kanan, dashboard, mesin)</label><input id="veh_photos" type="file" accept="image/*" multiple class="input"></div>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Batal</button>
        <button id="veh_calc" class="btn btn-primary">Hitung Premi</button></div>
        <div id="veh_result" style="margin-top:12px"></div>
      </section>
    `;
    document.getElementById('veh_calc').addEventListener('click', ()=>{
      const brand = $('veh_brand').value.trim();
      const model = $('veh_model').value.trim();
      const year = parseInt($('veh_year').value);
      const price = Number($('veh_price').value);
      const plate = $('veh_plate').value.trim();
      const machine = $('veh_machine').value.trim();
      const chassis = $('veh_chassis').value.trim();
      const owner = $('veh_owner').value.trim();
      const photos = $('veh_photos').files;
      if(!brand||!model||!year||!price||!plate||!machine||!chassis||!owner){ showToast('Lengkapi semua field'); return; }
      if(isNaN(year) || isNaN(price)){ showToast('Tahun dan harga harus angka yang valid'); return; }
      if(!photos || photos.length < 6){ showToast('Upload minimal 6 foto'); return; }
      const age = nowYear() - year;
      let premiPerYear = 0;
      if(age >=0 && age <=3) premiPerYear = 0.025 * price;
      else if(age >3 && age <=5){
        if(price < 200000000) premiPerYear = 0.04 * price;
        else premiPerYear = 0.03 * price;
      } else if(age > 5) premiPerYear = 0.05 * price;
      premiPerYear = Math.round(premiPerYear);

      const pending = { id:'ORD'+Date.now(), productId:p.id, productTitle:p.title+' - '+brand+' '+model, type:p.type, date:new Date().toISOString(), premium:premiPerYear, buyer:user.email, status:'Belum Lunas' };
      sessionStorage.setItem('pendingOrder', JSON.stringify(pending));
      routeTo('checkout');
      return;
    });
    return;
  }

  // HEALTH
  if(p.type === 'health'){
    app.innerHTML = `
      <section class="card" style="max-width:760px;margin:0 auto">
        <h2>Beli ${escapeHtml(p.title)}</h2>
        <div class="small">${escapeHtml(p.short)}</div><hr>
        <div class="field"><label>Nama lengkap (KTP)</label><input id="hl_name" class="input" value="${escapeHtml(user.name)}"></div>
        <div class="field"><label>Tanggal lahir</label><input id="hl_dob" type="date" class="input"></div>
        <div class="field"><label>Pekerjaan</label><input id="hl_job" class="input"></div>
        <div class="field"><label>Merokok?</label><select id="hl_smoke" class="input"><option value="0">Tidak</option><option value="1">Ya</option></select></div>
        <div class="field"><label>Riwayat hipertensi?</label><select id="hl_hyper" class="input"><option value="0">Tidak</option><option value="1">Ya</option></select></div>
        <div class="field"><label>Diabetes?</label><select id="hl_diab" class="input"><option value="0">Tidak</option><option value="1">Ya</option></select></div>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Batal</button>
        <button id="hl_calc" class="btn btn-primary">Hitung Premi</button></div>
        <div id="hl_result" style="margin-top:12px"></div>
      </section>
    `;
    document.getElementById('hl_calc').addEventListener('click', ()=>{
      const name = $('hl_name').value.trim();
      const dob = $('hl_dob').value;
      const job = $('hl_job').value.trim();
      const k1 = Number($('hl_smoke').value);
      const k2 = Number($('hl_hyper').value);
      const k3 = Number($('hl_diab').value);
      if(!name||!dob||!job){ showToast('Lengkapi semua field'); return; }
      const u = calcAge(dob);
      let m = 0.1;
      if(u <= 20) m = 0.1;
      else if(u <= 35) m = 0.2;
      else if(u <= 50) m = 0.25;
      else m = 0.4;
      const P = 2000000;
      const premi = Math.round(P + (m*P) + (k1*0.5*P) + (k2*0.4*P) + (k3*0.5*P));

      const pending = { id:'ORD'+Date.now(), productId:p.id, productTitle:p.title, type:p.type, date:new Date().toISOString(), premium:premi, buyer:user.email, status:'Belum Lunas' };
      sessionStorage.setItem('pendingOrder', JSON.stringify(pending));
      routeTo('checkout');
      return;
    });
    return;
  }

  // LIFE
if(p.type === 'life'){
  app.innerHTML = `
    <section class="card" style="max-width:760px;margin:0 auto">
      <h2>Beli ${escapeHtml(p.title)}</h2>
      <div class="small">${escapeHtml(p.short)}</div><hr>
      <div class="field"><label>Nama lengkap (KTP)</label><input id="li_name" class="input" value="${escapeHtml(user.name)}"></div>
      <div class="field"><label>Tanggal lahir</label><input id="li_dob" type="date" class="input"></div>
      <div class="field"><label>Besaran pertanggungan</label>
        <select id="li_sum" class="input">
          <option value="1000000000">Rp1.000.000.000</option>
          <option value="2000000000">Rp2.000.000.000</option>
          <option value="3500000000">Rp3.500.000.000</option>
          <option value="5000000000">Rp5.000.000.000</option>
          <option value="10000000000">Rp10.000.000.000</option>
        </select>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Batal</button>
        <button id="li_calc" class="btn btn-primary">Hitung Premi</button>
      </div>
      <div id="li_result" style="margin-top:12px"></div>
    </section>
  `;
  document.getElementById('li_calc').addEventListener('click', ()=>{
    const name = $('li_name').value.trim();
    const dob = $('li_dob').value;
    const t = Number($('li_sum').value);
    if(!name||!dob){ showToast('Lengkapi semua field'); return; }
    const u = calcAge(dob);
    let m = 0.002;
    if(u <= 30) m = 0.002;
    else if(u <= 50) m = 0.004;
    else m = 0.01;
    const premiPerMonth = Math.round(m * t);

    const pending = { id:'ORD'+Date.now(), productId:p.id, productTitle:p.title, type:p.type, date:new Date().toISOString(), premium:premiPerMonth, premiumPeriod:'Per bulan', buyer:user.email, status:'Belum Lunas' };
    sessionStorage.setItem('pendingOrder', JSON.stringify(pending));
    routeTo('checkout');
    return;
  });
  return;
}

  // ACCIDENT
  if(p.type === 'accident'){
    app.innerHTML = `
      <section class="card" style="max-width:760px;margin:0 auto">
        <h2>Beli ${escapeHtml(p.title)}</h2><div class="small">${escapeHtml(p.short)}</div><hr>
        <div class="field"><label>Nama</label><input id="a_name" class="input" value="${escapeHtml(user.name)}"></div>
        <div class="field"><label>Usia</label><input id="a_age" type="number" class="input"></div>
        <div class="field"><label>Pekerjaan</label><input id="a_job" class="input"></div>
        <div class="field"><label>Nilai santunan cacat (Rp)</label><input id="a_sum" type="number" class="input" value="10000000"></div>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Batal</button>
        <button id="a_calc" class="btn btn-primary">Hitung Premi</button></div>
        <div id="a_result" style="margin-top:12px"></div>
      </section>
    `;
    document.getElementById('a_calc').addEventListener('click', ()=>{
      const name = $('a_name').value.trim();
      const age = Number($('a_age').value);
      const sum = Number($('a_sum').value);
      if(!name){ showToast('Nama wajib diisi'); return; }
      if(isNaN(age) || isNaN(sum)){ showToast('Usia dan nilai santunan harus angka valid'); return; }
      let rate = 0.005;
      if(age < 25) rate = 0.003;
      else if(age <= 45) rate = 0.005;
      else rate = 0.01;
      const premi = Math.round(rate * sum);

      const pending = { id:'ORD'+Date.now(), productId:p.id, productTitle:p.title, type:p.type, date:new Date().toISOString(), premium:premi, buyer:user.email, status:'Belum Lunas' };
      sessionStorage.setItem('pendingOrder', JSON.stringify(pending));
      routeTo('checkout');
      return;
    });
    return;
  }

  // TRAVEL
  if(p.type === 'travel'){
    app.innerHTML = `
      <section class="card" style="max-width:760px;margin:0 auto">
        <h2>Beli ${escapeHtml(p.title)}</h2><div class="small">${escapeHtml(p.short)}</div><hr>
        <div class="field"><label>Nama</label><input id="t_name" class="input" value="${escapeHtml(user.name)}"></div>
        <div class="field"><label>Tujuan</label><input id="t_dest" class="input"></div>
        <div class="field"><label>Lama perjalanan (hari)</label><input id="t_days" type="number" class="input" value="7"></div>
        <div class="field"><label>Biaya perjalanan (Rp)</label><input id="t_cost" type="number" class="input" value="5000000"></div>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Batal</button>
        <button id="t_calc" class="btn btn-primary">Hitung Premi</button></div>
        <div id="t_result" style="margin-top:12px"></div>
      </section>
    `;
    document.getElementById('t_calc').addEventListener('click', ()=>{
      const name = $('t_name').value.trim();
      const days = Number($('t_days').value);
      const cost = Number($('t_cost').value);
      if(!name || isNaN(days) || days<=0){ showToast('Lengkapi semua field (hari harus > 0)'); return; }
      if(isNaN(cost) || cost < 0){ showToast('Biaya perjalanan harus angka >= 0'); return; }
      const premi = Math.round(days * 10000 + 0.001 * cost);

      const pending = { id:'ORD'+Date.now(), productId:p.id, productTitle:p.title + ' - ' + $('t_dest').value, type:p.type, date:new Date().toISOString(), premium:premi, buyer:user.email, status:'Belum Lunas' };
      sessionStorage.setItem('pendingOrder', JSON.stringify(pending));
      routeTo('checkout');
      return;
    });
    return;
  }

  // PROPERTY
  if(p.type === 'property'){
    app.innerHTML = `
      <section class="card" style="max-width:760px;margin:0 auto">
        <h2>Beli ${escapeHtml(p.title)}</h2><div class="small">${escapeHtml(p.short)}</div><hr>
        <div class="field"><label>Nama pemilik</label><input id="pr_owner" class="input" value="${escapeHtml(user.name)}"></div>
        <div class="field"><label>Alamat properti</label><input id="pr_addr" class="input"></div>
        <div class="field"><label>Tahun bangunan</label><input id="pr_year" type="number" class="input"></div>
        <div class="field"><label>Nilai pertanggungan (Rp)</label><input id="pr_sum" type="number" class="input" value="500000000"></div>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Batal</button>
        <button id="pr_calc" class="btn btn-primary">Hitung Premi</button></div>
        <div id="pr_result" style="margin-top:12px"></div>
      </section>
    `;
    document.getElementById('pr_calc').addEventListener('click', ()=>{
      const owner = $('pr_owner').value.trim();
      const addr = $('pr_addr').value.trim();
      const year = Number($('pr_year').value);
      const sum = Number($('pr_sum').value);
      if(!owner||!addr){ showToast('Lengkapi semua field'); return; }
      if(isNaN(year) || isNaN(sum) || sum<=0){ showToast('Tahun dan nilai pertanggungan harus valid'); return; }
      const age = nowYear() - year;
      let rate = (age <=10)?0.0015:0.0025;
      const premi = Math.round(rate * sum);

      const pending = { id:'ORD'+Date.now(), productId:p.id, productTitle:p.title, type:p.type, date:new Date().toISOString(), premium:premi, buyer:user.email, status:'Belum Lunas' };
      sessionStorage.setItem('pendingOrder', JSON.stringify(pending));
      routeTo('checkout');
      return;
    });
    return;
  }

  // BUSINESS
  if(p.type === 'business'){
    app.innerHTML = `
      <section class="card" style="max-width:760px;margin:0 auto">
        <h2>Beli ${escapeHtml(p.title)}</h2><div class="small">${escapeHtml(p.short)}</div><hr>
        <div class="field"><label>Nama pemilik / perusahaan</label><input id="b_owner" class="input" value="${escapeHtml(user.name)}"></div>
        <div class="field"><label>Jenis usaha</label><input id="b_type" class="input"></div>
        <div class="field"><label>Omzet tahunan (Rp)</label><input id="b_turn" type="number" class="input"></div>
        <div class="field"><label>Nilai aset (Rp)</label><input id="b_asset" type="number" class="input"></div>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Batal</button>
        <button id="b_calc" class="btn btn-primary">Hitung Premi</button></div>
        <div id="b_result" style="margin-top:12px"></div>
      </section>
    `;
    document.getElementById('b_calc').addEventListener('click', ()=>{
      const owner = $('b_owner').value.trim();
      const type = $('b_type').value.trim();
      const turn = Number($('b_turn').value);
      const asset = Number($('b_asset').value);
      if(!owner||!type){ showToast('Lengkapi semua field'); return; }
      if(isNaN(turn) || isNaN(asset)){ showToast('Omzet dan aset harus angka'); return; }
      const premi = Math.round(0.002 * asset + 0.0005 * turn);

      const pending = { id:'ORD'+Date.now(), productId:p.id, productTitle:p.title, type:p.type, date:new Date().toISOString(), premium:premi, buyer:user.email, status:'Belum Lunas' };
      sessionStorage.setItem('pendingOrder', JSON.stringify(pending));
      routeTo('checkout');
      return;
    });
    return;
  }

  // fallback generic buy
  app.innerHTML = `
    <section class="card" style="max-width:560px;margin:0 auto">
      <h2>Beli ${escapeHtml(p.title)}</h2>
      <div class="small">${escapeHtml(p.short)}</div>
      <div style="margin-top:12px">
        <label>Nama</label><input id="buy-name" class="input" value="${escapeHtml(user.name)}">
        <label>Nomor HP</label><input id="buy-phone" class="input" value="${escapeHtml(user.phone||'')}">
      </div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('detail','${p.id}')">Batal</button>
      <button id="btn-confirm-buy" class="btn btn-primary">Checkout</button></div>
    </section>
  `;
  document.getElementById('btn-confirm-buy').addEventListener('click', ()=> {
    const name = $('buy-name')?.value?.trim(); const phone = $('buy-phone')?.value?.trim();
    if(!name||!phone){ showToast('Lengkapi nama dan nomor HP'); return; }
    const idOrder = 'ORD'+Date.now();
    const order = { id:idOrder, productId:p.id, productTitle:p.title, type:p.type, date:new Date().toISOString(), premium:p.price||0, buyer:getCurrent().email, status:'Lunas' };
    saveOrder(order);
    showToast('Pembelian berhasil'); setTimeout(()=> routeTo('history'),400);
  });
}

/* Checkout page */
function renderCheckout(){
  const pending = sessionStorage.getItem('pendingOrder');
  if(!pending){
    showToast('Tidak ada order yang menunggu checkout');
    return routeTo('products');
  }
  const order = JSON.parse(pending);
  const user = getCurrent();
  if(!user){ showToast('Silakan login'); return routeTo('login'); }
  document.title = "Poly Insurance's";
  app.innerHTML = `
    <section class="card" style="max-width:760px;margin:0 auto">
      <h2>Checkout</h2>
      <div class="small">Produk: <strong>${escapeHtml(order.productTitle)}</strong></div>
      <div class="small">Tipe: ${escapeHtml(order.type || '')}</div>
      <div class="small">Jumlah yang harus dibayar: <strong>${formatIDR(order.premium||0)}</strong></div>
      <hr>
      <div class="field"><label>Pilih Metode Pembayaran</label>
        <select id="pay_method" class="input">
          <option value="transfer">Transfer Bank</option>
          <option value="gopay">GoPay</option>
          <option value="ovo">OVO</option>
        </select>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-ghost" onclick="routeTo('detail','${order.productId}')">Batal</button>
        <button id="do_pay" class="btn btn-primary">Bayar Sekarang</button>
      </div>
    </section>
  `;

  document.getElementById('do_pay').addEventListener('click', ()=>{
    const method = document.getElementById('pay_method').value;
    order.status = 'Lunas';
    order.paidBy = method;
    order.date = new Date().toISOString();
    saveOrder(order);
    sessionStorage.removeItem('pendingOrder');
    showToast('Pembayaran berhasil ');
    setTimeout(()=> routeTo('history'), 500);
  });
}

/* History*/
function renderHistory(){
  const user = getCurrent();
  if(!user){ showToast('Silakan login'); return routeTo('login'); }
  const orders = getOrders().filter(o => o.buyer === user.email);
  document.title = "Poly Insurance's";

  if(orders.length === 0){
    app.innerHTML = `
      <section>
        <h2>Histori Pembelian</h2>
        <div class="small">Belum ada histori pembelian.</div>
        <div style="margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('products')">Kembali ke Produk</button></div>
      </section>
    `;
    return;
  }

  // build table rows
  const rows = orders.map(o => {
    const dateStr = new Date(o.date).toLocaleString();
    const price = formatIDR(o.premium || 0);
    const status = escapeHtml(o.status || 'Belum Lunas');
    const type = escapeHtml(o.type || '');
    const title = escapeHtml(o.productTitle || o.productName || '');
    return `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${title}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${type}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${dateStr}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${price}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${status}</td>
    </tr>`;
  }).join('');

  app.innerHTML = `
    <section>
      <h2>Histori Pembelian</h2>
      <div class="small">Menampilkan semua pembelian Anda.</div>
      <div style="margin-top:12px; overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="text-align:left;padding:8px">Nama Produk</th>
              <th style="text-align:left;padding:8px">Jenis</th>
              <th style="text-align:left;padding:8px">Tanggal Pembelian</th>
              <th style="text-align:left;padding:8px">Harga</th>
              <th style="text-align:left;padding:8px">Status Pembayaran</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      <div style="margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('products')">Kembali ke Produk</button></div>
    </section>
  `;
}

/* Auth views */
function renderLogin(){
  document.title = "Poly Insurance's";
  app.innerHTML = `
    <section class="card" style="max-width:420px;margin:0 auto">
      <h2>Login</h2>
      <div class="field"><label>Email</label><input id="login-email" class="input" placeholder="email@contoh.com"></div>
      <div class="field"><label>Password</label><input id="login-pass" type="password" class="input"></div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('home')">Batal</button>
      <button id="doLogin" class="btn btn-primary">Masuk</button></div>
      <div style="margin-top:8px"><a href="#signup">Belum punya akun? Daftar</a></div>
    </section>
  `;
  document.getElementById('doLogin').addEventListener('click', doLogin);
}
function doLogin(){
  const email = $('login-email').value.trim(), pass = $('login-pass').value;
  if(!email || !pass){ showToast('Email dan password harus diisi'); return; }
  const em = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!em.test(email)){ showToast('Format email tidak valid'); return; }
  const u = findUser(email);
  if(!u || u.password !== pass){ showToast('Email atau password salah'); return; }
  setCurrent({ email:u.email, name:u.name, phone:u.phone });
  showToast('Login berhasil'); setTimeout(()=> routeTo('home'), 300);
}

function renderSignup(){
  document.title = "Poly Insurance's";
  app.innerHTML = `
    <section class="card" style="max-width:560px;margin:0 auto">
      <h2>Daftar Akun</h2>
      <div class="field"><label>Nama Lengkap</label><input id="su_name" class="input" placeholder="Nama sesuai KTP"></div>
      <div class="field"><label>Email</label><input id="su_email" class="input" placeholder="email@contoh.com"></div>
      <div class="field"><label>Nomor HP</label><input id="su_phone" class="input" placeholder="08xxxxxxxxxx"></div>
      <div class="field"><label>Password</label><input id="su_pass" type="password" class="input"></div>
      <div class="field"><label>Konfirmasi Password</label><input id="su_pass2" type="password" class="input"></div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-ghost" onclick="routeTo('home')">Batal</button>
      <button class="btn btn-primary" id="doSignup">Daftar</button></div>
      <div id="su_msg" class="small" style="margin-top:8px;color:crimson"></div>
    </section>
  `;
  document.getElementById('doSignup').addEventListener('click', ()=>{
    const name = document.getElementById('su_name').value.trim();
    const email = document.getElementById('su_email').value.trim();
    const phone = document.getElementById('su_phone').value.trim();
    const pass = document.getElementById('su_pass').value;
    const pass2 = document.getElementById('su_pass2').value;
    const msgEl = document.getElementById('su_msg');
    msgEl.textContent = '';
    if(!email || !pass || !name || !phone){ msgEl.textContent = 'Email, password, nama, dan nomor handphone wajib diisi.'; return; }
    const em = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!em.test(email)){ msgEl.textContent = 'Format email tidak valid.'; return; }
    if(pass.length < 8){ msgEl.textContent = 'Password minimal 8 karakter.'; return; }
    if(pass !== pass2){ msgEl.textContent = 'Password dan konfirmasi tidak sama.'; return; }
    if(name.length < 3 || name.length > 32 || /[0-9]/.test(name)){ msgEl.textContent = 'Nama harus 3-32 karakter dan tidak boleh mengandung angka.'; return; }
    if(!/^08\d{8,14}$/.test(phone)){ msgEl.textContent = 'Nomor HP harus diawali 08, hanya angka, panjang 10-16 digit.'; return; }
    if(findUser(email)){ msgEl.textContent = 'Email sudah terdaftar.'; return; }
    addUser({email, password:pass, name, phone});
    setCurrent({email, name, phone});
    showToast('Pendaftaran berhasil!');
    setTimeout(()=> routeTo('home'), 500);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderNav();
  const {v,p} = parseHash();
  render(v,p);
});
