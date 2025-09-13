#!/usr/bin/env bash
set -euo pipefail

COMPOSE_DIR="infra/compose"

# Detecta arquivo .env na raiz para forçar uso com --env-file (evita problemas de resolução quando compose está em subpastas)
if [ -f .env ]; then
  COMPOSE_ENV_FILE=(--env-file ./.env)
else
  COMPOSE_ENV_FILE=()
fi

usage() {
  cat <<EOF
Uso: ./run.sh <acao> <modo> [servico]

Modos:
  minimal    -> ${COMPOSE_DIR}/docker-compose.min.yml
  proxy      -> ${COMPOSE_DIR}/docker-compose.proxy.yml
  prod       -> ${COMPOSE_DIR}/docker-compose.prod.yml
  dev        -> ${COMPOSE_DIR}/docker-compose.dev.yml
  external   -> ${COMPOSE_DIR}/docker-compose.external-db.yml

Ações:
  up         Sobe stack (build se modo minimal/dev com build local)
  down       Derruba stack
  logs       Mostra logs (ou de um serviço se passado)
  pull       Faz pull da imagem API (modos proxy/prod)
  restart    Reinicia serviço(s)
  update-api Faz pull + recria somente API
  ps         Lista estado

Exemplos:
  ./run.sh up minimal
  ./run.sh up proxy
  ./run.sh logs proxy caddy
  ./run.sh update-api proxy
  ./run.sh down minimal

EOF
}

resolve_file() {
  case "$1" in
    minimal) echo "${COMPOSE_DIR}/docker-compose.min.yml" ;;
    proxy) echo "${COMPOSE_DIR}/docker-compose.proxy.yml" ;;
    prod) echo "${COMPOSE_DIR}/docker-compose.prod.yml" ;;
    dev) echo "${COMPOSE_DIR}/docker-compose.dev.yml" ;;
    external) echo "${COMPOSE_DIR}/docker-compose.external-db.yml" ;;
    *) echo "Modo inválido: $1" >&2; exit 1 ;;
  esac
}

[ $# -lt 2 ] && usage && exit 1

ACAO="$1"; shift
MODO="$1"; shift
FILE=$(resolve_file "$MODO")

cmd() {
  docker compose "${COMPOSE_ENV_FILE[@]}" -f "$FILE" "$@"
}

case "$ACAO" in
  up)
    if [[ "$MODO" == "minimal" || "$MODO" == "dev" || "$MODO" == "external" ]]; then
      cmd up -d --build "$@"
    else
      cmd up -d "$@"
    fi
    ;;
  down)
    cmd down "$@" ;;
  logs)
    if [ $# -ge 1 ]; then cmd logs -f "$1"; else cmd logs -f; fi ;;
  pull)
    cmd pull ${1:-api} ;;
  restart)
    if [ $# -ge 1 ]; then cmd restart "$@"; else cmd restart; fi ;;
  update-api)
    cmd pull api && cmd up -d api ;;
  ps)
    cmd ps ;;
  *)
    echo "Ação inválida: $ACAO" >&2
    usage
    exit 1
    ;;
 esac
