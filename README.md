# Eklesia Konecta API (Single-Tenant Mínima)

Esta é a reconstrução BIG BANG em modo **single-tenant simplificado**. Todo o código multi‑tenancy anterior foi arquivado em `src_legacy/` e não participa do build atual.

## Escopo Atual
- Health simples: `GET /health`
- CRUD Usuários:
   - `POST /usuarios` { nome, email, senha }
   - `GET /usuarios`
   - `GET /usuarios/:id`
   - `PUT /usuarios/:id` { nome }
   - `DELETE /usuarios/:id`

Sem autenticação / perfis / schemas dinâmicos neste estágio para máxima estabilidade.

## Requisitos
- Node 20+
- PostgreSQL acessível (DATABASE_URL)

## Setup Rápido
```bash
npm install
npx prisma migrate dev
npm run dev
```
Abra: http://localhost:3000/health

## Exemplo de Uso (CRUD Usuário)
```bash
curl -X POST http://localhost:3000/usuarios \
   -H 'Content-Type: application/json' \
   -d '{"nome":"Admin","email":"admin@example.com","senha":"123456"}'

curl http://localhost:3000/usuarios
```

## Produção (Docker Compose)
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
API em: http://localhost:3000

## Estrutura Atual
```
prisma/
   schema.prisma
src/
   app.ts
   server.ts
   tests/app.min.test.ts
src_legacy/   # Código antigo completo (multi-tenant) preservado
```

## Testes
```bash
npm test -- src/tests/app.min.test.ts
```

## Próximos Passos (Opcional)
1. Introduzir autenticação JWT básica.
2. Adicionar entidades essenciais (igreja, congregacao) em modelo único.
3. Remover definitivamente `src_legacy/` quando não mais necessário.
4. Reativar métricas / observabilidade de forma incremental.

## Aviso sobre o Código Legacy
Todo o ecossistema anterior (multi-tenancy, métricas avançadas, rate limit, swagger, redis, permissões) continua disponível apenas para consulta em `src_legacy/` e poderá ser reaproveitado seletivamente no futuro.

## Licença
MIT

---
Reconstrução mínima concluída. Expanda somente conforme necessidade real de negócio.

### Provisionamento de tenant
Fluxo de criação ocorre no endpoint público de onboarding:

`POST /api/cadastro-inicial`
```
{
   "nomeIgreja": "Igreja Exemplo",
   "nomePastor": "Fulano",
   "emailPastor": "pastor@exemplo.com",
   "senhaPastor": "SenhaForte123"
}
```
Resposta (exemplo):
```
{
   "success": true,
   "message": "Cadastro inicial realizado com sucesso!",
   "igreja": { "nome": "Igreja Exemplo", "schema": "igreja_exemplo_ab12cd34" },
   "pastor": { "nome": "Fulano", "email": "pastor@exemplo.com" }
}
```

Depois disso todas as chamadas autenticadas devem incluir:
1. Header `schema: <schema_da_igreja>`
2. Header `Authorization: Bearer <token>` após login.

### Como o schema é criado
- `schemaProvisioner` cria o schema e aplica o modelo (usa `prisma db push`).
- Logs de criação aparecem como: `[Provisioner] created schema=<nome> duration=XXXXms`.

### Cache de conexões
- Implementado em `prismaCache.ts` com política LRU + TTL inativo.
- Intervalo periódico faz prune (não roda em `NODE_ENV=test`).
- Funções utilitárias: `getPrisma(schema)`, `clearPrismaCache()`, `shutdownPrismaCache()`.

Variáveis de ambiente:
- `PRISMA_CLIENT_CACHE_MAX` (default 15) limite de PrismaClients simultâneos.
- `PRISMA_CLIENT_IDLE_TTL_MS` (default 300000) TTL de inatividade (ms) antes de descarte.

### Endpoint de saúde / métricas
- `GET /api/health/multi-tenancy` -> `{ ok, churches, cache }` (inclui métricas de cache de Prisma).

### Testes multi-tenant
- Schema base de apoio: `tenant_test` é preparado em `jest.setup.ts`.
- Entre testes críticas tabelas são resetadas para manter isolamento.
- Cada suíte que precisa de uma igreja chama o onboarding e usa somente o schema retornado.
- Nunca criar igreja via `/api/igrejas` nos testes — essa rota agora exige autenticação e perfil adequado (ADMIN ou SUPERUSER) e deve ser usada só dentro do tenant.

