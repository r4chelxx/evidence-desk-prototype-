const CONFIG_KEY = 'evidence-desk-lai-service-v1';
export const DEFAULT_SERVICE_URL = 'https://evidence-desk-lai.onrender.com';
let sessionToken = '';

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
  window.localStorage.setItem(CONFIG_KEY, url);
  sessionToken = '';
  return url;
}

export function disconnectService() { sessionToken = ''; }

export async function serviceFetch(action, options = {}) {
  if (!['status', 'login', 'analyze', 'extract'].includes(action)) throw new Error('Invalid endpoint');
  const headers = { ...options.headers };
  if (sessionToken && action !== 'login') headers.Authorization = `Bearer ${sessionToken}`;
  const response = await fetch(`${getServiceUrl()}/api/lai/${action}`, {
    ...options, headers, credentials: 'omit', redirect: 'error',
  });
  if (response.status === 401) sessionToken = '';
  return response;
}

export async function connectService(password) {
  const response = await serviceFetch('login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }), signal: AbortSignal.timeout(10000),
  });
  const result = await response.json();
  if (!response.ok || typeof result.token !== 'string') throw new Error('Não foi possível entrar no serviço. Confira a senha e tente novamente.');
  sessionToken = result.token; // Memory only: no password or access token in browser storage.
}
