/* ══════════════════════════════════════════
   STUDENTS PAGE — Table / Card / Class / Stats views
═══════════════════════════════════════════ */
import { store } from '../core/store.js';
import { stripDiacritics, buildIndex, isNumQuery, matchSearch, matchScore, getSuggestions, getSimilar, hlName } from '../utils/search.js';
import { showDetail } from './student-detail.js';

const $ = id => document.getElementById(id);
const dash = () => '<span style="color:var(--t4)">—</span>';

/* ── Filters ─────────────────────────────── */
export function getFiltered() {
  const rawQ  = ($('SI') && $('SI').value.trim()) || '';
  const normQ = stripDiacritics(rawQ);
  const kh = ($('FK') && $('FK').value) || '';
  const lp = ($('FL') && $('FL').value) || '';
  const gn = ($('FG') && $('FG').value) || '';
  const df = getDateFilter();

  let results = store.ALL.filter(s => {
    if (kh && !s.lop?.startsWith(kh)) return false;
    if (lp && s.lop !== lp) return false;
    if (gn && s.gioiTinh !== gn) return false;
    if (normQ && !matchSearch(s, normQ)) return false;
    if (!matchDateFilter(s, df)) return false;
    return true;
  });
  if (normQ && !isNumQuery(normQ)) {
    results = results.map(s => ({ s, sc: matchScore(s, normQ) }))
      .sort((a, b) => b.sc - a.sc)
      .map(x => x.s);
  }
  return results;
}

export function getSorted(arr) {
  const f = ($('SB') && $('SB').value) || store.sField;
  return [...arr].sort((a, b) => {
    const va = a[f] ?? '', vb = b[f] ?? '';
    if (f === 'stt') return ((parseInt(va)||0) - (parseInt(vb)||0)) * store.sDir;
    return String(va).localeCompare(String(vb), 'vi') * store.sDir;
  });
}

export function getDateFilter() {
  const d = ($('DSDay') && $('DSDay').value.trim()) || '';
  const m = ($('DSMon') && $('DSMon').value.trim()) || '';
  const y = ($('DSYear') && $('DSYear').value.trim()) || '';
  return { d, m, y, active: !!(d || m || y) };
}

export function matchDateFilter(s, df) {
  if (!df.active) return true;
  const ns = s.ngaySinh || '';
  const parts = ns.split('/');
  if (parts.length < 3) return false;
  const [sd, sm, sy] = parts;
  if (df.d && parseInt(sd) !== parseInt(df.d)) return false;
  if (df.m && parseInt(sm) !== parseInt(df.m)) return false;
  if (df.y && parseInt(sy) !== parseInt(df.y)) return false;
  return true;
}

/* ── Render all ──────────────────────────── */
export function renderAll() {
  const rawQ  = ($('SI') && $('SI').value.trim()) || '';
  const normQ = stripDiacritics(rawQ);
  const isNum = isNumQuery(normQ);
  const base  = getFiltered();
  store.filtered = (normQ && !isNum) ? base : getSorted(base);
  const c = store.filtered.length;

  const rc = $('RC');
  if (rc) {
    let html = `Hiển thị <strong>${c.toLocaleString('vi')}</strong> / ${store.ALL.length.toLocaleString('vi')} học sinh`;
    if (rawQ) {
      const mode = isNum ? 'CCCD/SĐT' : 'tên';
      html += ` <span class="tb-mode-tag">🔍 ${mode}: "${rawQ}"</span>`;
    }
    rc.innerHTML = html;
  }

  if      (store.tab === 'table') renderTable();
  else if (store.tab === 'card')  renderCards();
  else if (store.tab === 'class') renderClasses();
  else                            renderStats();
}

/* ── Pagination ──────────────────────────── */
function getPage() {
  const pp = parseInt(($('PP') && $('PP').value) || '50');
  const tp = Math.max(1, Math.ceil(store.filtered.length / pp));
  if (store.page > tp) store.page = tp;
  return { items: store.filtered.slice((store.page - 1) * pp, store.page * pp), tp };
}

