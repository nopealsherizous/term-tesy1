/* ══════════════════════════════════════════
   ROUTER — Hash-based SPA routing
═══════════════════════════════════════════ */

const routes = {};
let _current = null;

export function route(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return _current;
}

function resolve() {
  const hash = window.location.hash.slice(1) || '/';
  // Check exact match first
  if (routes[hash]) { _current = hash; routes[hash]({}); return; }
  // Check parameterized routes
  for (const pattern of Object.keys(routes)) {
    const paramNames = [];
    const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const regex = new RegExp(`^${regexStr}$`);
    const match = hash.match(regex);
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => { params[name] = decodeURIComponent(match[i + 1]); });
      _current = pattern;
      routes[pattern](params);
      return;
    }
  }
  // Default to home
  if (routes['/']) { _current = '/'; routes['/']({}); }
}

export function initRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}
