/* ══════════════════════════════════════════
   SEARCH Utils — diacritics, match, suggest
═══════════════════════════════════════════ */
export function stripDiacritics(s) {
  if (!s) return '';
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, c => c === 'đ' ? 'd' : 'D')
    .toLowerCase();
}

export function buildIndex(s) {
  const norm = stripDiacritics;
  const nameParts = String(s.hoTen || '').trim().split(/\s+/);
  s._nameTokens = nameParts.map(norm);
  s._lastWord   = s._nameTokens[s._nameTokens.length - 1] || '';
  s._nameFull   = norm(s.hoTen);
  // For public data, we don't index CMND/SDT (those are private)
  s._addrIdx    = norm((s.thonXom || '') + (s.xaPhuongThuongTru || '') + (s.queQuan || ''));
}

export function isNumQuery(q) { return /^\d+$/.test(q); }

export function matchSearch(s, normQ) {
  if (!normQ) return true;
  const qTokens = normQ.split(/\s+/).filter(Boolean);
  if (qTokens.length > 1) {
    return qTokens.every(qt => s._nameTokens.some(nt => nt.startsWith(qt)));
  }
  if (s._lastWord.startsWith(normQ)) return true;
  return s._nameTokens.some(nt => nt.startsWith(normQ));
}

export function matchScore(s, normQ) {
  if (!normQ) return 0;
  if (s._lastWord.startsWith(normQ)) return 3;
  if (s._lastWord.includes(normQ)) return 2;
  if (s._nameTokens.some(nt => nt.startsWith(normQ))) return 1;
  if (s._nameTokens.some(nt => nt.includes(normQ))) return 0.5;
  return 0;
}

export function getSimilar(normQ, exclude, ALL) {
  const exSet = new Set(exclude.map(s => s.stt));
  const first2 = normQ.slice(0, 2);
  const first1 = normQ.slice(0, 1);
  const scored = [];
  for (const s of ALL) {
    if (exSet.has(s.stt)) continue;
    if (s._lastWord.startsWith(first2) || (normQ.length >= 2 && s._lastWord.includes(first1))) {
      scored.push({ s, sc: s._lastWord.startsWith(first2) ? 2 : 1 });
    }
  }
  scored.sort((a, b) => b.sc - a.sc);
  return scored.slice(0, 5).map(x => x.s);
}

export function getSuggestions(rawQ, ALL) {
  if (!rawQ || rawQ.length < 1) return { main: [], similar: [] };
  const normQ = stripDiacritics(rawQ.trim());
  if (isNumQuery(normQ)) return { main: [], similar: [] };
  const seen = new Set();
  const scored = [];
  for (const s of ALL) {
    if (!matchSearch(s, normQ)) continue;
    const key = s.lop + ':' + s.hoTen;
    if (seen.has(key)) continue;
    seen.add(key);
    scored.push({ s, sc: matchScore(s, normQ) });
  }
  scored.sort((a, b) => b.sc - a.sc);
  const main = scored.slice(0, 7).map(x => x.s);
  if (main.length < 3 && normQ.length >= 2) {
    return { main, similar: getSimilar(normQ, main, ALL) };
  }
  return { main, similar: [] };
}

export function hlName(fullName, normQ) {
  if (!fullName || !normQ) return fullName || '';
  const str = String(fullName);
  const parts = str.split(/(\s+)/);
  const qTokens = normQ.split(/\s+/).filter(Boolean);
  const normParts = parts.map(p => stripDiacritics(p));
  return parts.map((part, i) => {
    if (!part.trim()) return part;
    const normPart = normParts[i];
    const qt = qTokens.find(qt => normPart.startsWith(qt));
    if (!qt) return part;
    return `<mark>${part.slice(0, qt.length)}</mark>${part.slice(qt.length)}`;
  }).join('');
}
