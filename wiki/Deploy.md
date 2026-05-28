# Deploy

---

## Build de Produção (sem Docker)

```bash
npm run build
```

Gera o diretório `dist/` com os arquivos estáticos otimizados. Para servir localmente:

```bash
npm run preview
```

---

## Docker

A aplicação usa um **Dockerfile multi-stage** para gerar uma imagem enxuta.

### Estágios

| Stage | Base | Descrição |
|-------|------|-----------|
| `builder` | `node:22-alpine` | Instala dependências e executa `npm run build` |
| (final) | `nginx:1.27-alpine` | Serve `dist/` via Nginx na porta **9020** |

### Build manual

```bash
docker build -t arvore-genealogica .
docker run -p 9020:9020 --name arvore-genealogica arvore-genealogica
```

### Com Docker Compose

```bash
docker-compose up -d         # Sobe em background
docker-compose logs -f       # Acompanha os logs
docker-compose down          # Para e remove os containers
```

**`docker-compose.yml`:**
```yaml
services:
  arvore-genealogica:
    build: .
    container_name: arvore-genealogica
    ports:
      - "9020:9020"
    restart: unless-stopped
```

---

## Configuração do Nginx

**Arquivo:** `nginx.conf`

```nginx
server {
    listen 9020;
    root /usr/share/nginx/html;
    index index.html;

    # SPA: redireciona tudo para index.html (suporte ao React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache longo para assets imutáveis (JS, CSS, imagens, fontes)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

> O `try_files ... /index.html` é essencial para que as rotas `/person/:id` funcionem corretamente ao acessar a URL diretamente ou ao recarregar a página.

---

## Deploy Automatizado via SSH

O script `deploy.js` automatiza o processo de envio para um servidor remoto.

### Pré-requisitos

1. Crie um arquivo `.env` na raiz do projeto com as credenciais SSH:

```env
DEPLOY_HOST=meu.servidor.com
DEPLOY_USER=ubuntu
DEPLOY_KEY_PATH=/home/user/.ssh/id_rsa
DEPLOY_PATH=/opt/arvore-genealogica
```

2. Certifique-se de que **Docker** e **Docker Compose** estão instalados no servidor remoto.

### Execução

```bash
npm run deploy
```

O script (`deploy.js`) usa as bibliotecas `node-ssh`, `ora` e `prompts` para:
1. Conectar ao servidor via SSH.
2. Enviar os arquivos necessários.
3. Executar `docker-compose up -d --build` no servidor remoto.

---

## Portas

| Ambiente | Porta |
|----------|-------|
| Dev (Vite) | `5173` |
| Preview (Vite) | `4173` |
| Docker / Produção | `9020` |
