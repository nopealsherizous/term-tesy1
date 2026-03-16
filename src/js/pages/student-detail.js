/* ══════════════════════════════════════════
   STUDENT DETAIL — Modal + Tử vi + Soul
═══════════════════════════════════════════ */
import { store } from '../core/store.js';
import { parseBirthDate } from '../utils/date.js';
import { getZodiac, getLuckyInfo, PERSONALITIES } from '../modules/zodiac.js';
import { getMenh, getChiYear } from '../modules/menh.js';
import { calcNumerology, NUM_MEANINGS } from '../modules/numerology.js';
import { calcCompatScore, buildSoulMatePanel } from '../modules/compatibility.js';

const $ = id => document.getElementById(id);

/* ── Info Pills ──────────────────────────── */
function buildInfoPills(s) {
  const bd = parseBirthDate(s.ngaySinh);
  if (!bd) return '';
  const z    = getZodiac(bd.d, bd.m);
  const menh = getMenh(bd.y);
  const chi  = getChiYear(bd.y);
  const elClass = { 'Lửa':'m-pill-el-fire','Đất':'m-pill-el-earth','Khí':'m-pill-el-air','Nước':'m-pill-el-water' }[z.element] || 'm-pill-el-fire';
  const mKey = menh.name.toLowerCase();
  const menhClass = mKey.includes('kim')?'m-pill-menh-kim':mKey.includes('thủy')||mKey.includes('thuy')?'m-pill-menh-thuy':mKey.includes('mộc')||mKey.includes('moc')?'m-pill-menh-moc':mKey.includes('hỏa')||mKey.includes('hoa')?'m-pill-menh-hoa':'m-pill-menh-tho';
  const elEmoji = { 'Lửa':'🔥','Đất':'🌍','Khí':'💨','Nước':'💧' }[z.element] || '✨';
  const today = new Date();
  const isBd  = bd.d===today.getDate() && bd.m===(today.getMonth()+1);
  const bdPill = isBd ? `<span class="m-pill m-pill-bd"><span class="m-pill-ico">🎂</span>Sinh nhật hôm nay!</span>` : '';
  return `<div class="m-pill-row">
    <span class="m-pill m-pill-zodiac"><span class="m-pill-ico">${z.emoji}</span>${z.name}</span>
    <span class="m-pill ${elClass}"><span class="m-pill-ico">${elEmoji}</span>${z.element}</span>
    <span class="m-pill ${menhClass}"><span class="m-pill-ico">${menh.icon}</span>Mệnh ${menh.name.split('–')[0].trim().replace(/^[A-Za-zÀ-ỹ]+ - /,'')}</span>
    <span class="m-pill m-pill-chi"><span class="m-pill-ico">${chi.icon}</span>Tuổi ${chi.chi}</span>
    ${bdPill}
  </div>`;
}

/* ── Tuvi Panel ──────────────────────────── */
function buildTuviPanel(s) {
  const bd = parseBirthDate(s.ngaySinh);
  if (!bd) return '<div style="padding:16px;text-align:center;color:rgba(255,255,255,.3);font-size:12px">Không có ngày sinh</div>';
  const z     = getZodiac(bd.d, bd.m);
  const menh  = getMenh(bd.y);
  const chi   = getChiYear(bd.y);
  const lucky = getLuckyInfo(z.idx);
  const elColors = { 'Lửa':'#ff6b35','Đất':'#c4a35a','Khí':'#48dbfb','Nước':'#1e90ff' };
  const elColor  = elColors[z.element] || '#aaa';
  return `
    <div class="tv-hero">
      <div class="tv-hero-emoji">${z.emoji}</div>
      <div class="tv-hero-info">
        <div class="tv-hero-name">${z.name}</div>
        <div class="tv-hero-en">${z.en}</div>
        <div class="tv-hero-dates">📅 ${z.start[0]}/${z.start[1]} – ${z.end[0]}/${z.end[1]}</div>
        <div class="tv-trait-tags">${z.trait.split(', ').map(t=>`<span class="tv-trait-tag">${t}</span>`).join('')}</div>
      </div>
    </div>
    <div class="tv-grid">
      <div class="tv-cell"><div class="tv-cell-lbl">Ngũ hành</div><div class="tv-cell-ico" style="filter:drop-shadow(0 0 6px ${elColor}88)">${{'Lửa':'🔥','Đất':'🌍','Khí':'💨','Nước':'💧'}[z.element]||'✨'}</div><div class="tv-cell-val" style="color:${elColor}">${z.element}</div><div class="tv-cell-sub">${z.ruling}</div></div>
      <div class="tv-cell"><div class="tv-cell-lbl">Mệnh</div><div class="tv-cell-ico">${menh.icon}</div><div class="tv-cell-val">${menh.name.split('–')[0].trim()}</div><div class="tv-cell-sub">${menh.desc.split('–')[1]?.trim()||''}</div></div>
      <div class="tv-cell"><div class="tv-cell-lbl">Năm sinh</div><div class="tv-cell-ico">${chi.icon}</div><div class="tv-cell-val">Tuổi ${chi.chi}</div><div class="tv-cell-sub">${bd.y}</div></div>
    </div>
    <div class="tv-lucky">
      <span class="tv-lucky-lbl">May mắn</span>
      ${lucky.colors.map(c=>`<span class="tv-lucky-pill">🎨 ${c}</span>`).join('')}
      <span class="tv-lucky-sep">·</span>
      ${lucky.nums.map(n=>`<span class="tv-lucky-num">${n}</span>`).join('')}
    </div>
    <div class="tv-personality">
      <div class="tv-pers-inner"><span class="tv-pers-icon">✨</span><span class="tv-pers-text">${PERSONALITIES[z.idx]||''}</span></div>
    </div>`;
}

