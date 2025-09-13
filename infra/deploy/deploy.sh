#!/usr/bin/env bash
set -euo pipefail

echo "[deploy] Iniciando deploy Eklesia Konecta"

if ! command -v docker >/dev/null 2>&1; then
  echo "[deploy] ERRO: docker não encontrado" >&2
  exit 1
fi

IMAGE_REF="ghcr.io/aldairsbarros/api.eklesiakonecta:latest"

echo "[deploy] Pull da imagem $IMAGE_REF"
docker pull "$IMAGE_REF"

echo "[deploy] Subindo stack (docker-compose.prod.yml)"
docker compose -f docker-compose.prod.yml up -d api

echo "[deploy] Limpeza de imagens órfãs (opcional)"
docker image prune -f >/dev/null 2>&1 || true

echo "[deploy] Deploy concluído"
