# Manual do Sistema - Eklesia Konecta

## Visão Geral
O Eklesia Konecta é um sistema de gestão para igrejas, congregações, células e departamentos, com controle de membros, usuários, finanças, relatórios e comunicação integrada.

---

## 1. Acesso ao Sistema
- Acesse a aplicação web pelo endereço fornecido pela administração.
- O primeiro acesso é feito via cadastro inicial, criando a primeira igreja e usuário administrador.
- Após o cadastro, utilize o login com e-mail e senha.

---

## 2. Perfis de Usuário
- **ADMIN**: Acesso total ao sistema, gestão de usuários, permissões e dados financeiros.
- **PASTOR**: Gestão de membros, células, relatórios e acompanhamento.
- **SUPERUSER**: Escopo global (suporte / manutenção multi-igrejas) – não vinculado a congregação.
- **TESOUREIRO**: Gestão financeira, ofertas, despesas e relatórios.
- **DIRIGENTE**: Gestão de células, reuniões e membros sob sua responsabilidade.
- **SECRETARIO**: (Se habilitado) apoio administrativo e cadastros.

### Classificação Eclesiástica de Membros (Relatórios Financeiros)
Cada membro pode ter uma classificação opcional (`categoriaEclesiastica`):
PASTOR_DIRIGENTE | PASTOR | DIACONO | DIACONISA | MEMBRO
Essa informação alimenta o relatório financeiro mensal agregado para separar valores de dízimos e ofertas por função.

---

## 3. Módulos Principais
### Igrejas e Congregações
- Cadastro, edição e remoção de igrejas e congregações.
- Cada igreja possui seu próprio ambiente (multi-tenancy).

### Usuários
- Cadastro, edição, exclusão e redefinição de senha.
- Associação a perfis e congregações.

### Membros
- Cadastro, edição, exclusão e busca de membros.
- Associação a células e congregações.

### Células
- Cadastro, edição, exclusão e acompanhamento de células.
- Registro de reuniões, frequência e visitantes.

### Ofertas e Finanças
- Registro de ofertas, dízimos, receitas e despesas.
- Upload de comprovantes (fotos do talão).
- Relatórios financeiros detalhados e snapshot mensal agregado.

#### Relatório Financeiro Mensal (Snapshot)
Endpoint: `GET /financeiro/relatorio-mensal/snapshot?congregacaoId=...&mes=...&ano=...`
Headers: `schema: <schema_da_igreja>` + autenticação.

Retorna (ou gera) um snapshot com:
- totalDizimistas (distintos no mês)
- totalOfertas (quantidade de lançamentos de oferta)
- valorTotalDizimos
- valorTotalOfertas
- valorTotalReceitas (dízimos + ofertas + outras receitas)
- valorComissao33 (33% que permanece na congregação)
- valorRepasseCentral (restante para tesouraria central)
- detalhesCategorias (JSON com breakdown por categoria eclesiástica: dizimos, ofertas, contagens)

Pode forçar recálculo com `&recomputar=true`.

Exemplo rápido (curl):
```bash
curl -H "Authorization: Bearer $TOKEN" \
	-H "schema: igreja_alpha" \
	"https://api.seudominio.com/financeiro/relatorio-mensal/snapshot?congregacaoId=1&mes=9&ano=2025"
```

Recalcular:
```bash
curl -H "Authorization: Bearer $TOKEN" \
	-H "schema: igreja_alpha" \
	"https://api.seudominio.com/financeiro/relatorio-mensal/snapshot?congregacaoId=1&mes=9&ano=2025&recomputar=true"
```

Observação: A comissão de 33% é aplicada sobre o total de receitas consideradas no mês. Ajustes futuros podem parametrizar o percentual.

### Relatórios
- Relatórios de células, discipulado, finanças e frequência.
- Snapshot financeiro mensal agregado (evita recomputo em dashboards).
- Exportação em PDF e Excel (resumo financeiro).

---