/* ── Numerology Panel ────────────────────── */
function buildNumerologyPanel(s) {
  const bd = parseBirthDate(s.ngaySinh);
  if (!bd) return '<div style="padding:16px;text-align:center;color:var(--t4);font-size:12px">Không có ngày sinh</div>';
  const num = calcNumerology(bd);
  if (!num) return '';
  const cells = [
    { lbl:'Số đường đời', val:num.life,  sub:'Life Path' },
    { lbl:'Số ngày sinh', val:num.birth, sub:'Birth Day' },
    { lbl:'Số biểu đạt',  val:num.expr,  sub:'Expression' },
    { lbl:'Số tâm hồn',   val:num.soul,  sub:'Soul Urge' },
  ];
  const info = NUM_MEANINGS[num.life] || null;
  return `
    <div class="num-grid">${cells.map(c=>`<div class="num-cell"><div class="num-lbl">${c.lbl}</div><div class="num-val">${c.val}</div><div class="num-sub">${c.sub}</div></div>`).join('')}</div>
    ${info ? `<div class="num-meaning">✨ <strong style="color:${info.color}">${info.name}</strong><br>${info.desc}</div>` : ''}`;
}

/* ── Main showDetail ─────────────────────── */
export function showDetail(stt) {
  const s = store.ALL.find(x => x.stt === stt);
  if (!s) return;
  const v   = val => val ? `<span class="mfv">${val}</span>` : `<span class="mfv empty">Không có</span>`;
  const sdt = n => n
    ? `<button class="ptile-s" onclick="app.cp('${n}')">📞 ${n}</button>`
    : `<span style="font-size:11.5px;color:var(--t4)">Không có SĐT</span>`;

  $('MOD').innerHTML = `
    <div class="mhdr">
      <button class="m-close" onclick="app.closeModal()">✕</button>
      <div class="m-name">${s.hoTen || '–'}</div>
      <div class="m-meta">
        <span class="b b${s.lop?.substring(0,2)||''}">${s.lop||'–'}</span>
        <span class="b ${s.gioiTinh==='Nam'?'bnam':'bnu'}">${s.gioiTinh||'–'}</span>
        <span style="font-size:11.5px;opacity:.5">STT #${s.stt}</span>
      </div>
    </div>
    <div class="modal-tabs">
      <button class="modal-tab on" onclick="app.switchMTab('info',this)">📋 Thông tin</button>
      <button class="modal-tab" onclick="app.switchMTab('tuvi',this)">🔮 Tử vi</button>
      <button class="modal-tab" onclick="app.switchMTab('num',this)">🔢 Số học</button>
      <button class="modal-tab" onclick="app.switchMTab('soul',this)">💘 Linh hồn</button>
    </div>

    <div id="mPane-info" class="modal-pane on">
      <div class="mbody">
        <div class="msec"><h4>Thông tin cá nhân</h4>
          <div class="mgrid">
            <div class="mf"><div class="mfl">Họ và tên</div>${v(s.hoTen)}</div>
            <div class="mf"><div class="mfl">Ngày sinh</div>${v(s.ngaySinh)}</div>
            <div class="mf"><div class="mfl">Giới tính</div>${v(s.gioiTinh)}</div>
            <div class="mf"><div class="mfl">Lớp</div>${v(s.lop)}</div>
          </div>
        </div>
        <div class="msec"><h4>Địa chỉ</h4>
          <div class="mgrid">
            <div class="mf"><div class="mfl">Xã/phường thường trú</div>${v(s.xaPhuongThuongTru)}</div>
            <div class="mf"><div class="mfl">Thôn xóm</div>${v(s.thonXom)}</div>
            <div class="mf"><div class="mfl">Quê quán</div>${v(s.queQuan)}</div>
            <div class="mf"><div class="mfl">Chỗ ở hiện nay</div>${v(s.choOHienNay)}</div>
          </div>
        </div>
        <div class="msec"><h4>Thông tin phụ huynh</h4>
          <div class="pgrid">
            <div class="ptile"><div class="ptile-l">👨 Bố</div><div class="ptile-n">${s.tenBo||'Không có'}</div><div class="ptile-j">${s.ngheNghiepBo||''}</div></div>
            <div class="ptile"><div class="ptile-l">👩 Mẹ</div><div class="ptile-n">${s.tenMe||'Không có'}</div><div class="ptile-j">${s.ngheNghiepMe||''}</div></div>
          </div>
        </div>
      </div>
    </div>

    <div id="mPane-tuvi" class="modal-pane">
      ${buildInfoPills(s)}
      <div class="tuvi-section" style="margin:12px 18px 14px">
        <div class="tuvi-hdr"><span class="tuvi-hdr-ico">🌙</span><span class="tuvi-hdr-title">Xem nhanh Tử vi</span><span class="tuvi-hdr-sub">${s.ngaySinh||''}</span></div>
        ${buildTuviPanel(s)}
      </div>
    </div>

    <div id="mPane-num" class="modal-pane">
      ${buildNumerologyPanel(s)}
    </div>

    <div id="mPane-soul" class="modal-pane">
      <div style="text-align:center;padding:16px 18px 8px">
        <p style="font-size:13px;color:var(--t3);margin-bottom:12px">Tìm người tương hợp với <strong>${s.hoTen}</strong></p>
        <button class="soul-btn" style="max-width:280px;margin:0 auto" onclick="app.closeModal();app.showSoulModal(${s.stt})">💘 Tìm linh hồn đồng điệu</button>
      </div>
    </div>

    <div class="mactions">
      <button class="mabtn mabtn-out" onclick="app.printStudent(${s.stt})">🖨 In</button>
      <button class="mabtn mabtn-out" onclick="app.closeModal();app.showSoulModal(${s.stt})" style="background:linear-gradient(135deg,#c2185b,#880e4f);color:#fff">💘 Linh hồn</button>
      <button class="mabtn mabtn-pri" onclick="app.closeModal()">Đóng</button>
    </div>`;

  $('OV').classList.add('on');
}

