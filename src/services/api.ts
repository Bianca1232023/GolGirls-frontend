import { clearSession, getToken } from './auth';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface ApiResponse<T = unknown> {
  status: number;
  message?: string;
  token?: string;
  data?: T;
  invites?: T;
  [key: string]: unknown;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options?.headers },
    ...options,
  });

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    data = { status: response.status, message: 'Resposta inválida do servidor' };
  }

  if (response.status === 401 || response.status === 403) {
    if (getToken()) clearSession();
  }

  if (!response.ok) {
    throw new Error(data.message || 'Erro inesperado');
  }

  return data;
}

export const api = {
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { BASE_URL };
