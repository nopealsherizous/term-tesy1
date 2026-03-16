/* ══════════════════════════════════════════
   APP.JS — Main entry point
   THPT Cẩm Bình · 2025
═══════════════════════════════════════════ */
import { store } from './core/store.js';
import { route, initRouter, navigate as _navigate } from './core/router.js';
import { buildIndex, stripDiacritics, isNumQuery } from './utils/search.js';
import {
  renderAll, renderTable, renderCards, renderClasses, renderStats as _renderStats,
  syncLopSel, updateChips, updateBanner, updateQuickStats,
  showSuggestions, hideSuggestions, getBdBadge,
  getFiltered, getSorted, getDateFilter
} from './pages/students.js';
import { showDetail, showSoulModal, closeSoulModal, findSoulMateAgain, printStudent } from './pages/student-detail.js';
import { renderHome } from './pages/home.js';
import { renderBirthdays } from './pages/birthdays.js';
import { renderNews, renderNewsDetail, renderSubmit, handleSubmitArticle } from './pages/news.js';

const $ = id => document.getElementById(id);

/* ══ Theme ════════════════════════════════ */
function initTheme() {
  try {
    if (localStorage.getItem('thpt-theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      const btn = $('dmBtn');
      if (btn) btn.innerHTML = '☀️ <span>Light</span>';
    }
  } catch(e) {}
}

function toggleDark() {
  const html = document.documentElement;
  const dark = html.getAttribute('data-theme') !== 'dark';
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  $('dmBtn').innerHTML = dark ? '☀️ <span>Light</span>' : '🌙 <span>Dark</span>';
  try { localStorage.setItem('thpt-theme', dark ? 'dark' : 'light'); } catch(e) {}
  const btn = $('dmBtn'); if (btn) btn.classList.add('xs');
  setTimeout(() => { if(btn) btn.classList.remove('xs'); }, 400);
}

/* ══ Toast ════════════════════════════════ */
function toast(msg) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('on'), 2700);
}

/* ══ Clipboard ════════════════════════════ */
function cp(txt) {
  navigator.clipboard.writeText(txt).then(() => toast('📋 Đã copy: ' + txt));
}

/* ══ Ripple effect ════════════════════════ */
function addRipple(e) {
  const btn = e.currentTarget;
  const r   = document.createElement('div');
  r.className = 'xrpl';
  const rect = btn.getBoundingClientRect();
  r.style.left = (e.clientX - rect.left) + 'px';
  r.style.top  = (e.clientY - rect.top) + 'px';
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
}

/* ══ Count animation ══════════════════════ */
function animCount(id, target) {
  const el = $(id); if (!el) return;
  const dur=800, steps=35; let i=0;
  const iv = setInterval(() => {
    i++; el.textContent = Math.round(target*(i/steps)).toLocaleString('vi');
    if (i>=steps) { el.textContent=target.toLocaleString('vi'); clearInterval(iv); }
  }, dur/steps);
}

/* ══ View switching ═══════════════════════ */
const STUDENT_VIEWS = new Set(['viewTable','viewCard','viewClass','viewStats']);

function showOnlyView(name) {
  const views = ['viewHome','viewTable','viewCard','viewClass','viewStats','viewBirthdays','viewNews','viewNewsDetail','viewSubmit'];
  views.forEach(v => { const el=$(v); if(el) el.style.display=(v===name)?'':'none'; });
  // Toolbar visible only on student views
  const tb = $('toolbar');
  if (tb) tb.style.display = STUDENT_VIEWS.has(name) ? '' : 'none';
  // Search/filter bar visible on student views
  const sb = $('searchBar');
  if (sb) sb.style.display = STUDENT_VIEWS.has(name) ? '' : 'none';
  const dsb = $('dateSearchBar');
  if (dsb) dsb.style.display = STUDENT_VIEWS.has(name) ? '' : 'none';
  // Density controls only for table
  const dc = $('densityCtrl');
  const dl = $('densityLabel');
  if (dc) dc.style.display = (name==='viewTable') ? '' : 'none';
  if (dl) dl.style.display = (name==='viewTable') ? '' : 'none';
}

function setTab(t, btn) {
  store.tab = t; store.page = 1;
  // Sync view tab buttons (inside toolbar)
  ['table','card','class','stats'].forEach(n => {
    const b = $('vtTab-' + n); if (b) b.classList.toggle('on', n === t);
  });
  showOnlyView('view' + t.charAt(0).toUpperCase() + t.slice(1));
  renderAll();
}

/* ══ Navigation helpers ═══════════════════ */
function navigate(path) { _navigate(path); }