/* ── Soul Modal ──────────────────────────── */
export function showSoulModal(stt) {
  const s1 = store.ALL.find(x => x.stt === stt);
  if (!s1) return;
  const smOv = $('SM_OV');
  if (!smOv) return;

  $('SM_MOD').innerHTML = `
    <div class="mhdr" style="border-radius:16px 16px 0 0;background:linear-gradient(135deg,#880e4f,#c2185b,#e91e63)">
      <button class="m-close" onclick="app.closeSoulModal()">✕</button>
      <div class="m-name" style="font-size:16px">💘 Linh hồn đồng điệu</div>
      <div class="m-meta"><span style="font-size:11.5px;opacity:.7">${s1.hoTen}</span></div>
    </div>
    <div id="soul-area" style="padding:16px 18px;min-height:200px"></div>`;
  smOv.classList.add('on');
  findSoulMate(s1);
}

export function closeSoulModal() {
  const smOv = $('SM_OV');
  if (smOv) smOv.classList.remove('on');
}

function findSoulMate(s1) {
  const area = $('soul-area');
  if (!area) return;

  const candidates = store.ALL.filter(s => s.stt !== s1.stt && s.gioiTinh !== s1.gioiTinh);
  if (!candidates.length) {
    area.innerHTML = '<p style="text-align:center;color:var(--t3);font-size:13px;padding:20px">Không đủ dữ liệu để tìm kiếm 😢</p>';
    return;
  }

  const emojis = ['💫','✨','🌟','⭐','💕','🌸','💖'];
  let frame = 0, total = 30;
  area.innerHTML = `<div style="text-align:center;padding:20px 0"><div id="soul-loading" style="font-size:30px;animation:heartBeat 1s ease infinite">💘</div><p style="font-size:13px;color:var(--t3);margin-top:8px">Đang tìm kiếm...</p><p id="soul-scan" style="font-size:11px;color:var(--t4);margin-top:4px"> </p></div>`;
  const scanEl = $('soul-scan');

  const iv = setInterval(() => {
    frame++;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    if (scanEl) scanEl.textContent = `${emojis[frame%emojis.length]} Đang xét ${pick.hoTen}...`;
    if (frame >= total) clearInterval(iv);
  }, 55);

  setTimeout(() => {
    clearInterval(iv);
    const scored = candidates.map(s => ({ s, score: calcCompatScore(s1, s).score }));
    scored.sort((a,b) => b.score - a.score);
    const topN = Math.max(3, Math.floor(scored.length * 0.35));
    const pool = scored.slice(0, topN);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const s2   = pick.s;
    const compat = calcCompatScore(s1, s2);

    area.style.transition = 'opacity .25s';
    area.style.opacity = '0';
    setTimeout(() => {
      area.innerHTML = `
        <div class="soul-section" style="animation:revealSoul .45s cubic-bezier(.22,1,.36,1) both">
          <div class="soul-hdr"><span class="soul-hdr-ico">💘</span><span class="soul-hdr-title">Đã tìm thấy!</span><span class="soul-hdr-sub" style="color:#ff9ed4;font-weight:800">${compat.score}% ✨</span></div>
          <div class="soul-body">
            ${buildSoulMatePanel(s1, s2, compat)}
            <button class="soul-btn" style="margin-top:12px" onclick="app.findSoulMateAgain(${s1.stt})">Find someone else 🔄</button>
          </div>
        </div>`;
      area.style.opacity = '1';
      burstConfetti();
    }, 260);
  }, 1750);
}

