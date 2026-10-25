# ⚽ Gol Girls Frontend

A iniciativa Gol Girls existe para promover o empoderamento de meninas negras, usando o esporte como uma ferramenta poderosa para abrir portas e realizar sonhos. Focamos em meninas negras e periféricas, pois queremos fortalecê-las em seu caminho de descoberta do mundo, construção da autoestima e ocupação de todos os espaços.

Aplicação web do projeto Gol Girls desenvolvida com React, TypeScript e Vite. O frontend consome a API do backend para autenticação e demais fluxos.

## Stack

- React 19, React Router 7, TypeScript 5.9
- Vite 7, Tailwind CSS 4, Sass
- Vitest (testes unitários/API) e Playwright (E2E)
- Docker: build com Node 22 e servido por Nginx 1.28

## Requisitos

- Node.js 20.19+ ou 22+
- npm 10+
- Backend do projeto rodando (por padrão em `http://localhost:3001`)
- Docker (opcional, para rodar em container)

## Variáveis de ambiente

Crie o `.env` a partir do exemplo:

```bash
cp .env.example .env
```

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `VITE_API_URL` | URL base da API do backend | `http://localhost:3001` |

> Variáveis `VITE_*` são embutidas no build. Ao alterar o valor, é necessário rebuildar.

## Desenvolvimento

```bash
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`. O backend precisa permitir essa origem em `CORS_ORIGIN`.

## Docker Compose

Com o Docker Desktop (ou outro runtime compatível com Docker Compose) aberto e o backend configurado e iniciado (veja o README do backend), na raiz do frontend execute:

```bash
cp .env.example .env
docker compose up --build -d
```

Se você usa Rancher Desktop no macOS e o contexto padrão não aponta para ele, use `docker --context rancher-desktop compose` no lugar de `docker compose` nos comandos desta seção.

Acesse `http://localhost:8080`. O `.env.example` configura `VITE_API_URL=http://localhost:3001`, endereço da API acessível pelo navegador. Se o backend estiver em container, configure nele `CORS_ORIGIN=http://localhost:8080` e `APP_URL=http://localhost:8080` para alinhar a origem e os links de e-mail.

Para apontar para outra API, informe a URL no build:

```bash
VITE_API_URL=https://api.exemplo.com docker compose up --build -d
```

Para parar:

```bash
docker compose down
```

Detalhes:

- O `Dockerfile` usa multi-stage: build com `node:22-alpine` e execução com `nginx:1.28-alpine`.
- O `nginx.conf` faz fallback para `index.html` (rotas do React Router), compressão gzip e cache longo para `/assets/`.
- Ao usar o frontend em `http://localhost:8080`, configure o backend com `CORS_ORIGIN=http://localhost:8080` e `APP_URL=http://localhost:8080`.

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Type-check e build de produção |
| `npm run preview` | Pré-visualização da build |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:all` | Todos os testes com Vitest |
| `npm run test:unit` | Testes unitários (`src/utils`) |
| `npm run test:e2e` | Testes de integração com a API (`src/__tests__/e2e`) |
| `npm run test:e2e:ui` | Testes E2E de navegador com Playwright |

## Atalhos com Make

Na raiz do frontend, use `make help` para listar todos os comandos. `make setup` instala as dependências, `make run` inicia o Vite e `make build` valida os tipos e gera a build de produção. Também estão disponíveis `make test`, `make lint`, `make docker-up` e `make docker-down`.

## Fluxo recomendado para subir tudo

1. Suba o backend primeiro (ele sobe o MySQL, aplica as migrations e expõe a API em `3001`). Veja o README do backend.
2. Suba o frontend com `npm run dev` ou com Docker.
3. Acesse o frontend no navegador e faça login com os dados cadastrados na API.
