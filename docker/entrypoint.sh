#!/usr/bin/env bash
set -euo pipefail

echo "[entrypoint] Eklesia Konecta - inicializando container"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[entrypoint] ERRO: DATABASE_URL não definido" >&2
  exit 1
fi

shutdown() {
  echo "[entrypoint] Recebido sinal de parada, encerrando processo filho..."
  pkill -TERM -P $$ || true
  wait || true
  echo "[entrypoint] Encerrado"
  exit 0
}
trap shutdown TERM INT

wait_for_db() {
  if command -v psql >/dev/null 2>&1; then
    local retries=20
    echo "[entrypoint] Aguardando banco responder (psql)..."
    until psql "$DATABASE_URL" -c 'select 1' >/dev/null 2>&1; do
      retries=$((retries-1))
      [ $retries -le 0 ] && echo "[entrypoint] Banco não respondeu a tempo" && break
      sleep 2
    done
  else
    echo "[entrypoint] psql não disponível - pulando espera ativa"
  fi
}

wait_for_db

echo "[entrypoint] Executando prisma generate (idempotente)"
npx prisma generate >/dev/null 2>&1 || echo "[entrypoint] prisma generate falhou (prosseguindo se client existir)"

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Aplicando migrations (prisma migrate deploy)"
  if ! npx prisma migrate deploy; then
    echo "[entrypoint] Falha nas migrations" >&2
    exit 1
  fi
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  if [ -f /app/.seeded ]; then
    echo "[entrypoint] Seed já executado anteriormente - pulando (remova /app/.seeded para forçar)"
  else
    echo "[entrypoint] Executando seed (primeira vez)"
    if npm run seed; then
      date > /app/.seeded || echo "[entrypoint] Aviso: não consegui criar lockfile .seeded"
      echo "[entrypoint] Seed concluído"
    else
      echo "[entrypoint] Seed retornou código não-zero" >&2
    fi
  fi
fi

echo "[entrypoint] Iniciando aplicação: $*"
exec "$@"
