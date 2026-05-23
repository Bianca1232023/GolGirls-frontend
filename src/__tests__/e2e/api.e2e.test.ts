import { beforeAll, describe, expect, it } from 'vitest';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
let openApiAvailable = false;

async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  return { status: res.status, body };
}

describe('E2E Frontend → Backend API', () => {
  beforeAll(async () => {
    const res = await apiGet('/api-docs.json');
    openApiAvailable = res.status === 200;
  });

  it('GET / health da API', async () => {
    const res = await apiGet('/');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ service: 'golgirls-backend' });
  });

  it('GET /api-docs.json contém rotas do portal aluno', async (ctx) => {
    if (!openApiAvailable) {
      ctx.skip();
      return;
    }
    const res = await apiGet('/api-docs.json');
    expect(res.status).toBe(200);
    const paths = (res.body as { paths: Record<string, unknown> }).paths;
    expect(paths['/aluno/me']).toBeDefined();
    expect(paths['/aluno/jornada']).toBeDefined();
    expect(paths['/professor/chamada']).toBeDefined();
    expect(paths['/admin/relatorios']).toBeDefined();
  });

  it('POST /aluno/login inválido retorna 401', async () => {
    const res = await fetch(`${API_URL}/aluno/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula: '000000-e2e' }),
    });
    expect(res.status).toBe(401);
  });
});