function buildPg() {
  const { tp } = getPage();
  if (tp <= 1) return '';
  const show = new Set([1, tp, store.page - 1, store.page, store.page + 1].filter(p => p >= 1 && p <= tp));
  let h = `<button class="pg-btn" onclick="app.go(${store.page - 1})" ${store.page === 1 ? 'disabled' : ''}>‹</button>`;
  let prev = 0;
  [...show].sort((a, b) => a - b).forEach(p => {
    if (prev && p - prev > 1) h += `<span class="pg-dots">…</span>`;
    h += `<button class="pg-btn${p === store.page ? ' on' : ''}" onclick="app.go(${p})">${p}</button>`;
    prev = p;
  });
  h += `<button class="pg-btn" onclick="app.go(${store.page + 1})" ${store.page === tp ? 'disabled' : ''}>›</button>`;
  h += `<span class="pg-info">Trang ${store.page}/${tp} · ${store.filtered.length.toLocaleString('vi')} kết quả</span>`;
  return h;
}

/* ── Table view ──────────────────────────── */
export function renderTable() {
  const { items } = getPage();
  const tbody = $('TB');
  if (!tbody) return;
  const rawQ  = ($('SI') && $('SI').value.trim()) || '';
  const normQ = stripDiacritics(rawQ);
  const isNum = isNumQuery(normQ);
  const mt = $('mainTable');
  if (mt) mt.className = store.density === 'loose' ? 'tbl-loose' : '';

  if (!items.length) {
    let simHtml = '';
    if (rawQ && !isNumQuery(normQ) && normQ.length >= 2) {
      const sim = getSimilar(normQ, [], store.ALL);
      if (sim.length) {
        simHtml = `<div class="no-similar"><div class="no-sim-lbl">Có thể bạn tìm:</div><div class="no-sim-list">${sim.map(s=>`<span class="no-sim-item" onclick="app.selectSuggestion('${s.hoTen.replace(/'/g,"\\'")}')">${s.hoTen} <span>${s.lop||''}</span></span>`).join('')}</div></div>`;
      }
    }
    tbody.innerHTML = `<tr><td colspan="9"><div class="no-rows"><div class="no-rows-ico">🔍</div><h3>Không tìm thấy học sinh nào</h3><p>Thử tìm tên khác hoặc kiểm tra lại bộ lọc</p>${simHtml}</div></td></tr>`;
    const pgt = $('pg-tbl'); if (pgt) pgt.innerHTML = '';
    return;
  }

  tbody.innerHTML = items.map(s => {
    const addr = s.thonXom || s.xaPhuongThuongTru || s.queQuan || '';
    const gCls = s.gioiTinh === 'Nam' ? 'bnam' : 'bnu';
    const kCls = `b${s.lop?.substring(0,2) || ''}`;
    const nameHtml = (rawQ && !isNum) ? hlName(s.hoTen, normQ) : (s.hoTen || '');
    const bdBadge = getBdBadge(s.ngaySinh);

    return `<tr class="anim-row" onclick="app.showDetail(${s.stt})">
      <td style="color:var(--t4);font-size:11.5px">${s.stt}</td>
      <td class="td-name">${bdBadge}${nameHtml || dash()}</td>
      <td style="font-size:12px">${s.ngaySinh || dash()}</td>
      <td><span class="b ${gCls}">${s.gioiTinh || ''}</span></td>
      <td><span class="b ${kCls}">${s.lop || ''}</span></td>
      <td title="${addr}" style="color:var(--t3);font-size:12.5px">${addr || dash()}</td>
      <td style="font-size:12px">${s.tenBo || dash()}</td>
      <td style="font-size:12px">${s.ngheNghiepBo || dash()}</td>
      <td style="font-size:12px">${s.tenMe || dash()}</td>
    </tr>`;
  }).join('');
  const pgt = $('pg-tbl'); if (pgt) pgt.innerHTML = buildPg();
}

