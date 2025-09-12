#!/usr/bin/env bash
set -euo pipefail

echo "[entrypoint] Eklesia Konecta - inicializando container"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[entrypoint] ERRO: DATABASE_URL não definido" >&2
  exit 1
fi

echo "[entrypoint] Executando prisma generate (idempotente)"
npx prisma generate >/dev/null 2>&1 || echo "[entrypoint] prisma generate falhou (prosseguindo se client existir)"

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Aplicando migrations (prisma migrate deploy)"
  npx prisma migrate deploy || { echo "[entrypoint] Falha nas migrations"; exit 1; }
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] Executando seed"
  npm run seed || echo "[entrypoint] Seed retornou código não-zero"
fi

echo "[entrypoint] Iniciando aplicação"
exec "$@"
