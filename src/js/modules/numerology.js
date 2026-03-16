/* ══════════════════════════════════════════
   NUMEROLOGY Module
═══════════════════════════════════════════ */
export const NUM_MEANINGS = {
  1:  { name:'Số 1 — Lãnh đạo',   desc:'Độc lập, tiên phong, ý chí mạnh. Sinh ra để dẫn đường.', color:'#ffd700' },
  2:  { name:'Số 2 — Hợp tác',    desc:'Nhạy cảm, hòa giải, có trực giác. Giỏi kết nối con người.', color:'#ff9ed4' },
  3:  { name:'Số 3 — Sáng tạo',   desc:'Tài năng biểu đạt, lạc quan, hài hước. Truyền cảm hứng.', color:'#48dbfb' },
  4:  { name:'Số 4 — Ổn định',    desc:'Thực dụng, chăm chỉ, đáng tin cậy. Xây dựng nền tảng vững chắc.', color:'#6ab04c' },
  5:  { name:'Số 5 — Tự do',      desc:'Thích phiêu lưu, linh hoạt, tò mò. Sống động và khó đoán.', color:'#ff9f43' },
  6:  { name:'Số 6 — Chăm sóc',   desc:'Có trách nhiệm, yêu thương, tận tụy. Trụ cột gia đình.', color:'#ff6b9d' },
  7:  { name:'Số 7 — Tâm linh',   desc:'Phân tích, bí ẩn, tìm kiếm chân lý. Tư duy sâu sắc.', color:'#a29bfe' },
  8:  { name:'Số 8 — Quyền năng', desc:'Tham vọng, thực tế, tài quản lý. Hướng đến thành công vật chất.', color:'#fdcb6e' },
  9:  { name:'Số 9 — Nhân đạo',   desc:'Cao thượng, tha thứ, tầm nhìn rộng. Phục vụ nhân loại.', color:'#e17055' },
  11: { name:'Số 11 — Linh giác', desc:'Số chủ: trực giác cực nhạy, truyền cảm hứng tâm linh.', color:'#c8d6e5' },
  22: { name:'Số 22 — Bậc thầy',  desc:'Số chủ: xây dựng điều vĩ đại, biến giấc mơ thành hiện thực.', color:'#f9ca24' },
  33: { name:'Số 33 — Giác ngộ',  desc:'Số chủ hiếm nhất: thầy tâm linh, chữa lành và nâng đỡ.', color:'#6c5ce7' },
};

function reduce(n) {
  if (n === 11 || n === 22 || n === 33) return n;
  let s = n;
  while (s > 9) {
    s = String(s).split('').reduce((a, c) => a + parseInt(c), 0);
    if (s === 11 || s === 22 || s === 33) return s;
  }
  return s;
}

export function calcNumerology(bd) {
  if (!bd) return null;
  const { d, m, y } = bd;
  const life  = reduce(d + m + [...String(y)].reduce((a, c) => a + parseInt(c), 0));
  const birth = reduce(d);
  const expr  = reduce(m + d);
  const soul  = reduce([...String(y)].reduce((a, c) => a + parseInt(c), 0));
  return { life, birth, expr, soul };
}