/* ── Card view ───────────────────────────── */
export function renderCards() {
  const { items } = getPage();
  const grid = $('CG');
  if (!grid) return;
  const rawQ  = ($('SI') && $('SI').value.trim()) || '';
  const normQ = stripDiacritics(rawQ);
  const isNum = isNumQuery(normQ);

  if (!items.length) {
    let simHtml = '';
    if (rawQ && !isNumQuery(normQ) && normQ.length >= 2) {
      const sim = getSimilar(normQ, [], store.ALL);
      if (sim.length) {
        simHtml = `<div class="no-similar"><div class="no-sim-lbl">Có thể bạn tìm:</div><div class="no-sim-list">${sim.map(s=>`<span class="no-sim-item" onclick="app.selectSuggestion('${s.hoTen.replace(/'/g,"\\'")}')">${s.hoTen} <span>${s.lop||''}</span></span>`).join('')}</div></div>`;
      }
    }
    grid.innerHTML = `<div class="no-rows" style="grid-column:1/-1"><div class="no-rows-ico">🔍</div><h3>Không tìm thấy học sinh nào</h3><p>Thử tìm tên khác hoặc kiểm tra lại bộ lọc</p>${simHtml}</div>`;
    const pgc = $('pg-card'); if (pgc) pgc.innerHTML = '';
    return;
  }

  grid.innerHTML = items.map((s, i) => {
    const nameHtml = (rawQ && !isNum) ? hlName(s.hoTen, normQ) : (s.hoTen || '–');
    const bdBadge  = getBdBadge(s.ngaySinh);
    return `<div class="scard anim-fade" style="animation-delay:${Math.min(i*.04,.4)}s" onclick="app.showDetail(${s.stt})">
      <div class="sc-name">${bdBadge}${nameHtml}</div>
      <div class="sc-stt">STT #${s.stt}</div>
      <div class="sc-badges">
        <span class="b b${s.lop?.substring(0,2)||''}">${s.lop || '–'}</span>
        <span class="b ${s.gioiTinh==='Nam'?'bnam':'bnu'}">${s.gioiTinh || '–'}</span>
      </div>
      <div class="sc-grid">
        <div class="sc-f"><span class="sc-fl">Ngày sinh</span><span class="sc-fv">${s.ngaySinh || '–'}</span></div>
        <div class="sc-f"><span class="sc-fl">Thôn/xóm</span><span class="sc-fv">${s.thonXom || s.xaPhuongThuongTru || '–'}</span></div>
        <div class="sc-f"><span class="sc-fl">Quê quán</span><span class="sc-fv">${s.queQuan || '–'}</span></div>
        <div class="sc-f"><span class="sc-fl">Giới tính</span><span class="sc-fv">${s.gioiTinh || '–'}</span></div>
      </div>
      <hr class="sc-div">
      <div class="sc-parents">
        <div class="sc-par"><div class="sc-par-l">👨 Bố</div><div class="sc-par-n">${s.tenBo || '–'}</div><div class="sc-par-j">${s.ngheNghiepBo || ''}</div></div>
        <div class="sc-par"><div class="sc-par-l">👩 Mẹ</div><div class="sc-par-n">${s.tenMe || '–'}</div><div class="sc-par-j">${s.ngheNghiepMe || ''}</div></div>
      </div>
    </div>`;
  }).join('');
  const pgc = $('pg-card'); if (pgc) pgc.innerHTML = buildPg();
}

/* ── Class view ──────────────────────────── */
export function renderClasses() {
  const el = $('clsContent');
  if (!el) return;
  const lopMap = {};
  store.filtered.forEach(s => {
    if (!s.lop) return;
    if (!lopMap[s.lop]) lopMap[s.lop] = { t:0, m:0, f:0 };
    lopMap[s.lop].t++;
    if (s.gioiTinh === 'Nam') lopMap[s.lop].m++; else lopMap[s.lop].f++;
  });
  const lops = Object.keys(lopMap).sort((a,b) => a.localeCompare(b,'vi'));
  if (!lops.length) { el.innerHTML = '<div class="no-rows" style="margin-top:40px"><div class="no-rows-ico">🏫</div><h3>Không có lớp nào</h3></div>'; return; }

  const kCol = { '10':'var(--blue)', '11':'var(--green)', '12':'#8a1a0a' };
  const byK  = { '10':[], '11':[], '12':[] };
  lops.forEach(l => { const k = l.substring(0,2); if (byK[k]) byK[k].push(l); });

  let html = '';
  ['10','11','12'].forEach(k => {
    const kl = byK[k]; if (!kl.length) return;
    const kTot = kl.reduce((a,l) => a + lopMap[l].t, 0);
    html += `<div class="cls-section">
      <div class="cls-khoi" style="color:${kCol[k]}">Khối ${k} · ${kl.length} lớp · ${kTot.toLocaleString('vi')} HS</div>
      <div class="cls-grid">
        ${kl.map((l,i) => {
          const d = lopMap[l], mp = d.t ? (d.m/d.t*100).toFixed(1) : 0;
          return `<div class="cls-card k${k} anim-pop" style="animation-delay:${i*.04}s" onclick="app.goLop('${l}')">
            <div class="cls-n">${l}</div>
            <div class="cls-t">${d.t} học sinh</div>
            <div class="cls-bar"><div class="cls-bar-m" style="width:${mp}%"></div><div class="cls-bar-f" style="flex:1"></div></div>
            <div class="cls-gd"><span>👦 <strong>${d.m}</strong></span><span>👧 <strong>${d.f}</strong></span></div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  });
  el.innerHTML = html;
}

