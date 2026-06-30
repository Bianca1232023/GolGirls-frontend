import { useState } from 'react';
import { api } from '../services/api';
import { setSession, type UserRole } from '../services/auth';

interface LoginParams {
  role: UserRole;
  value: string;
  password?: string;
}

interface UseAuthReturn {
  loading: boolean;
  serverError: string | null;
  login: (params: LoginParams) => Promise<string | null>;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const login = async ({ role, value, password }: LoginParams): Promise<string | null> => {
    setLoading(true);
    setServerError(null);

    try {
      let token: string | null = null;
      let label: string | undefined;

      if (role === 'aluno') {
        const res = await api.post<{ token?: string; message?: string }>('/aluno/login', {
          matricula: value.trim(),
          password,
        });
        token = res.token ?? null;
        label = value.trim();
      } else if (role === 'professor') {
        const res = await api.post<{ token?: string }>('/professor/login', {
          email: value.trim(),
          password,
        });
        token = res.token ?? null;
        label = value.trim();
      } else if (role === 'admin') {
        const res = await api.post<{ token?: string }>('/admin/login', {
          email: value.trim(),
          password,
        });
        token = res.token ?? null;
        label = value.trim();
      }

      if (token) {
        setSession(token, role, label);
      }

      return token;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao conectar com o servidor';
      setServerError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, serverError, login };
}