### Boas práticas
- Validar e sanitizar header `schema`.
- Reaproveitar schema por suíte quando possível para reduzir tempo.
- Evitar criação massiva concorrente (fila ou limitar a 1–2 por segundo em cenários de carga).
- Monitorar tempo de criação (logs `[Provisioner]`) para detectar gargalos de I/O.

### Rota autenticada de igrejas (`/api/igrejas`)
Agora protegida por JWT. Apenas:
- Usuário com perfil `ADMIN` dentro do schema atual, ou
- Usuário com flag SUPERUSER (geralmente seed no schema `public`).

Para cenários administrativos (ex: superuser global) fazer login com header `schema: public`.

### Fluxo resumido de uso da API por um cliente
1. Onboarding: `POST /api/cadastro-inicial`.
2. Login: `POST /api/auth/login` com header `schema: <schema>`.
3. Usar token e header `schema` para cadastrar congregações, membros, células, ofertas etc.
4. Consultar métricas: `GET /api/health/multi-tenancy` (opcional para observabilidade).

### Cron de backup
- Agendado diariamente 02:00 (server local time) via `node-cron`.
- Desabilitado automaticamente em ambiente de teste (`NODE_ENV=test`) para não manter handles abertos no Jest.
- Script executado: `scripts/backupDatabase.js`.


## Rodando em Desenvolvimento

```bash
npm run dev
```

## Rodando Testes

Executa Jest (multi-tenant, sem cron, fechando conexões Prisma):
```bash
NODE_ENV=test npm test
```

Dicas:
- Use `--runInBand` se notar contenção de conexões.
- Use `--detectOpenHandles` para diagnosticar leaks (já mitigado no setup atual).
- Evite `it.only`/`describe.only` antes de commits.

Login em testes após onboarding:
```ts
const login = await request(app)
   .post('/api/auth/login')
   .set('schema', schema)
   .send({ email: emailPastor, senha: 'SenhaForte123' });
```

## Autenticação & Headers

Headers padrão necessários em requisições autenticadas multi-tenant:
```
schema: <schema_da_igreja>
Authorization: Bearer <jwt>
```

Erros comuns:
- 401: Token ausente ou inválido.
- 403: Perfil sem permissão (ex: tentativa de criar igreja via `/api/igrejas` sem SUPERUSER/ADMIN).
- 404: Endpoint ainda não implementado (alguns testes aceitam 404 para rotas futuras, ex: certas mensagens / relatórios específicos).

## Deploy

### Opção A: Docker / Produção (recomendado)

Pré‑requisitos: Docker Engine e (opcional) Docker Compose.

1. Copie `.env.example` para `.env` e ajuste valores.
2. Suba stack completa (Postgres + Redis + API):
   ```bash
   docker compose up -d --build
   ```
3. Logs da API:
   ```bash
   docker compose logs -f api
   ```
4. Testar health:
   ```bash
   curl http://localhost:3001/
   curl http://localhost:3001/api/health/multi-tenancy
   ```
5. Swagger: `http://localhost:3001/api-docs` (se não definir `SWAGGER_ENABLED=false`)
   - JSON cru: `http://localhost:3001/swagger.json`
   - Exemplos já incluídos: `/api/cadastro-inicial`, `/api/auth/login`, `/api/health/multi-tenancy`.
   - Para desabilitar em produção: adicionar no `.env`: `SWAGGER_ENABLED=false`

Rebuild após alterações de código:
```bash
docker compose up -d --build api
```

Executar seed manual (ex: criar superuser global) — temporariamente:
```bash
docker compose run --rm -e RUN_SEED=true api
```

Escalar horizontalmente (containers adicionais, compartilhando DB/Redis):
```bash
docker compose up -d --scale api=2
```

### Opção B: Deploy manual (sem Docker)
1. Clone o repositório.
2. Instale dependências: `npm ci`.
3. Gere client Prisma: `npx prisma generate`.
4. Aplique migrations: `npx prisma migrate deploy`.
5. (Opcional) Seed: `npm run seed`.
6. Build: `npm run build`.
7. Start: `npm run start:prod`.
8. Reverse proxy (ex: Nginx) apontando para porta `3001`.

## Modo Mínimo (Primeira Subida Rápida)

Se você quer apenas validar login e chamadas básicas sem esbarrar em multi‑tenancy, métricas, rate limit ou validação de header, use o compose mínimo incluído no projeto:

```bash
docker compose -f infra/compose/docker-compose.min.yml up -d --build
```

