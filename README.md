# ⚽ Gol Girls Frontend

A iniciativa Gol Girls existe para promover o empoderamento de meninas negras, usando o esporte como uma ferramenta poderosa para abrir portas e realizar sonhos. Focamos em meninas negras e periféricas, pois queremos fortalecê-las em seu caminho de descoberta do mundo, construção da autoestima e ocupação de todos os espaços.

Aplicação web do projeto Gol Girls desenvolvida com React, TypeScript e Vite. O frontend consome a API do backend do projeto para autenticação e demais fluxos da aplicação.

## 🧠 O que a API precisa

- Node.js 20.x ou superior
- npm 9+
- Backend do projeto rodando em `http://localhost:3001`
- Docker

## ⚙️ Passo a passo para rodar em desenvolvimento

1. Abra um terminal na pasta do frontend:

```bash
cd GolGirls-frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Verifique se o backend já está em execução em `http://localhost:3001`.

4. Inicie o frontend:

```bash
npm run dev
```

## ☁️ Passo a passo rodar usando Docker

1. Abra um terminal na pasta do frontend:

```bash
cd GolGirls-frontend
```

2. Suba a aplicação com Docker Compose:

```bash
docker compose up --build
```

4. Para parar os containers:

```bash
docker compose down
```

## 🌐 Como validar se esta funcionando:

```bash
http://localhost:8080
```

## Scripts disponíveis

- `npm run dev`: inicia o ambiente de desenvolvimento com Vite.
- `npm run build`: gera a build de produção.
- `npm run lint`: executa o ESLint no código.
- `npm run preview`: faz a pré-visualização da build gerada.

## Fluxo recomendado para subir tudo

1. Suba o backend primeiro, porque ele depende do MySQL e expõe a API em `3001`.
2. Em seguida, suba o frontend com `npm run dev` ou com Docker.
3. Acesse o frontend no navegador e faça login com os dados cadastrados na API.