/* ── Stats view ──────────────────────────── */
export function renderStats() {
  const data = store.filtered;
  const lops = [...new Set(data.map(s => s.lop).filter(Boolean))];
  const k10  = data.filter(s => s.lop?.startsWith('10')).length;
  const k11  = data.filter(s => s.lop?.startsWith('11')).length;
  const k12  = data.filter(s => s.lop?.startsWith('12')).length;

  const st = $('sTiles');
  if (st) st.innerHTML = [
    { n: data.length,  l:'Tổng học sinh', c:'var(--red)' },
    { n: lops.length,  l:'Số lớp',        c:'var(--gold2)' },
    { n: data.filter(s=>s.gioiTinh==='Nam').length, l:'Nam', c:'var(--blue)' },
    { n: data.filter(s=>s.gioiTinh==='Nữ').length,  l:'Nữ',  c:'var(--pink)' },
    { n: k10, l:'Khối 10', c:'var(--blue)' },
    { n: k11, l:'Khối 11', c:'var(--green)' },
    { n: k12, l:'Khối 12', c:'#8a1a0a' },
    { n: lops.length ? Math.round(data.length/lops.length) : 0, l:'TB HS/lớp', c:'#666' },
  ].map((t,i) => `<div class="stile anim-fade" style="animation-delay:${i*.05}s"><div class="stile-n" style="color:${t.c}">${t.n.toLocaleString('vi')}</div><div class="stile-l">${t.l}</div></div>`).join('');

  const bar = (entries, color, delay=0) => {
    const mx = Math.max(...entries.map(e => e[1]), 1);
    return entries.map(([l,c],i) => `
      <div class="bc-row" style="animation:rowSlideIn .22s ${delay+i*.04}s cubic-bezier(.22,1,.36,1) both">
        <div class="bc-lbl" title="${l}">${l.length>11?l.slice(0,11)+'…':l}</div>
        <div class="bc-track"><div class="bc-fill" style="width:${(c/mx*100).toFixed(1)}%;background:${color};animation-delay:${delay+i*.04}s;min-width:${c>0?'18px':'0'}">${c>4?c:c>0?c:''}</div></div>
        <div class="bc-n">${c}</div>
      </div>`).join('');
  };

  const lopMap = {}; data.forEach(s => { if(s.lop) lopMap[s.lop]=(lopMap[s.lop]||0)+1; });
  const sortedL = Object.entries(lopMap).sort((a,b) => a[0].localeCompare(b[0],'vi'));
  const kCol = { '10':'var(--blue)', '11':'var(--green)', '12':'#8a1a0a' };
  const mxL = Math.max(...sortedL.map(e=>e[1]), 1);

  const occB = {}; data.forEach(s => { if(s.ngheNghiepBo) occB[s.ngheNghiepBo]=(occB[s.ngheNghiepBo]||0)+1; });
  const topB = Object.entries(occB).sort((a,b) => b[1]-a[1]).slice(0,8);
  const occM = {}; data.forEach(s => { if(s.ngheNghiepMe) occM[s.ngheNghiepMe]=(occM[s.ngheNghiepMe]||0)+1; });
  const topM = Object.entries(occM).sort((a,b) => b[1]-a[1]).slice(0,8);
  const regMap = {}; data.forEach(s => { const x=s.xaPhuongThuongTru||s.queQuan; if(x) regMap[x]=(regMap[x]||0)+1; });
  const topR = Object.entries(regMap).sort((a,b) => b[1]-a[1]).slice(0,10);

  const sc = $('sCharts');
  if (!sc) return;
  sc.innerHTML = `
    <div class="chart-card anim-fade" style="animation-delay:.1s">
      <h3>📊 Học sinh theo lớp</h3>
      <div class="bc">${sortedL.map(([l,c],i) => `
        <div class="bc-row" style="animation:rowSlideIn .22s ${i*.028}s cubic-bezier(.22,1,.36,1) both">
          <div class="bc-lbl">${l}</div>
          <div class="bc-track"><div class="bc-fill" style="width:${(c/mxL*100).toFixed(1)}%;background:${kCol[l.substring(0,2)]||'var(--red)'};animation-delay:${i*.03}s">${c} <span style="opacity:.7;font-size:8.5px">(${(c/mxL*100).toFixed(0)}%)</span></div></div>
          <div class="bc-n">${c}</div>
        </div>`).join('')}
      </div>
    </div>
    <div class="chart-card anim-fade" style="animation-delay:.15s">
      <h3>⚧ Giới tính theo khối</h3>
      <div class="bc" style="gap:14px">
        ${['10','11','12'].map((k,ki) => {
          const kd=data.filter(s=>s.lop?.startsWith(k));
          const kn=kd.filter(s=>s.gioiTinh==='Nam').length, kf=kd.length-kn;
          const tot=kd.length||1, mp=(kn/tot*100).toFixed(1);
          return `<div style="animation:fadeUp .3s ${ki*.08}s ease both">
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--t3);margin-bottom:5px"><strong style="color:${kCol[k]}">Khối ${k}</strong><span>${kd.length} HS</span></div>
            <div class="bc-track" style="height:26px;border-radius:5px">
              <div style="display:flex;height:100%;animation:barGrow .7s ${ki*.12}s ease both">
                <div style="width:${mp}%;background:var(--blue);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;min-width:${kn?'24px':'0'}">${kn||''}</div>
                <div style="flex:1;background:var(--pink);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;min-width:${kf?'24px':'0'}">${kf||''}</div>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--t3);margin-top:3px"><span>👦 Nam ${mp}%</span><span>Nữ ${(100-parseFloat(mp)).toFixed(1)}% 👧</span></div>
          </div>`;
        }).join('')}
        <div class="legend"><span><span class="ld" style="background:var(--blue)"></span>Nam</span><span><span class="ld" style="background:var(--pink)"></span>Nữ</span></div>
      </div>
    </div>
    <div class="chart-card anim-fade" style="animation-delay:.2s">
      <h3>💼 Nghề nghiệp bố (top 8)</h3>
      <div class="bc">${bar(topB,'#7a4a1a',.2)}</div>
    </div>
    <div class="chart-card anim-fade" style="animation-delay:.22s">
      <h3>👩 Nghề nghiệp mẹ (top 8)</h3>
      <div class="bc">${bar(topM,'#8a2a4a',.22)}</div>
    </div>
    <div class="chart-card anim-fade" style="animation-delay:.25s">
      <h3>📍 Phân bố địa bàn (top 10)</h3>
      <div class="bc">${bar(topR,'#1a5a7a',.25)}</div>
    </div>`;
}