export function findSoulMateAgain(stt) {
  const s1 = store.ALL.find(x => x.stt === stt);
  if (s1) findSoulMate(s1);
}

function burstConfetti() {
  const colors  = ['#ff6b9d','#ffd700','#ff9ff3','#ff1493','#c2185b','#fff'];
  const rect = document.body.getBoundingClientRect();
  const cx = rect.width / 2, cy = rect.height * 0.4;
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    el.className = 'xconf';
    el.style.cssText = `left:${cx-3}px;top:${cy-3}px;background:${colors[i%colors.length]};`;
    const angle = (Math.PI*2/22)*i;
    const dist  = 50 + Math.random()*80;
    el.animate([
      { transform:'translate(0,0) rotate(0deg) scale(1)', opacity:1 },
      { transform:`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) rotate(540deg) scale(0)`, opacity:0 }
    ], { duration:900+Math.random()*300, easing:'cubic-bezier(.17,.67,.42,1)', fill:'forwards' });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }
}

/* ── Print ───────────────────────────────── */
export function printStudent(stt) {
  const s = store.ALL.find(x => x.stt === stt);
  if (!s) return;
  const w = window.open('', '_blank', 'width=560,height=680');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${s.hoTen}</title>
  <style>body{font-family:sans-serif;padding:20px;font-size:13px;line-height:1.7}h2{color:#8b1a10;margin-bottom:12px}table{border-collapse:collapse;width:100%}td{padding:7px 11px;border:1px solid #ddd}td:first-child{font-weight:600;width:42%;background:#f9f6f0;color:#666}.ft{margin-top:16px;font-size:10.5px;color:#aaa}</style>
  </head><body><h2>${s.hoTen}</h2><table>
  <tr><td>Lớp</td><td>${s.lop||'–'}</td></tr>
  <tr><td>Ngày sinh</td><td>${s.ngaySinh||'–'}</td></tr>
  <tr><td>Giới tính</td><td>${s.gioiTinh||'–'}</td></tr>
  <tr><td>Thôn xóm</td><td>${s.thonXom||'–'}</td></tr>
  <tr><td>Xã/phường</td><td>${s.xaPhuongThuongTru||'–'}</td></tr>
  <tr><td>Quê quán</td><td>${s.queQuan||'–'}</td></tr>
  <tr><td>Tên bố</td><td>${s.tenBo||'–'}</td></tr>
  <tr><td>Nghề bố</td><td>${s.ngheNghiepBo||'–'}</td></tr>
  <tr><td>Tên mẹ</td><td>${s.tenMe||'–'}</td></tr>
  <tr><td>Nghề mẹ</td><td>${s.ngheNghiepMe||'–'}</td></tr>
  </table>
  <p class="ft">THPT Cẩm Bình · Năm học 2025–2026 · In ngày ${new Date().toLocaleDateString('vi')}</p>
  <script>window.print();<\/script></body></html>`);
  w.document.close();
}
