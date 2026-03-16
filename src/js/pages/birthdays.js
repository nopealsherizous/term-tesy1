/* ══════════════════════════════════════════
   BIRTHDAYS Page
═══════════════════════════════════════════ */
import { store } from '../core/store.js';
import { MONTH_NAMES } from '../utils/date.js';

const $ = id => document.getElementById(id);

export function renderBirthdays() {
  const el = $('viewBirthdays');
  if (!el) return;
  const now    = new Date();
  const curMon = now.getMonth() + 1;
  const curDay = now.getDate();

  // Group by month
  const byMonth = {};
  for (let m = 1; m <= 12; m++) byMonth[m] = [];
  store.ALL.forEach(s => {
    const p = (s.ngaySinh || '').split('/');
    if (p.length < 2) return;
    const m = parseInt(p[1]);
    if (m >= 1 && m <= 12) byMonth[m].push(s);
  });
  // Sort each month by day
  Object.values(byMonth).forEach(arr => arr.sort((a,b) => {
    const pa = a.ngaySinh.split('/'), pb = b.ngaySinh.split('/');
    return parseInt(pa[0]) - parseInt(pb[0]);
  }));

  // Months ordered starting from current
  const monthOrder = [];
  for (let i = 0; i < 12; i++) monthOrder.push(((curMon - 1 + i) % 12) + 1);

  let html = '<div class="bd-month-grid">';
  monthOrder.forEach(m => {
    const students = byMonth[m];
    if (!students.length) return;
    const isCurrentMonth = m === curMon;
    html += `<div class="bd-month-section">
      <div class="bd-month-hdr" style="${isCurrentMonth ? 'color:var(--red)' : ''}">
        ${isCurrentMonth ? '📅 ' : ''}${MONTH_NAMES[m-1]} · ${students.length} học sinh${isCurrentMonth ? ' (tháng này)' : ''}
      </div>
      <div class="bd-cards">
        ${students.map(s => {
          const p = s.ngaySinh.split('/');
          const isToday = parseInt(p[0]) === curDay && m === curMon;
          return `<div class="bd-card${isToday ? ' bd-today' : ''}" onclick="app.showDetail(${s.stt})">
            ${isToday ? '<div class="bd-today-badge">🎂 Hôm nay!</div>' : ''}
            <div class="bd-card-name">${s.hoTen}</div>
            <div class="bd-card-date">${s.ngaySinh || ''}</div>
            <div class="bd-card-lop"><span class="b b${s.lop?.substring(0,2)||''}" style="font-size:10px">${s.lop||''}</span></div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}