/* ── Quick Stats Bar ─────────────────────── */
export function updateQuickStats() {
  if (!store.ALL.length) return;
  const qsb = $('quickStatBar');
  if (qsb) qsb.classList.add('visible');
  const now = new Date();
  const dd  = String(now.getDate()).padStart(2,'0');
  const mm  = String(now.getMonth()+1).padStart(2,'0');
  const bdCount = store.ALL.filter(s => {
    const p = (s.ngaySinh||'').split('/');
    return p.length>=2 && p[0]===dd && p[1]===mm;
  }).length;
  const k10 = store.ALL.filter(s=>s.lop?.startsWith('10')).length;
  const k11 = store.ALL.filter(s=>s.lop?.startsWith('11')).length;
  const k12 = store.ALL.filter(s=>s.lop?.startsWith('12')).length;
  const nam = store.ALL.filter(s=>s.gioiTinh==='Nam').length;
  const nu  = store.ALL.filter(s=>s.gioiTinh==='Nữ').length;
  animStat('qs-bd',  bdCount);
  animStat('qs-k10', k10);
  animStat('qs-k11', k11);
  animStat('qs-k12', k12);
  animStat('qs-nam', nam);
  animStat('qs-nu',  nu);
}

function animStat(id, val) {
  const el = $(id); if (!el) return;
  const dur=650, steps=28; let i=0;
  el.style.animation='none'; void el.offsetWidth;
  el.style.animation='qs-num-bounce .4s cubic-bezier(.34,1.56,.64,1) both';
  const iv = setInterval(()=>{
    i++; el.textContent=Math.round(val*(i/steps)).toLocaleString('vi');
    if(i>=steps){el.textContent=val.toLocaleString('vi');clearInterval(iv);}
  }, dur/steps);
}