function go(p) {
  const pp  = parseInt(($('PP')&&$('PP').value)||'50');
  const tp  = Math.max(1, Math.ceil(store.filtered.length / pp));
  store.page = Math.max(1, Math.min(p, tp));
  renderAll();
  const sc = $('tblScroll'); if (sc) sc.scrollTop = 0;
  const cs = document.querySelector('.card-scroll'); if (cs) cs.scrollTop = 0;
}

function goLop(lop) {
  const fk = $('FK'); if(fk){ fk.value = lop.substring(0,2); syncLopSel(); }
  const fl = $('FL'); if(fl) fl.value = lop;
  store.page = 1;
  navigate('/students');
  const t0 = document.querySelectorAll('.tab')[0];
  setTab('table', t0);
  renderAll(); updateChips();
}

/* ══ Search helpers ═══════════════════════ */
function clearSearch() {
  const si = $('SI'); if(si){ si.value=''; si.focus(); }
  const sc = $('SC'); if(sc) sc.classList.remove('on');
  const sp = $('smPill'); if(sp) sp.classList.remove('on');
  const sb = $('searchBanner'); if(sb) sb.classList.remove('on');
  hideSuggestions();
  store.page = 1; renderAll(); updateChips();
}

function selectSuggestion(name) {
  const si = $('SI'); if(si) si.value = name;
  const sc = $('SC'); if(sc) sc.classList.add('on');
  const sp = $('smPill'); if(sp) sp.classList.toggle('on', !isNumQuery(stripDiacritics(name)));
  hideSuggestions();
  store.page = 1; renderAll(); updateChips(); updateBanner();
}

function clearKhoi()     { const fk=$('FK');if(fk)fk.value=''; syncLopSel(); store.page=1; renderAll(); updateChips(); updateBanner(); }
function clearLop()      { const fl=$('FL');if(fl)fl.value=''; store.page=1; renderAll(); updateChips(); }
function clearGioiTinh() { const fg=$('FG');if(fg)fg.value=''; store.page=1; renderAll(); updateChips(); }
function clearDateSearch(){ ['DSDay','DSMon','DSYear'].forEach(id=>{const e=$(id);if(e)e.value='';}); store.page=1; renderAll(); updateChips(); }
function onDateSearch()  { store.page=1; renderAll(); updateChips(); }

function resetAll() {
  const si=$('SI');if(si)si.value='';
  const fk=$('FK');if(fk)fk.value='';
  const fg=$('FG');if(fg)fg.value='';
  ['DSDay','DSMon','DSYear'].forEach(id=>{const e=$(id);if(e)e.value='';});
  const sc=$('SC');if(sc)sc.classList.remove('on');
  const sp=$('smPill');if(sp)sp.classList.remove('on');
  const sb=$('searchBanner');if(sb)sb.classList.remove('on');
  hideSuggestions(); syncLopSel();
  const fl=$('FL');if(fl)fl.value='';
  store.page=1; renderAll(); updateChips(); toast('✓ Đã đặt lại tất cả bộ lọc');
}

function sortBy(field) {
  if (store.sField===field) store.sDir*=-1; else { store.sField=field; store.sDir=1; }
  const sb=$('SB'); if(sb) sb.value=field;
  document.querySelectorAll('thead th').forEach(th=>{
    th.classList.remove('sorted');
    const a=th.querySelector('.sarr');if(a)a.textContent='↕';
  });
  const th=document.querySelector(`thead th[data-col="${field}"]`);
  if(th){th.classList.add('sorted');const a=th.querySelector('.sarr');if(a)a.textContent=store.sDir===1?'↑':'↓';}
  store.filtered=getSorted(getFiltered());
  const rawQ=($('SI')&&$('SI').value.trim())||'';
  const normQ=stripDiacritics(rawQ);
  const rc=$('RC');
  if(rc){
    let html=`Hiển thị <strong>${store.filtered.length.toLocaleString('vi')}</strong> / ${store.ALL.length.toLocaleString('vi')} học sinh`;
    if(rawQ) html+=` <span class="tb-mode-tag">🔍 ${isNumQuery(normQ)?'CCCD/SĐT':'tên'}: "${rawQ}"</span>`;
    rc.innerHTML=html;
  }
  if(store.tab==='table') renderTable(); else if(store.tab==='card') renderCards();
}

function setDensity(v) {
  store.density=v;
  const d=$('dtD');if(d)d.classList.toggle('on',v==='dense');
  const l=$('dtL');if(l)l.classList.toggle('on',v==='loose');
  if(store.tab==='table') renderTable();
}

function closeModal() { const ov=$('OV'); if(ov) ov.classList.remove('on'); }