## 4. Funcionalidades Adicionais
- **Notificações**: Envio de e-mails e WhatsApp para membros e líderes.
- **Logs**: Auditoria de ações administrativas.
- **Dashboard**: Visão geral de indicadores (multi-tenant, métricas Prometheus: /metrics).
- **Backup**: Backup automático diário do banco de dados.
- **Rate Limiting**: Limite distribuído por schema (Redis) e lock de provisionamento de schemas.
- **Snapshots Financeiros**: Materialização mensal para performance.

### Módulos Legados / Descontinuados
Os seguintes módulos foram movidos para `src/legacy/services` e não fazem parte do escopo ativo atual: Escola de Líderes, Ministérios (extensões), Encontros/Retiros detalhados, Reuniões de Célula avançadas, Sermões, Vendas/Upgrade, Webhooks genéricos, Investimentos (service separado) e outros auxiliares não usados.
Persistem no schema para compatibilidade histórica até limpeza final.

---

## 5. Dicas de Uso
- Sempre envie o header `schema` para rotas multi-tenant.
- Para relatórios financeiros, defina `categoriaEclesiastica` dos membros chave para granularidade.
- Use o endpoint de snapshot em vez de recomputar agregações pesadas em tempo real.
- Utilize ferramentas de observabilidade: `/health` (saúde) e `/metrics` (Prometheus).
- Para dúvidas, consulte a documentação técnica ou suporte.

---

## 6. Suporte
- Para suporte técnico, envie e-mail para suporte@eklesia.app.br ou utilize o canal oficial de atendimento.

---

*Este manual é um guia rápido. Para detalhes técnicos, consulte a documentação da API ou o suporte.*

---

## 7. Como Rodar o Backend (Escolha 1 Cenário)

Você vai ver vários arquivos `docker-compose` no projeto. Use SOMENTE o que faz sentido agora. Abaixo um guia direto:

### Atalho com script `run.sh`
Se não quiser digitar caminhos dos arquivos, use o script:
```bash
./run.sh up minimal      # sobe modo mínimo
./run.sh up proxy        # produção com HTTPS automático
./run.sh update-api proxy
./run.sh logs proxy caddy
```
Modos aceitos: `minimal`, `proxy`, `prod`, `dev`, `external`.

### A) Modo Mínimo (para testar rápido)
Arquivo: `infra/compose/docker-compose.min.yml` (ou `./run.sh up minimal`)

Quando usar: primeira vez no VPS ou máquina local, validar cadastro inicial e login.

Comando:
```bash
docker compose -f infra/compose/docker-compose.min.yml up -d --build
```
O que sobe: API + Postgres.
Recursos desligados: multi-tenancy avançada, métricas, rate limit, exigência do header `schema`.
Testar health:
```bash
curl http://SEU_IP:3001/api/health/multi-tenancy
```

### B) Desenvolvimento Local (editando código)
Arquivo: `infra/compose/docker-compose.dev.yml` (ou `./run.sh up dev`)

Quando usar: você está codando, quer rebuild automático ao alterar.
Comando (primeira vez):
```bash
docker compose -f infra/compose/docker-compose.dev.yml up -d --build
```
Depois só:
```bash
docker compose -f infra/compose/docker-compose.dev.yml up -d api
```
O que sobe: API (build local) + Redis (se precisar). Postgres pode ser habilitado descomentando no arquivo ou usar outro.

### C) Produção Simples (sem HTTPS interno)
Arquivo: `infra/compose/docker-compose.prod.yml` (ou `./run.sh up prod`)

Quando usar: você já tem (ou terá) um Nginx no servidor cuidando do HTTPS.
Comando:
```bash
docker compose -f infra/compose/docker-compose.prod.yml up -d
```
O que sobe: API (imagem pronta do registro) + Postgres + Redis.
Depois configure Nginx apontando para porta 3001.

### D) Produção com HTTPS Automático (recomendado para facilitar)
Arquivo: `infra/compose/docker-compose.proxy.yml` (ou `./run.sh up proxy`)

