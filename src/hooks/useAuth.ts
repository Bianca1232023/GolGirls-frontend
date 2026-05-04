import { useState } from 'react';
import { api } from '../services/api';

type Role = 'aluno' | 'professor' | 'admin';

interface LoginParams {
    role: Role;
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

            if (role === 'aluno') {
                const res = await api.post<never>('/aluno/login', { matricula: value });
                token = res.token ?? null;
            } else if (role === 'professor') {
                const res = await api.post<never>('/professor/login', { email: value, password });
                token = res.token ?? null;
            } else if (role === 'admin') {
                const res = await api.post<never>('/admin/login', { email: value, password });
                token = res.token ?? null;
            }

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
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
