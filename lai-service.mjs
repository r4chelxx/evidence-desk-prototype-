const CONFIG_KEY = 'evidence-desk-lai-service-v1';
const SESSION_KEY = 'evidence-desk-lai-session-v1';
export const DEFAULT_SERVICE_URL = 'https://evidence-desk-lai.onrender.com';
let sessionToken = '';

function savedSession() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null');
    if (saved?.url === getServiceUrl() && saved.expiresAt > Date.now() && typeof saved.token === 'string') return saved.token;
    window.localStorage.removeItem(SESSION_KEY);
  } catch { return sessionToken; /* Storage may be unavailable in private browsing. */ }
  return '';
}

export function normalizeServiceUrl(value) {
  if (!value?.trim()) return '';
  const url = new URL(value.trim());
  const loopback = ['localhost', '127.0.0.1'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) ||
      url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('Use a URL HTTPS, sem caminho, credenciais ou parâmetros.');
  }
  return url.origin;
}

export function getServiceUrl() {
  try {
    const configured = window.localStorage.getItem(CONFIG_KEY);
    if (configured?.trim()) return normalizeServiceUrl(configured);
    return window.location?.origin === 'https://r4chelxx.github.io' ? DEFAULT_SERVICE_URL : '';
  } catch { return ''; }
}

export function configureService(value) {
  const url = normalizeServiceUrl(value);
  if (url !== getServiceUrl()) disconnectService();
  window.localStorage.setItem(CONFIG_KEY, url);
  return url;
}

export function disconnectService() {
  sessionToken = '';
  try { window.localStorage.removeItem(SESSION_KEY); } catch { /* No stored session. */ }
}

export async function serviceFetch(action, options = {}) {
  if (!['status', 'login', 'analyze', 'extract'].includes(action)) throw new Error('Invalid endpoint');
  const headers = { ...options.headers };
  sessionToken = savedSession();
  if (sessionToken && action !== 'login') headers.Authorization = `Bearer ${sessionToken}`;
  const response = await fetch(`${getServiceUrl()}/api/lai/${action}`, {
    ...options, headers, credentials: 'omit', redirect: 'error',
  });
  if (response.status === 401) disconnectService();
  return response;
}

export async function connectService(password) {
  const response = await serviceFetch('login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }), signal: AbortSignal.timeout(10000),
  });
  const result = await response.json();
  if (!response.ok || typeof result.token !== 'string') throw new Error('Não foi possível entrar no serviço. Confira a senha e tente novamente.');
  sessionToken = result.token;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({ url: getServiceUrl(), token: sessionToken,
      expiresAt: Date.now() + Math.min(Number(result.expiresIn) || 3600, 30 * 86400) * 1000 }));
  } catch { /* Continue in memory when storage is unavailable. */ }
}
