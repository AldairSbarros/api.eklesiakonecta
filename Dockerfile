###############################
# Stage 0: Base args
###############################
ARG NODE_VERSION=20-slim

###############################
# Stage 1: Build (Typescript -> JS)
###############################
FROM node:20-slim AS build
LABEL org.opencontainers.image.source="https://github.com/AldairSbarros/api.eklesiakonecta" \
      org.opencontainers.image.title="Eklesia Konecta API (build)" \
      org.opencontainers.image.description="Build stage da API Eklesia Konecta" \
      org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Dependências necessárias apenas para compilar módulos nativos (bcrypt)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential openssl ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

# Copia manifests primeiro para cache de dependências (lockfile garante reprodutibilidade)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copia código fonte necessário para build
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Gera client Prisma + build TS (se qualquer arquivo mudar, será refeito)
RUN npx prisma generate && npm run build

###############################
# Stage 2: Production runtime
###############################
FROM node:20-slim AS runtime
LABEL org.opencontainers.image.source="https://github.com/AldairSbarros/api.eklesiakonecta" \
      org.opencontainers.image.title="Eklesia Konecta API" \
      org.opencontainers.image.description="API de gestão Eklesia Konecta (runtime)" \
      org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production \
    TZ=UTC \
    PRISMA_HIDE_UPDATE_MESSAGE=1 \
    PORT=3000

WORKDIR /app

# Instala somente libs mínimas necessárias em runtime (openssl para TLS/prisma)
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates tini curl && \
    rm -rf /var/lib/apt/lists/* && \
    useradd -m -u 1001 -s /bin/bash nodeusr

# Copia package + lock e instala apenas produção
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force >/dev/null 2>&1 || true

# Copia artefatos do build
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && \
    chown -R nodeusr:nodeusr /app /entrypoint.sh

USER nodeusr

EXPOSE 3000

# Healthcheck: valida JSON da rota de health
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=5 \
    CMD curl -fsS http://localhost:${PORT}/health | grep '"status":"ok"' >/dev/null || exit 1

ENTRYPOINT ["/usr/bin/tini","--","/entrypoint.sh"]
CMD ["npm","run","start:prod"]