Variáveis recomendadas no `.env` (ou já definidas no próprio compose mínimo):

```
NODE_ENV=production
PORT=3001
JWT_SECRET=trocar_por_um_valor_forte
POSTGRES_USER=postgres
POSTGRES_PASSWORD=senha
POSTGRES_DB=eklesia
DISABLE_METRICS=true
DISABLE_RATE_LIMIT=true
DISABLE_SCHEMA_HEADER=true
DISABLE_MULTI_TENANCY=true
RUN_MIGRATIONS=true
RUN_SEED=false
```

Flags e função:

| Flag | Efeito |
|------|--------|
| DISABLE_METRICS | Remove coleta e endpoint de métricas para reduzir overhead |
| DISABLE_RATE_LIMIT | Desativa limitador por schema (evita bloqueios iniciais) |
| DISABLE_SCHEMA_HEADER | Ignora validação de header `schema` |
| DISABLE_MULTI_TENANCY | Usa somente schema `public` |

Depois que validar o fluxo básico (cadastro inicial, login, rotas principais) vá removendo as flags gradualmente.

Sequência sugerida para reativação:
1. Remova `DISABLE_SCHEMA_HEADER` e passe a enviar `schema: public`.
2. Remova `DISABLE_MULTI_TENANCY` quando quiser criar novas igrejas via `/api/cadastro-inicial`.
3. Reative métricas (`/metrics`) para observabilidade.
4. Reative rate limit em produção.

Esse modo facilita rodar em VPS modesta (1 vCPU / 8GB RAM) sem atritos iniciais.

### Script de Atalhos (run.sh)

Foi adicionado um script para facilitar os comandos dos diferentes modos sem precisar lembrar o caminho completo dos arquivos de compose.

Principais comandos:
```bash
# Subir modo mínimo (teste rápido)
./run.sh up minimal

# Subir produção com HTTPS automático (Caddy)
./run.sh up proxy

# Atualizar só a API em produção HTTPS
./run.sh update-api proxy

# Logs da API (modo mínimo)
./run.sh logs minimal api

# Logs do proxy (Caddy)
./run.sh logs proxy caddy

# Derrubar stack
./run.sh down proxy

# Ver estado
./run.sh ps proxy
```
Modos disponíveis: `minimal`, `proxy`, `prod`, `dev`, `external`.


### Bootstrap Automático (Instalação em VPS do zero)

Se quiser automatizar tudo (instalar Docker se faltar, clonar repositório, gerar `.env` e subir a stack mínima) você pode rodar:

```bash
curl -fsSL https://raw.githubusercontent.com/AldairSbarros/api.eklesiakonecta/main/infra/deploy/bootstrap.sh -o bootstrap.sh
chmod +x bootstrap.sh
sudo ./bootstrap.sh
```

Ou copiar o script manualmente do repositório em `infra/deploy/bootstrap.sh`.

Após o bootstrap:
1. Testar: `curl http://SEU_IP:3001/api/health/multi-tenancy`
2. Fazer cadastro inicial: `POST /api/cadastro-inicial`
3. Fazer login: `POST /api/auth/login`
4. Retirar gradualmente as flags `DISABLE_*` do `.env`.


### Variáveis importantes em produção
### Publicando com Nginx + HTTPS

Guia completo em: `infra/nginx/README-nginx.md`

Resumo rápido:
```bash
cd infra/nginx
sudo bash setup-nginx.sh --domain api.seu-dominio.com --email seu@email.com
```
Depois acessar: `https://api.seu-dominio.com/api/health/multi-tenancy`

Proteção de métricas (opcional) veja seção 5 do guia.

| Variável | Descrição |
|----------|-----------|
| DATABASE_URL | Conexão PostgreSQL (sem schema fixo) |
| JWT_SECRET | Segredo para assinatura JWT |
| PRISMA_CLIENT_CACHE_MAX | Limite de clientes Prisma em cache |
| PRISMA_CLIENT_IDLE_TTL_MS | TTL ms para descarte de clientes inativos |
| NODE_ENV | production / development / test |

## Proxy Reverso & SSL (Nginx)

Arquivo de exemplo em `infra/nginx/api.eklesia.app.br.conf`.

Passos (Ubuntu):
```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
sudo mkdir -p /var/www/certbot
sudo cp infra/nginx/api.eklesia.app.br.conf /etc/nginx/sites-available/api.eklesia.app.br.conf
sudo ln -s /etc/nginx/sites-available/api.eklesia.app.br.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.eklesia.app.br --redirect --agree-tos -m seu-email@dominio.com
```
Renovação automática já configurada pelo timer do Certbot (`systemctl list-timers | grep certbot`).

