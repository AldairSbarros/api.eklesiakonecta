# Changelog

Todas as mudanças notáveis deste projeto serão documentadas aqui.

O formato segue (inspirado em) Keep a Changelog e SemVer (quando aplicável).

## [Unreleased]
- Melhorias de performance adicionais no provisionamento multi-tenant.
- Implementar endpoints reais de mensagens internas e relatórios de célula (atualmente alguns retornam 404 em testes tolerantes).

## [1.1.0] - 2025-09-12
### Adicionado
- Endpoint público de onboarding: `POST /api/cadastro-inicial` (cria igreja + pastor inicial + schema).
- Proteção JWT + autorização por perfil para rota `/api/igrejas` (apenas ADMIN no schema ou SUPERUSER no `public`).
- Health multi-tenant: `GET /api/health/multi-tenancy` incluindo métricas de cache Prisma.
- Funções de gerenciamento de cache Prisma: `clearPrismaCache`, `shutdownPrismaCache`.
- Desabilitação de cron de backup em ambiente de teste (`NODE_ENV=test`).
- Testes de multi-tenancy refeitos para usar somente onboarding público.
- Novo controle de open handles (fechando intervalos e conexões após testes).
- README ampliado com fluxo de onboarding, headers obrigatórios e tuning de performance.
- CHANGELOG inicial criado.

### Alterado
- Todos os testes que criavam igreja via `/api/igrejas` migrados para `/api/cadastro-inicial`.
- Ajuste em testes para sempre enviar header `schema` + JWT após login.
- Intervalo de prune de clientes Prisma agora exporta função para ser encerrado em testes.
- Logs de provisão padronizados: `[Provisioner] created schema=<nome> duration=<ms>`.

### Corrigido
- Falhas de testes por 401/403 após endurecimento de permissão em `/api/igrejas`.
- Problema de Jest não encerrar devido a cron + interval de prune.
- Inconsistência de email de superuser em teste (`dev@eklesia.local`).

### Removido
- Execução do cron de backup durante testes automatizados.

## [1.0.0] - 2025-07-16
### Adicionado
- Estrutura inicial do backend multi-módulo (igrejas, congregações, membros, financeiro, relatórios, discipulado, etc.).
- Migrations iniciais do Prisma.
- Suíte inicial de testes de integração.

---

Referências de versão:
- `Unreleased`: mudanças em desenvolvimento.
- `1.1.0`: versão atual com refatoração de criação de igreja e robustez multi-tenant.
