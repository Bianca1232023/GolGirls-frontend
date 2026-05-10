const BASE_URL = 'http://localhost:3001';

interface ApiResponse<T = unknown> {
    status: number;
    message?: string;
    token?: string;
    data?: T;
    invites?: T;
}

function authHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Erro inesperado');
    }

    return data;
}

export const api = {
    post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    get: <T>(path: string) =>
        request<T>(path, { method: 'GET' }),
    delete: <T>(path: string) =>
        request<T>(path, { method: 'DELETE' }),
};
