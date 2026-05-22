import { useEffect } from 'react';
import { api } from '../services/api';
import { getRole, getSessionLabel, getToken, setSession } from '../services/auth';

const REFRESH_INTERVAL_MS = 45 * 60 * 1000;

function refreshPath(role: string) {
  if (role === 'admin') return '/admin/refresh';
  if (role === 'professor') return '/professor/refresh';
  if (role === 'aluno') return '/aluno/refresh';
  return null;
}

/** Renova JWT periodicamente enquanto o usuário está logado. */
export function useTokenRefresh() {
  useEffect(() => {
    const role = getRole();
    const token = getToken();
    const path = role ? refreshPath(role) : null;
    if (!path || !token) return;

    async function refresh() {
      try {
        const res = await api.post<{ token?: string }>(path!, {});
        if (res.token && role) setSession(res.token, role, getSessionLabel() ?? undefined);
      } catch {
        /* sessão expirada — ProtectedRoute redireciona no próximo request */
      }
    }

    const id = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);
}