function quickFilter(type) {
  const now=new Date();
  const dd=String(now.getDate()).padStart(2,'0');
  const mm=String(now.getMonth()+1).padStart(2,'0');
  if(type==='birthday'){
    const d=$('DSDay'),m=$('DSMon'),y=$('DSYear');
    if(d)d.value=parseInt(dd);if(m)m.value=parseInt(mm);if(y)y.value='';
    store.page=1;renderAll();updateChips();
  } else if(type==='k10'){const fk=$('FK');if(fk)fk.value='10';syncLopSel();store.page=1;renderAll();updateChips();updateBanner();}
  else if(type==='k11'){const fk=$('FK');if(fk)fk.value='11';syncLopSel();store.page=1;renderAll();updateChips();updateBanner();}
  else if(type==='k12'){const fk=$('FK');if(fk)fk.value='12';syncLopSel();store.page=1;renderAll();updateChips();updateBanner();}
  else if(type==='nam'){const fg=$('FG');if(fg)fg.value='Nam';store.page=1;renderAll();updateChips();updateBanner();}
  else if(type==='nu') {const fg=$('FG');if(fg)fg.value='Nữ';store.page=1;renderAll();updateChips();updateBanner();}
}

function switchMTab(name, btn) {
  document.querySelectorAll('.modal-tab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.modal-pane').forEach(p=>p.classList.remove('on'));
  if(btn) btn.classList.add('on');
  const pane=$('mPane-'+name);if(pane)pane.classList.add('on');
}

function scrollToTop() {
  const ts=$('tblScroll'),cs=document.querySelector('.card-scroll');
  if(ts)ts.scrollTop=0;if(cs)cs.scrollTop=0;
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ══ Skeleton ═════════════════════════════ */
function buildSkeleton() {
  const el=$('skRows'); if(!el) return;
  el.innerHTML=Array.from({length:14},(_,i)=>`<div class="sk-row" style="animation-delay:${i*.04}s"><div class="sk sk-n"></div><div class="sk sk-nm" style="width:${140+(i%5)*26}px"></div><div class="sk sk-dt"></div><div class="sk sk-ba" style="width:44px"></div><div class="sk sk-ba" style="width:54px"></div><div class="sk sk-ad" style="max-width:${110+(i%3)*36}px"></div></div>`).join('');
}

/* ══ BOOT ═════════════════════════════════ */
async function boot() {
  buildSkeleton();
  try {
    // Load students (public data)
    const r = await fetch('/data/public/students-public.json');
    if (!r.ok) throw new Error('Cannot load students');
    const j = await r.json();
    store.ALL  = j.hocSinh || [];
    store.meta = j.meta;
    store.ALL.forEach(buildIndex);

    // Load news
    try {
      const rn = await fetch('/data/public/news.json');
      if (rn.ok) { const jn = await rn.json(); store.news = jn.news || []; }
    } catch(e) { store.news = []; }

    // Init UI stats
    const lSet = new Set(store.ALL.map(s=>s.lop).filter(Boolean));
    const nam  = store.ALL.filter(s=>s.gioiTinh==='Nam').length;
    const nu   = store.ALL.filter(s=>s.gioiTinh==='Nữ').length;
    animCount('hTotal', store.ALL.length);
    animCount('hLop',   lSet.size);
    animCount('hNam',   nam);
    animCount('hNu',    nu);
    syncLopSel();

    // Hide skeleton
    const le=$('loadEl'); if(le)le.style.display='none';

    // Init routes
    setupRoutes();
    initRouter();

    // Setup search
    setupSearch();
    setupScrollTop();

    // Quick stats after render
    setTimeout(updateQuickStats, 200);

  } catch(err) {
    const le=$('loadEl');
    if(le) le.innerHTML=`<div style="text-align:center;padding:80px 20px;color:var(--t3)"><div style="font-size:50px;margin-bottom:12px">⚠️</div><div style="font-size:15px;font-weight:700;color:var(--red);margin-bottom:8px">Không tải được dữ liệu</div><div style="font-size:13px">Kiểm tra file <code>data/public/students-public.json</code></div></div>`;
    console.error('Boot error:', err);
  }
}

/* ══ Routes ═══════════════════════════════ */
function setupRoutes() {
  route('/', () => {
    showOnlyView('viewHome');
    setActiveTab(null);
    renderHome();
  });
  route('/students', () => {
    showOnlyView('view' + store.tab.charAt(0).toUpperCase() + store.tab.slice(1));
    setActiveTab('table');
    // Sync view tabs
    ['table','card','class','stats'].forEach(n => {
      const b = $('vtTab-' + n); if(b) b.classList.toggle('on', n===store.tab);
    });
    store.page = 1; renderAll();
  });
  route('/birthdays', () => {
    showOnlyView('viewBirthdays');
    setActiveTab(null);
    renderBirthdays();
  });
  route('/news', () => {
    showOnlyView('viewNews');
    setActiveTab(null);
    renderNews();
  });
  route('/news/:id', ({ id }) => {
    showOnlyView('viewNewsDetail');
    setActiveTab(null);
    renderNewsDetail(id);
  });
  route('/submit', () => {
    showOnlyView('viewSubmit');
    setActiveTab(null);
    renderSubmit();
  });
  route('/stats', () => {
    store.tab = 'stats';
    showOnlyView('viewStats');
    setActiveTab('stats');
    ['table','card','class','stats'].forEach(n => {
      const b = $('vtTab-' + n); if(b) b.classList.toggle('on', n==='stats');
    });
    store.filtered = [...store.ALL];
    _renderStats();
  });
}

function setActiveTab(tabName) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('on', t.dataset.tab === tabName));
}

