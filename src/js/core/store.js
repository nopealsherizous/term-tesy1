/* ══════════════════════════════════════════
   STORE — Global application state
═══════════════════════════════════════════ */
export const store = {
  ALL: [],          // all students (public data)
  filtered: [],     // current filtered list
  page: 1,
  tab: 'table',     // table|card|class|stats
  sField: 'stt',
  sDir: 1,
  density: 'dense',
  meta: null,
  news: [],
  classes: [],
  _debounce: null,
  _sugIdx: -1,
};
