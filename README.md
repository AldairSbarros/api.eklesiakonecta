# Eklesia Konecta - Backend

Backend completo para gestão de igrejas, congregações, células, discipulado, financeiro e relatórios, com multi‑tenancy por schema PostgreSQL e fluxo de onboarding público.

## Funcionalidades Principais

- Onboarding público de nova igreja (`POST /api/cadastro-inicial`)
- Cadastro e gestão autenticada de igrejas/congregações (`/api/igrejas`, `/api/congregacoes`)
- Gestão de usuários, permissões e autenticação JWT
- Módulo de células e discipulado
- Controle financeiro (ofertas, despesas, relatórios)
- Dashboard financeiro anual
- Upload e gestão de comprovantes
- Notificações por e-mail e WhatsApp
- Relatórios em JSON e PDF
- Testes automatizados (Jest/Supertest)
- Documentação automática (Swagger)

## Instalação

```bash
git clone https://github.com/seuusuario/eklesia-konecta.git
cd eklesia-konecta/backend
npm install
```

## Configuração

- Crie um arquivo `.env` com as variáveis de ambiente necessárias (veja exemplo em `.env.example`).

## Banco de Dados

- Rode as migrations:
  ```bash
  npx prisma migrate dev
  ```

## Multi-Tenancy por Schema

O backend utiliza isolamento por schema PostgreSQL.

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

1. Faça o clone do projeto do GitHub no servidor.
2. Configure o arquivo `.env` com as variáveis de produção.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Rode as migrations do banco:
   ```bash
   npx prisma migrate deploy
   ```
5. Inicie o servidor:
   ```bash
   npm start
   ```
6. Acesse a documentação da API em `/api-docs`.
7. Verifique saúde multi-tenant em `/api/health/multi-tenancy`.

### Variáveis importantes em produção
| Variável | Descrição |
|----------|-----------|
| DATABASE_URL | Conexão PostgreSQL (sem schema fixo) |
| JWT_SECRET | Segredo para assinatura JWT |
| PRISMA_CLIENT_CACHE_MAX | Limite de clientes Prisma em cache |
| PRISMA_CLIENT_IDLE_TTL_MS | TTL ms para descarte de clientes inativos |
| NODE_ENV | production / development / test |

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

Para exemplos detalhados de uso de cada endpoint, consulte o arquivo [`DOCUMENTACAO.md`](./src/docs/DOCUMENTACAO.md). (Atualize-o se adicionar rotas ao fluxo de onboarding.)

---

**Dúvidas?**  
Abra uma issue ou consulte a documentação detalhada no repositório.