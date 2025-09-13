#!/usr/bin/env bash
set -euo pipefail

# =============================================
# Eklesia Konecta - Script de Bootstrap VPS
# Objetivo: Instalar Docker (se precisar), clonar/atualizar repo, gerar .env (se ausente),
# subir stack mínima (modo simples) e exibir status.
# Idempotente: pode rodar várias vezes sem quebrar.
# =============================================

REPO_URL="https://github.com/AldairSbarros/api.eklesiakonecta.git"
APP_DIR="/srv/eklesia/app"
COMPOSE_FILE_MIN="docker-compose.min.yml"
SERVICE_NAME="api"

log() { echo -e "[bootstrap] $*"; }
err() { echo -e "[bootstrap][ERRO] $*" >&2; }

require_root_or_sudo() {
  if [ "$(id -u)" -ne 0 ]; then
    if command -v sudo >/dev/null 2>&1; then
      log "Utilizando sudo para operações privilegiadas"
    else
      err "Execute como root ou instale sudo"; exit 1
    fi
  fi
}

install_docker() {
  if command -v docker >/dev/null 2>&1; then
    log "Docker já instalado: $(docker --version)"
    return
  fi
  log "Instalando Docker Engine..."
  # Fonte oficial Docker (Debian/Ubuntu)
  if ! command -v curl >/dev/null 2>&1; then apt-get update && apt-get install -y curl; fi
  install_script_url="https://get.docker.com"
  curl -fsSL "$install_script_url" -o get-docker.sh
  sh get-docker.sh
  rm -f get-docker.sh
  log "Docker instalado"
}

clone_or_update_repo() {
  mkdir -p "$APP_DIR"
  if [ ! -d "$APP_DIR/.git" ]; then
    log "Clonando repositório..."
    git clone "$REPO_URL" "$APP_DIR"
  else
    log "Atualizando repositório existente..."
    (cd "$APP_DIR" && git fetch --all && git reset --hard origin/main)
  fi
}

ensure_env_file() {
  if [ -f "$APP_DIR/.env" ]; then
    log ".env já existe - não sobrescrevendo"
    return
  fi
  log "Gerando .env padrão (modo mínimo)"
  cat > "$APP_DIR/.env" <<'EOF'
NODE_ENV=production
PORT=3001
JWT_SECRET=trocar_por_uma_chave_forte
POSTGRES_USER=postgres
POSTGRES_PASSWORD=senha
POSTGRES_DB=eklesia
DISABLE_METRICS=true
DISABLE_RATE_LIMIT=true
DISABLE_SCHEMA_HEADER=true
DISABLE_MULTI_TENANCY=true
RUN_MIGRATIONS=true
RUN_SEED=false
EOF
}

bring_up_stack_min() {
  cd "$APP_DIR"
  if [ ! -f "$COMPOSE_FILE_MIN" ]; then
    err "Arquivo $COMPOSE_FILE_MIN não encontrado no repositório. Abortando."
    exit 1
  fi
  log "Subindo stack mínima (Postgres + API)"
  docker compose -f "$COMPOSE_FILE_MIN" pull || true
  docker compose -f "$COMPOSE_FILE_MIN" up -d --build
}

post_checks() {
  log "Aguardando API responder health (timeout 60s)..."
  local end=$((SECONDS+60))
  local ok=0
  while [ $SECONDS -lt $end ]; do
    if curl -fsS http://localhost:3001/api/health/multi-tenancy >/dev/null 2>&1; then
      ok=1; break
    fi
    sleep 3
  done
  if [ $ok -eq 1 ]; then
    log "API respondeu com sucesso: curl http://<IP|DOMINIO>:3001/api/health/multi-tenancy"
  else
    err "Health não respondeu dentro do tempo. Verifique logs: docker compose -f $COMPOSE_FILE_MIN logs -f $SERVICE_NAME"
  fi

  log "Containers em execução:" 
  docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
}

main() {
  require_root_or_sudo
  install_docker
  clone_or_update_repo
  ensure_env_file
  bring_up_stack_min
  post_checks
  log "Bootstrap concluído. Próximos passos:" 
  echo "- Acessar: http://<IP ou domínio>:3001/"
  echo "- Onboarding: POST /api/cadastro-inicial (ver README)"
  echo "- Depois de validar, remova gradualmente DISABLE_* do .env"
}

main "$@"