/* ══ Search setup ═════════════════════════ */
function setupSearch() {
  const si = $('SI');
  if (!si) return;

  si.addEventListener('input', () => {
    const v = si.value;
    const sc=$('SC');if(sc)sc.classList.toggle('on',v.length>0);
    const sp=$('smPill');if(sp)sp.classList.toggle('on',v.length>0&&!isNumQuery(stripDiacritics(v.trim())));
    clearTimeout(store._debounce);
    store._debounce = setTimeout(() => {
      store.page=1; renderAll(); updateChips(); updateBanner(); showSuggestions(v);
    }, 80);
  });

  si.addEventListener('keydown', e => {
    const box=$('sugBox'); if(!box||!box.classList.contains('on')) return;
    const items=box.querySelectorAll('.s-sug-item');
    if(!items.length) return;
    if(e.key==='ArrowDown'){e.preventDefault();store._sugIdx=Math.min(store._sugIdx+1,items.length-1);items.forEach((el,i)=>el.classList.toggle('active',i===store._sugIdx));}
    else if(e.key==='ArrowUp'){e.preventDefault();store._sugIdx=Math.max(store._sugIdx-1,0);items.forEach((el,i)=>el.classList.toggle('active',i===store._sugIdx));}
    else if(e.key==='Enter'&&store._sugIdx>=0){e.preventDefault();items[store._sugIdx]?.click();}
    else if(e.key==='Escape'){hideSuggestions();}
  });
  si.addEventListener('blur', () => setTimeout(hideSuggestions, 150));
  si.addEventListener('focus', () => { if(si.value) showSuggestions(si.value); });

  const fk=$('FK');if(fk)fk.addEventListener('change',()=>{syncLopSel();store.page=1;renderAll();updateChips();});
  const fl=$('FL');if(fl)fl.addEventListener('change',()=>{store.page=1;renderAll();updateChips();});
  const fg=$('FG');if(fg)fg.addEventListener('change',()=>{store.page=1;renderAll();updateChips();});

  document.addEventListener('keydown', e => {
    if(e.key==='/'&&document.activeElement!==si){e.preventDefault();si.focus();}
    if(e.key==='Escape'){if($('OV')?.classList.contains('on'))closeModal();else if($('SM_OV')?.classList.contains('on'))closeSoulModal();else if(si.value)clearSearch();}
  });
}

/* ══ Scroll to top ════════════════════════ */
function setupScrollTop() {
  const sc=$('scrollTop');if(!sc)return;
  function checkScroll(){
    const ts=$('tblScroll');
    const scrolled=ts?ts.scrollTop>180:window.scrollY>180;
    sc.classList.toggle('on',scrolled);
  }
  const ts=$('tblScroll');
  if(ts) ts.addEventListener('scroll',checkScroll,{passive:true});
  window.addEventListener('scroll',checkScroll,{passive:true});
}

/* ══ Public API (called from HTML) ════════ */
window.app = {
  navigate, go, goLop,
  setTab, setDensity, sortBy,
  clearSearch, selectSuggestion, clearKhoi, clearLop, clearGioiTinh,
  clearDateSearch, onDateSearch, resetAll, quickFilter,
  showDetail, closeModal, switchMTab,
  showSoulModal, closeSoulModal, findSoulMateAgain,
  printStudent, cp, toast,
  scrollToTop, toggleDark,
  submitArticle: handleSubmitArticle,
};

/* ══ Start ════════════════════════════════ */
initTheme();
document.addEventListener('DOMContentLoaded', boot);
