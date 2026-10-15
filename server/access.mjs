import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

function equal(a, b) {
  const left = createHmac('sha256', 'comparison').update(a).digest();
  const right = createHmac('sha256', 'comparison').update(b).digest();
  return timingSafeEqual(left, right);
}

export function createAccess({ mode = 'local', password = '', secret = '', origins = [], now = Date.now }) {
  const hosted = mode === 'hosted';
  if (!['local', 'hosted'].includes(mode)) throw new Error('Invalid service mode');
  if (hosted && (password.length < 16 || secret.length < 32 || !origins.length ||
      origins.some(origin => { try { return new URL(origin).origin !== origin || !origin.startsWith('https://'); } catch { return true; } }))) {
    throw new Error('Hosted mode requires a password (16+ characters), session secret (32+) and exact HTTPS origins.');
  }
  const counters = new Map();
  function limit(key, max, windowMs) {
    const time = now();
    let counter = counters.get(key);
    if (!counter || time >= counter.start + windowMs) {
      counter = { start: time, count: 0 }; counters.set(key, counter);
    }
    if (counter.count >= max) return false;
    counter.count += 1; return true;
  }
  return {
    hosted,
    allowsOrigin: origin => hosted ? origins.includes(origin) : true,
    login(candidate) {
      if (!limit('login', 5, 60000)) throw new Error('RATE_LIMIT');
      if (typeof candidate !== 'string' || !equal(candidate, password)) throw new Error('UNAUTHORIZED');
      const payload = Buffer.from(JSON.stringify({ exp: now() + 30 * 86400000, nonce: randomBytes(16).toString('hex') })).toString('base64url');
      const signature = createHmac('sha256', secret).update(payload).digest('base64url');
      return `${payload}.${signature}`;
    },
    authorized(header) {
      if (!hosted) return true;
      if (typeof header !== 'string' || !header.startsWith('Bearer ') || header.length > 1000) return false;
      const token = header.slice(7), parts = token.split('.');
      if (parts.length !== 2) return false;
      const signature = createHmac('sha256', secret).update(parts[0]).digest('base64url');
      if (!equal(parts[1], signature)) return false;
      try { return JSON.parse(Buffer.from(parts[0], 'base64url').toString()).exp > now(); } catch { return false; }
    },
    // Limits are per process, across sessions; signing in again does not reset them.
    allowAnalysis: () => limit('analysis-hour', 20, 3600000) && limit('analysis-day', 50, 86400000),
    allowPdf: () => limit('pdf', 30, 3600000),
  };
}
