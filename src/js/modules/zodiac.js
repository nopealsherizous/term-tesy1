/* ══════════════════════════════════════════
   ZODIAC Module
═══════════════════════════════════════════ */
export const ZODIAC_SIGNS = [
  { name:'Bạch Dương', en:'Aries',       emoji:'♈', start:[3,21], end:[4,19],  element:'Lửa',  ruling:'Hỏa tinh',           trait:'Năng động, dũng cảm, tự tin, bốc đồng' },
  { name:'Kim Ngưu',   en:'Taurus',      emoji:'♉', start:[4,20], end:[5,20],  element:'Đất',  ruling:'Kim tinh',            trait:'Kiên nhẫn, đáng tin, hướng vật chất, bướng bỉnh' },
  { name:'Song Tử',    en:'Gemini',      emoji:'♊', start:[5,21], end:[6,20],  element:'Khí',  ruling:'Thủy tinh',           trait:'Linh hoạt, tò mò, hòa đồng, khó lường' },
  { name:'Cự Giải',    en:'Cancer',      emoji:'♋', start:[6,21], end:[7,22],  element:'Nước', ruling:'Mặt trăng',           trait:'Nhạy cảm, trực giác, gia đình, hay lo âu' },
  { name:'Sư Tử',      en:'Leo',         emoji:'♌', start:[7,23], end:[8,22],  element:'Lửa',  ruling:'Mặt trời',            trait:'Tự hào, lãnh đạo, nhiệt huyết, thích chú ý' },
  { name:'Xử Nữ',      en:'Virgo',       emoji:'♍', start:[8,23], end:[9,22],  element:'Đất',  ruling:'Thủy tinh',           trait:'Tỉ mỉ, phân tích, thực dụng, cầu toàn' },
  { name:'Thiên Bình', en:'Libra',       emoji:'♎', start:[9,23], end:[10,22], element:'Khí',  ruling:'Kim tinh',            trait:'Hòa hợp, công bằng, quyến rũ, do dự' },
  { name:'Bọ Cạp',     en:'Scorpio',     emoji:'♏', start:[10,23],end:[11,21], element:'Nước', ruling:'Diêm vương tinh',     trait:'Sâu sắc, bí ẩn, đam mê, ghen tuông' },
  { name:'Nhân Mã',    en:'Sagittarius', emoji:'♐', start:[11,22],end:[12,21], element:'Lửa',  ruling:'Mộc tinh',            trait:'Phiêu lưu, lạc quan, triết học, bất cẩn' },
  { name:'Ma Kết',     en:'Capricorn',   emoji:'♑', start:[12,22],end:[1,19],  element:'Đất',  ruling:'Thổ tinh',            trait:'Kỷ luật, tham vọng, thực tế, lạnh lùng' },
  { name:'Bảo Bình',   en:'Aquarius',    emoji:'♒', start:[1,20], end:[2,18],  element:'Khí',  ruling:'Thiên vương tinh',    trait:'Sáng tạo, nhân đạo, độc lập, xa cách' },
  { name:'Song Ngư',   en:'Pisces',      emoji:'♓', start:[2,19], end:[3,20],  element:'Nước', ruling:'Hải vương tinh',      trait:'Mơ mộng, đồng cảm, nghệ thuật, dễ bị tổn thương' },
];

export const COMPAT = {
  0:[5,8,11], 1:[6,9,0],  2:[7,10,1], 3:[8,11,2],
  4:[9,0,3],  5:[10,1,4], 6:[11,2,5], 7:[0,3,6],
  8:[1,4,7],  9:[2,5,8],  10:[3,6,9], 11:[4,7,10],
};

export const LUCKY_COLORS = [['Đỏ','Cam'],['Xanh lá','Hồng'],['Vàng','Xanh'],['Trắng','Kem'],['Vàng','Cam'],['Xám','Xanh lá'],['Hồng','Xanh'],['Đen','Đỏ'],['Tím','Xanh'],['Nâu','Xám'],['Bạc','Xanh'],['Biển','Tím']];
export const LUCKY_NUM   = [[1,9],[2,6],[3,5],[2,7],[1,3,10],[5,14],[4,6,13],[8,11],[3,7],[6,9,8],[4,7,11],[3,9,12]];

export function getZodiac(dd, mm) {
  for (let i = 0; i < ZODIAC_SIGNS.length; i++) {
    const z = ZODIAC_SIGNS[i];
    const [sm, sd] = z.start, [em, ed] = z.end;
    if (sm > em) {
      if ((mm === sm && dd >= sd) || (mm === em && dd <= ed)) return { idx: i, ...z };
    } else {
      if ((mm === sm && dd >= sd) || (mm > sm && mm < em) || (mm === em && dd <= ed)) return { idx: i, ...z };
    }
  }
  return { idx: 11, ...ZODIAC_SIGNS[11] };
}

export function getLuckyInfo(zodiacIdx) {
  return {
    colors: LUCKY_COLORS[zodiacIdx] || ['Đỏ','Vàng'],
    nums:   LUCKY_NUM[zodiacIdx] || [7,9]
  };
}

export const PERSONALITIES = {
  0: 'Nhiệt huyết và can đảm, luôn tiên phong trong mọi việc. Thích thử thách và không ngại khó khăn.',
  1: 'Kiên nhẫn và đáng tin cậy, biết tận hưởng cuộc sống. Thích sự ổn định và những điều đẹp đẽ.',
  2: 'Thông minh và linh hoạt, dễ thích nghi với mọi hoàn cảnh. Tò mò và luôn tìm kiếm điều mới.',
  3: 'Nhạy cảm và chu đáo, yêu gia đình hết mực. Trực giác tốt và hiểu tâm lý người khác.',
  4: 'Tự tin và lãnh đạo thiên bẩm, thu hút mọi ánh nhìn. Hào phóng và trung thành với người thân.',
  5: 'Cẩn thận và phân tích mọi thứ kỹ lưỡng. Thực dụng, chăm chỉ và luôn muốn hoàn hảo.',
  6: 'Quyến rũ và hài hòa trong mọi mối quan hệ. Công bằng, yêu cái đẹp và không thích xung đột.',
  7: 'Bí ẩn và sâu sắc, có khả năng nhìn thấu tâm can người khác. Đam mê và quyết đoán.',
  8: 'Lạc quan và yêu tự do, thích khám phá chân trời mới. Triết học và hài hước.',
  9: 'Kỷ luật và tham vọng, luôn hướng đến mục tiêu. Thực tế và có trách nhiệm cao.',
  10:'Sáng tạo và nhân đạo, đi trước thời đại. Độc lập và có tư tưởng đổi mới.',
  11:'Mơ mộng và đồng cảm, có tâm hồn nghệ sĩ. Nhạy cảm và thường nghĩ cho người khác.',
};