Quando usar: quer HTTPS rápido sem instalar/configurar Nginx.
Pré‑requisitos: domínio apontado (DNS) para o servidor.
`.env` deve ter:
```
API_DOMAIN=api.seu-dominio.com
LETSENCRYPT_EMAIL=seu@email.com
```
Comando:
```bash
docker compose -f infra/compose/docker-compose.proxy.yml up -d
```
O que sobe: API + Postgres + Redis + Caddy (proxy com TLS automático e headers de segurança).
Testar:
```bash
curl -I https://api.seu-dominio.com/api/health/multi-tenancy
```

### E) API usando Banco Externo
Arquivo: `infra/compose/docker-compose.external-db.yml` (ou `./run.sh up external`)

Quando usar: seu Postgres está FORA (RDS, outro container já existente, etc.).
`.env` precisa de `DATABASE_URL` apontando para esse banco.
Se banco for um container local, antes crie a rede e conecte o Postgres nela:
```bash
docker network create eklesia-net
docker network connect eklesia-net nome_do_container_postgres
```
Subir API:
```bash
docker compose -f infra/compose/docker-compose.external-db.yml up -d --build
```
O que sobe: só a API.

### F) Tabela Resumo
| Cenário | Arquivo | Sobe o quê | HTTPS | Banco | Para quem |
|---------|---------|-----------|-------|-------|-----------|
| Teste rápido | infra/compose/docker-compose.min.yml | API + Postgres | Não | Interno | Iniciante / primeira vez |
| Dev local | infra/compose/docker-compose.dev.yml | API (+ Redis) | Não | Opcional/local | Quando está programando |
| Produção simples | infra/compose/docker-compose.prod.yml | API + Postgres + Redis | Não (usar Nginx externo) | Interno | Produção básica |
| Produção HTTPS fácil | infra/compose/docker-compose.proxy.yml | API + Postgres + Redis + Caddy | Sim (automático) | Interno | Produção prática |
| Banco externo | infra/compose/docker-compose.external-db.yml | API | Depende (externo) | Externo (RDS/outro) | Quando já migrou DB |

### G) Passos típicos após subir (qualquer modo)
1. Cadastro inicial: `POST /api/cadastro-inicial`
2. Login: `POST /api/auth/login`
3. Usar token e (quando ativado) header `schema: public` ou o schema criado.
4. Criar congregações, membros, ofertas etc.
 5. Documentação Swagger (se habilitada):
	- UI: `/api-docs`
	- JSON: `/swagger.json`
		- Para esconder em produção: adicionar em `.env`: `SWAGGER_ENABLED=false` e reiniciar.
		- Exemplos incluídos: cadastro inicial, login e health.
		- Para adicionar novas rotas você pode:
			1. Editar `src/docs/swaggerConfig.ts` adicionando em `paths` e `components.schemas`.
			2. (Opcional futuro) Usar comentários JSDoc nos arquivos de rota e apontar no array `apis`.

### H) Reativando recursos após modo mínimo
Edite `.env` e remova aos poucos:
- `DISABLE_SCHEMA_HEADER`
- `DISABLE_MULTI_TENANCY`
- `DISABLE_METRICS`
- `DISABLE_RATE_LIMIT`

Recriar container da API (exemplo modo mínimo):
```bash
docker compose -f infra/compose/docker-compose.min.yml up -d api
```

### I) Atualizando imagem (produção)
```bash
docker compose -f infra/compose/docker-compose.prod.yml pull api
docker compose -f infra/compose/docker-compose.prod.yml up -d api
```
Ou com proxy:
```bash
docker compose -f infra/compose/docker-compose.proxy.yml pull api
docker compose -f infra/compose/docker-compose.proxy.yml up -d api
```

### J) Logs rápidos
```bash
docker compose -f infra/compose/docker-compose.min.yml logs -f api
docker compose -f infra/compose/docker-compose.proxy.yml logs -f caddy
```

Se algo travar, verifique:
```bash
docker ps
docker compose -f infra/compose/docker-compose.min.yml ps
```

----
Use sempre o menor arquivo que resolve seu problema atual. Se estiver tudo OK no modo mínimo, só mude quando REALMENTE precisar de HTTPS ou separar o banco.
