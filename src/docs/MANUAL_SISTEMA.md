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
