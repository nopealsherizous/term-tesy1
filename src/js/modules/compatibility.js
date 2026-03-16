/* ══════════════════════════════════════════
   COMPATIBILITY Module
═══════════════════════════════════════════ */
import { getZodiac, COMPAT } from './zodiac.js';
import { parseBirthDate } from '../utils/date.js';

export function calcCompatScore(s1, s2) {
  const bd1 = parseBirthDate(s1.ngaySinh);
  const bd2 = parseBirthDate(s2.ngaySinh);
  if (!bd1 || !bd2) {
    const fallback = 50 + ((s1.stt * 7 + s2.stt * 13) % 50);
    return { score: fallback, tags: ['Chờ duyên 🌙'], verdict: 'Hai tâm hồn chưa rõ ngày sinh nhưng cơ duyên vẫn chờ đợi...', z1: null, z2: null };
  }
  const z1 = getZodiac(bd1.d, bd1.m);
  const z2 = getZodiac(bd2.d, bd2.m);
  const bestFor1 = COMPAT[z1.idx] || [];
  const isIdeal  = bestFor1.includes(z2.idx);
  const sameElem = z1.element === z2.element;

  const numer = n => [...String(n)].reduce((a,c) => a + parseInt(c||0), 0);
  const n1 = numer(bd1.d + bd1.m + bd1.y);
  const n2 = numer(bd2.d + bd2.m + bd2.y);
  const numBonus = Math.abs(n1 - n2) < 3 ? 8 : 0;

  const base = isIdeal ? 82 : sameElem ? 72 : 55;
  const seed = (s1.stt * 7 + s2.stt * 13) % 17;
  const score = Math.max(50, Math.min(99, base + seed + numBonus));

  const tags = [];
  if (isIdeal)    tags.push('Cung hợp nhau 💫');
  if (sameElem)   tags.push(`Đồng nguyên ${z1.element} 🌊`);
  if (numBonus)   tags.push('Số mệnh tương đồng ✨');
  if (score >= 90) tags.push('Mối duyên thiên định 🔮');
  else if (score >= 80) tags.push('Tương hợp cao 💖');
  else if (score >= 65) tags.push('Có duyên gặp gỡ 🌸');
  else tags.push('Cần thêm thời gian 🌱');

  const VERDICTS = [
    `${z1.emoji}${z1.name} và ${z2.emoji}${z2.name} là cặp đôi trời sinh! Hai tâm hồn này bổ sung hoàn hảo cho nhau.`,
    `Sự kết hợp giữa ${z1.name} và ${z2.name} tạo nên năng lượng hài hòa, đầy tiềm năng phát triển.`,
    `${z1.emoji} và ${z2.emoji} cùng nhau có thể tạo nên điều kỳ diệu. Hãy trân trọng mối duyên này!`,
    `${z1.name} mang lại sự cân bằng cho ${z2.name}, và ngược lại. Một mối quan hệ đầy triển vọng.`,
  ];
  const vIdx = (s1.stt + s2.stt) % VERDICTS.length;
  return { score, tags, verdict: VERDICTS[vIdx], z1, z2 };
}

export function buildSoulMatePanel(s1, s2, compat) {
  const scoreColor = compat.score >= 85 ? '#e91e63' : compat.score >= 70 ? '#ff9800' : '#9e9e9e';
  return `
    <div class="soulmate-card">
      <div class="sm-names">
        <span class="sm-name">${s1.hoTen}</span>
        <span class="sm-heart">💘</span>
        <span class="sm-name">${s2.hoTen}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div class="sm-score-bar" style="flex:1">
          <div class="sm-score-fill" style="width:${compat.score}%;background:linear-gradient(90deg,${scoreColor},#ff6b6b)"></div>
        </div>
        <strong style="font-family:'Lexend Deca',sans-serif;font-size:18px;font-weight:900;color:${scoreColor}">${compat.score}%</strong>
      </div>
      <div class="sm-tags">${compat.tags.map(t=>`<span class="sm-tag">${t}</span>`).join('')}</div>
      <div class="sm-verdict" style="margin-top:8px">${compat.verdict}</div>
      <div style="display:flex;gap:4px;margin-top:10px;flex-wrap:wrap">
        ${compat.z1 ? `<span style="padding:2px 8px;border-radius:100px;background:rgba(120,40,200,.1);color:#a855f7;font-size:11px;font-weight:600">${compat.z1.emoji} ${compat.z1.name}</span>` : ''}
        ${compat.z2 ? `<span style="padding:2px 8px;border-radius:100px;background:rgba(120,40,200,.1);color:#a855f7;font-size:11px;font-weight:600">${compat.z2.emoji} ${compat.z2.name}</span>` : ''}
      </div>
    </div>`;
}
