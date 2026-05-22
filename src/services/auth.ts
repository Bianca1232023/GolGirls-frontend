export type UserRole = 'aluno' | 'professor' | 'admin';

const TOKEN_KEY = 'gg_token';
const ROLE_KEY = 'gg_role';
const SESSION_LABEL_KEY = 'gg_session_label';
const LGPD_CONSENT_KEY = 'gg_lgpd_consent_v1';

/** sessionStorage reduz persistência do token entre sessões do navegador (mitigação XSS). */
function storage(): Storage {
  return sessionStorage;
}

export function getToken(): string | null {
  return storage().getItem(TOKEN_KEY);
}

export function getRole(): UserRole | null {
  const role = storage().getItem(ROLE_KEY);
  if (role === 'aluno' || role === 'professor' || role === 'admin') return role;
  return null;
}

export function getSessionLabel(): string | null {
  return storage().getItem(SESSION_LABEL_KEY);
}

export function setSession(token: string, role: UserRole, label?: string): void {
  storage().setItem(TOKEN_KEY, token);
  storage().setItem(ROLE_KEY, role);
  if (label) storage().setItem(SESSION_LABEL_KEY, label);
}

export function clearSession(): void {
  storage().removeItem(TOKEN_KEY);
  storage().removeItem(ROLE_KEY);
  storage().removeItem(SESSION_LABEL_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken() && getRole());
}

export function hasLgpdConsent(): boolean {
  return localStorage.getItem(LGPD_CONSENT_KEY) === '1';
}

export const LGPD_CONSENT_EVENT = 'gg-lgpd-consent';

export function setLgpdConsent(): void {
  localStorage.setItem(LGPD_CONSENT_KEY, '1');
  window.dispatchEvent(new Event(LGPD_CONSENT_EVENT));
}

export function logout(): void {
  clearSession();
}
