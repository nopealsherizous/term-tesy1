/* ══════════════════════════════════════════
   MENH (Ngũ Hành) + CHI YEAR Module
═══════════════════════════════════════════ */
export const MENH_MAP = {
  0: { name:'Canh - Kim', icon:'⚙️', desc:'Kim – Cứng rắn, sắc sảo, có bản lĩnh' },
  1: { name:'Thủy',       icon:'💧', desc:'Thủy – Linh hoạt, thích nghi, nhạy cảm' },
  2: { name:'Mộc',        icon:'🌿', desc:'Mộc – Phát triển, sáng tạo, nhân từ' },
  3: { name:'Hỏa',        icon:'🔥', desc:'Hỏa – Nhiệt huyết, đam mê, lãnh đạo' },
  4: { name:'Thổ',        icon:'⛰️', desc:'Thổ – Vững chắc, trung thực, kiên trì' },
};

export function getMenh(year) {
  const y = parseInt(year) || 2009;
  const r = ((y % 10) + (Math.floor(y / 10) % 10)) % 5;
  return MENH_MAP[r] || MENH_MAP[0];
}

const CHI      = ['Thân','Dậu','Tuất','Hợi','Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi'];
const CHI_ICON = ['🐒','🐓','🐕','🐷','🐭','🐮','🐯','🐰','🐲','🐍','🐴','🐑'];

export function getChiYear(year) {
  const y = parseInt(year) || 2009;
  const idx = (y - 2016 + 1200) % 12;
  return { chi: CHI[idx], icon: CHI_ICON[idx] };
}
