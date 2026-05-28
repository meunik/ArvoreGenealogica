# Instalação e Uso

## Pré-requisitos

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Docker** (opcional, para ambiente containerizado)

---

## Desenvolvimento Local

### 1. Clonar o repositório

```bash
git clone https://github.com/meunik/ArvoreGenealogica.git
cd ArvoreGenealogica
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`.

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite HMR) |
| `npm run build` | Compila TypeScript e gera o build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Executa o ESLint em todos os arquivos |
| `npm run deploy` | Script de deploy automatizado via SSH |

---

## Com Docker

### Build e execução manual

```bash
docker build -t arvore-genealogica .
docker run -p 9020:9020 arvore-genealogica
```

O app estará disponível em `http://localhost:9020`.

### Com Docker Compose

```bash
docker-compose up -d
```

O serviço `arvore-genealogica` sobe na porta **9020** com `restart: unless-stopped`.

### Parar os containers

```bash
docker-compose down
```

---

## Variáveis de Ambiente

O script `deploy.js` lê um arquivo `.env` na raiz do projeto. As variáveis disponíveis são utilizadas para configurar o acesso SSH ao servidor de destino. Crie um `.env` baseado no template do projeto antes de executar `npm run deploy`.

> ⚠️ O arquivo `.env` está listado no `.gitignore` — nunca o comita no repositório.

---

## Estrutura de Saída do Build

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
```

O conteúdo de `dist/` é servido pelo **Nginx** (ver `nginx.conf`) quando rodando em Docker.