/* ── Suggestions ─────────────────────────── */
export function showSuggestions(rawQ) {
  const box = $('sugBox');
  if (!box || !rawQ || rawQ.trim().length < 1) { hideSuggestions(); return; }
  const { main, similar } = getSuggestions(rawQ, store.ALL);
  if (!main.length && !similar.length) { hideSuggestions(); return; }
  const normQ = stripDiacritics(rawQ.trim());
  store._sugIdx = -1;
  let html = main.map(s => `<div class="s-sug-item" onclick="app.selectSuggestion('${s.hoTen.replace(/'/g,"\\'")}')"><span>${hlName(s.hoTen, normQ)}</span><span class="s-sug-cls">${s.lop||''}</span></div>`).join('');
  if (similar.length) {
    html += `<div class="s-sug-sep">Tên tương tự</div>`;
    html += similar.map(s => `<div class="s-sug-item s-sug-sim" onclick="app.selectSuggestion('${s.hoTen.replace(/'/g,"\\'")}')"><span>${hlName(s.hoTen, normQ)||s.hoTen}</span><span class="s-sug-cls">${s.lop||''}</span></div>`).join('');
  }
  box.innerHTML = html;
  box.classList.add('on');
}

export function hideSuggestions() {
  const box = $('sugBox'); if (box) box.classList.remove('on');
  store._sugIdx = -1;
}

/* ── Helpers ─────────────────────────────── */
export function getBdBadge(ngaySinh) {
  if (!ngaySinh) return '';
  const now = new Date();
  const dd = String(now.getDate()).padStart(2,'0');
  const mm = String(now.getMonth()+1).padStart(2,'0');
  const p = ngaySinh.split('/');
  if (p.length>=2 && p[0]===dd && p[1]===mm) return '<span class="bd-today">🎂</span>';
  return '';
}

export function syncLopSel() {
  const kh  = ($('FK') && $('FK').value) || '';
  const sel = $('FL'); if (!sel) return;
  const cur = sel.value;
  const lops = [...new Set(store.ALL.map(s=>s.lop).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'vi'));
  sel.innerHTML = '<option value="">📋 Tất cả lớp</option>';
  lops.filter(l => !kh || l.startsWith(kh)).forEach(l => {
    const o = document.createElement('option');
    o.value = l; o.textContent = 'Lớp ' + l;
    if (l === cur) o.selected = true;
    sel.appendChild(o);
  });
}

export function updateChips() {
  const q  = ($('SI') && $('SI').value.trim()) || '';
  const kh = ($('FK') && $('FK').value) || '';
  const lp = ($('FL') && $('FL').value) || '';
  const gn = ($('FG') && $('FG').value) || '';
  const df = getDateFilter();
  const c  = [];
  if (q)  c.push({ l:`"${q}"`,     fn:"app.clearSearch()" });
  if (kh) c.push({ l:`Khối ${kh}`, fn:"app.clearKhoi()" });
  if (lp) c.push({ l:`Lớp ${lp}`,  fn:"app.clearLop()" });
  if (gn) c.push({ l:gn,           fn:"app.clearGioiTinh()" });
  if (df.active) {
    const parts=[]; if(df.d)parts.push('Ngày '+df.d); if(df.m)parts.push('Tháng '+df.m); if(df.y)parts.push('Năm '+df.y);
    c.push({ l:'🗓 '+parts.join(' / '), fn:"app.clearDateSearch()" });
  }
  const w = $('chips'); if (!w) return;
  w.className = 'h-chips' + (c.length ? ' on' : '');
  w.innerHTML = c.map(x=>`<span class="chip" onclick="${x.fn}">${x.l} ✕</span>`).join('')
    + (c.length > 1 ? `<span class="chip" onclick="app.resetAll()">Xóa tất cả ✕</span>` : '');
}

export function updateBanner() {
  const q  = ($('SI') && $('SI').value.trim()) || '';
  const normQ = stripDiacritics(q);
  const banner = $('searchBanner');
  if (!banner) return;
  if (q && !isNumQuery(normQ)) {
    banner.classList.add('on');
    const t = $('sbTag'); if(t) t.textContent = '"' + q + '"';
    const cnt = $('sbCount'); if(cnt) cnt.textContent = `· ${store.filtered.length.toLocaleString('vi')} kết quả`;
  } else {
    banner.classList.remove('on');
  }
}
