/* ══════════════════════════════════════════
   DATE Utils
═══════════════════════════════════════════ */
export function parseBirthDate(ngaySinh) {
  if (!ngaySinh) return null;
  const parts = ngaySinh.split('/');
  if (parts.length < 3) return null;
  const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  return { d, m, y };
}

export function isBirthdayToday(ngaySinh) {
  const bd = parseBirthDate(ngaySinh);
  if (!bd) return false;
  const today = new Date();
  return bd.d === today.getDate() && bd.m === (today.getMonth() + 1);
}

export function getBirthdayThisMonth(ngaySinh) {
  const bd = parseBirthDate(ngaySinh);
  if (!bd) return false;
  return bd.m === (new Date().getMonth() + 1);
}

export function daysUntilBirthday(ngaySinh) {
  const bd = parseBirthDate(ngaySinh);
  if (!bd) return null;
  const now = new Date();
  const thisYear = now.getFullYear();
  let next = new Date(thisYear, bd.m - 1, bd.d);
  if (next < now) next = new Date(thisYear + 1, bd.m - 1, bd.d);
  const diff = Math.round((next - now) / (1000 * 60 * 60 * 24));
  return diff;
}

export function formatDate(ngaySinh) {
  const bd = parseBirthDate(ngaySinh);
  if (!bd) return ngaySinh || '';
  const months = ['tháng 1','tháng 2','tháng 3','tháng 4','tháng 5','tháng 6','tháng 7','tháng 8','tháng 9','tháng 10','tháng 11','tháng 12'];
  return `${bd.d} ${months[bd.m - 1]}, ${bd.y}`;
}

export const MONTH_NAMES = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