Passos (Debian 12 / 11):
```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
# (Opcional) Abrir porta HTTP/HTTPS se usar UFW ou firewall
# sudo ufw allow 'Nginx Full'
sudo mkdir -p /var/www/certbot
sudo cp infra/nginx/api.eklesia.app.br.conf /etc/nginx/sites-available/api.eklesia.app.br.conf
sudo ln -s /etc/nginx/sites-available/api.eklesia.app.br.conf /etc/nginx/sites-enabled/ || true
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.eklesia.app.br --redirect --agree-tos -m seu-email@dominio.com
```
Notas Debian:
- Caso `python3-certbot-nginx` não esteja disponível (Debian muito antigo), instalar via snap:
   ```bash
   sudo apt install -y snapd
   sudo snap install core; sudo snap refresh core
   sudo snap install --classic certbot
   sudo ln -s /snap/bin/certbot /usr/bin/certbot
   sudo certbot --nginx -d api.eklesia.app.br --redirect -m seu-email@dominio.com --agree-tos
   ```
- Verificar renovação: `sudo certbot renew --dry-run`.

## Opção C: Docker + Caddy (HTTPS Automático)

Se você prefere evitar configuração manual de Nginx + Certbot e quer um fluxo totalmente containerizado com emissão e renovação automática de certificados, use o compose `infra/compose/docker-compose.proxy.yml` com Caddy.

### Quando usar
- Ambiente simples (1 VPS) sem necessidade de rules Nginx específicas.
- Quer HTTPS em minutos usando somente variáveis de ambiente.
- Quer headers de segurança e compressão já ativados por padrão.

### Pré‑requisitos
- DNS A do subdomínio (`api.seu-dominio.com`) apontando para o IP da VPS.
- Portas 80 e 443 liberadas no firewall.

### Variáveis necessárias no `.env`
```
API_DOMAIN=api.seu-dominio.com
LETSENCRYPT_EMAIL=seu@email.com
# (Demais variáveis já usadas pela aplicação: DATABASE_URL ou POSTGRES_*, JWT_SECRET etc.)
```

### Subindo a stack com proxy automático
```bash
docker compose -f infra/compose/docker-compose.proxy.yml up -d
```
Caddy irá:
1. Resolver o Caddyfile em `infra/caddy/Caddyfile`.
2. Solicitar certificado TLS Let's Encrypt automaticamente.
3. Aplicar headers de segurança (HSTS, X-Frame-Options, Permissions-Policy etc.).
4. Redirecionar HTTP -> HTTPS.
5. Fazer proxy para o container `api` na porta 3001.

Swagger em produção (atrás do Caddy):
```
https://SEU_DOMINIO/api-docs
https://SEU_DOMINIO/swagger.json
```
Se não quiser expor a documentação publicamente após validar:
```
SWAGGER_ENABLED=false
```
e reinicie a API.

Testar:
```bash
curl -I https://api.seu-dominio.com/api/health/multi-tenancy
```

### Estrutura de arquivos/volumes
| Item | Descrição |
|------|-----------|
| `infra/caddy/Caddyfile` | Config principal do proxy |
| Volume `caddy_data` | Armazena certificados emitidos (persistem entre recriações) |
| Volume `caddy_config` | Estado interno do Caddy |

### Atualizando a imagem da API
```bash
docker compose -f infra/compose/docker-compose.proxy.yml pull api
docker compose -f infra/compose/docker-compose.proxy.yml up -d api
```

### Migração de Nginx manual para Caddy
1. Pare serviços Nginx/Certbot existentes:
    ```bash
    sudo systemctl stop nginx
    sudo systemctl disable nginx --now
    ```
2. Libere portas 80/443 (verifique se não há outro processo escutando `sudo lsof -i :80 -i :443`).
3. Ajuste `.env` com `API_DOMAIN` e `LETSENCRYPT_EMAIL`.
4. Suba Caddy: `docker compose -f docker-compose.proxy.yml up -d caddy`.
5. Teste HTTPS. Se OK, pode remover configs antigas de `/etc/nginx` se desejar backup.

