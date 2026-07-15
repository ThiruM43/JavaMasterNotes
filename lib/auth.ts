// Target SHA-256 hashes of the default credentials
const HASH_USER = 'a8f7a4b3a9d6f894e81aa36407adc0d19e0b6fa7594fc2b4df0ca6ccaf7036fa';
const HASH_PASS = '526e7b18a94770e43ead7d9579278d7bf8ebaf6bc318c7da3fad263cdc3b4e05';
const HASH_KEY  = 'ca9605095fbf730ede960241811a993fab29419723b60311385fe1cd781aa4e0';

const TOKEN_KEY = 'java-notes-auth-token';
const CACHE_KEY = 'java-notes-auth-cache';

export async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyCredentials(u: string, p: string, k: string): Promise<boolean> {
  const hu = await sha256(u.trim());
  const hp = await sha256(p.trim());
  const hk = await sha256(k.trim());
  return hu === HASH_USER && hp === HASH_PASS && hk === HASH_KEY;
}

export interface AuthSession {
  accessToken: string;
  username: string;
  expiresAt: number; // timestamp in ms (30 mins from login)
}

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(username: string, rememberMe: boolean): AuthSession {
  const session: AuthSession = {
    accessToken: `tok_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    username,
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 mins validity
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
    if (rememberMe) {
      // Store encrypted cache token in local storage so user can login again with a click
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        username,
        cachedHash: HASH_USER + '.' + HASH_PASS.slice(0, 16),
        updatedAt: Date.now()
      }));
    }
  }
  return session;
}

export function getRememberedCache(): { username: string; cachedHash: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loginWithCache(): AuthSession | null {
  const cache = getRememberedCache();
  if (!cache || !cache.username) return null;
  // Issue a fresh 30-min access token
  return saveSession(cache.username, true);
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearAllAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CACHE_KEY);
  }
}