### Protegendo /metrics (exemplo simples)
No `Caddyfile` já existe bloco comentado para rota `/metrics`. Você pode liberar somente para IP interno:
```caddy
@metrics path /metrics
route @metrics {
   remote_ip 10.0.0.1
   reverse_proxy api:3001
}
```
Ou adicionar autenticação básica rápida:
```caddy
@metrics path /metrics
basicauth @metrics {
   admin JDJhJDE0JHFPU0pHVXJ5cVVnVTVjS3lGM0VQS0svZVd2SHZlZkZ0TWdoZ2J6cTcyQ1RHdkxPbEhsb1Vt # hash bcrypt
}
reverse_proxy @metrics api:3001
```
Gerar hash bcrypt (ajuste rounds conforme CPU):
```bash
docker run --rm caddy:2-alpine caddy hash-password --plaintext 'senhaforte'
```

### Comparação rápida
| Aspecto | Nginx + Certbot | Caddy |
|---------|-----------------|-------|
| Emissão Cert | Script/manual | Automática nativa |
| Renovação | Cron/timer certbot | Automática transparente |
| Config inicial | Mais verbosa | Simples (Caddyfile curto) |
| Headers Segurança | Manual | Incluídos/customizados no Caddyfile |
| Hot Reload | `nginx -s reload` | Automático ao editar Caddyfile |

Se você precisa de regras avançadas de cache, load balancing customizado complexo ou integrações já prontas em Nginx, continue com Nginx. Para maioria dos casos simples, Caddy reduz superfície de configuração e chance de erro.


## CI/CD (GitHub Actions)

Workflow em `.github/workflows/ci-cd.yml`:
1. Testes (Postgres efêmero) + Prisma migrate deploy
2. Build multi-stage Docker e push para GHCR (`ghcr.io/aldairsbarros/api.eklesiakonecta`)
3. Deploy via SSH rodando `infra/deploy/deploy.sh`

### Secrets necessários
Configurar no repositório:
- `DEPLOY_HOST` (IP ou hostname do VPS)
- `DEPLOY_USER` (usuário com acesso SSH e docker)
- `DEPLOY_KEY` (chave privada SSH)

### Ajustes pós-clone no servidor
```bash
git clone https://github.com/AldairSbarros/api.eklesiakonecta.git
cd api.eklesiakonecta
cp .env.example .env # editar senhas
docker login ghcr.io -u <github-username> -p <TOKEN_PAT_opcional>
docker compose -f docker-compose.prod.yml up -d postgres redis
```
Primeiro deploy automatizado puxará a imagem e subirá o serviço API.

### Deploy manual
```bash
bash infra/deploy/deploy.sh
```

## Observabilidade
- `/metrics` (Prometheus). Proteja no Nginx se exposto publicamente.
- Logs Nginx: `/var/log/nginx/eklesia_access.log` / `eklesia_error.log`.
- Health multi-tenancy: `/api/health/multi-tenancy`.

## Próximas melhorias sugeridas
- Adicionar alerta de latência e saturação de cache Prisma (Prometheus rules)
- Implementar escalonamento com systemd units + socket activation (opcional)
- Adicionar Sentry ou OpenTelemetry


## Performance / Tuning
- Evite excesso de criação de schemas: agrupe onboarding em lotes controlados.
- Monitore logs `[Provisioner]` para tempos > 3s (possível gargalo no banco).
- Ajuste `PRISMA_CLIENT_CACHE_MAX` conforme memória disponível.
- Utilize pooling adequado no PostgreSQL (ex: PgBouncer) em ambientes com muitas igrejas.

## Contribuição
1. Crie branch a partir de `main`.
2. Garanta `npm test` verde (sem `only`).
3. Mantenha mudanças de schema no `schema.prisma` e rode `prisma migrate dev`.
4. Atualize este README se alterar fluxo de onboarding, headers ou autenticação.
5. Faça PR descrevendo impacto em multi-tenancy.

## Documentação da API

Acesse `/api-docs` após iniciar o servidor para ver a documentação Swagger.

### Exportar arquivo OpenAPI (openapi.json)
Gerar instantâneo do documento para uso em ferramentas externas (ex: Postman, Insomnia, Mock Servers):
```bash
npm run build:openapi
```
Arquivo gerado: `openapi.json` na raiz do projeto.
Se quiser publicar em outro repositório ou importar no front, basta copiar esse arquivo.

Para exemplos detalhados de uso de cada endpoint, consulte o arquivo [`DOCUMENTACAO.md`](./src/docs/DOCUMENTACAO.md). (Atualize-o se adicionar rotas ao fluxo de onboarding.)

---

**Dúvidas?**  
Abra uma issue ou consulte a documentação detalhada no repositório.