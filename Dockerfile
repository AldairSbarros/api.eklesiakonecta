############################################
# Build Stage
############################################
FROM node:20-slim AS build
LABEL org.opencontainers.image.source="https://github.com/AldairSbarros/api.eklesiakonecta" \
      org.opencontainers.image.title="Eklesia Konecta API (build)" \
      org.opencontainers.image.licenses="MIT"

WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential openssl ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate && npm run build

############################################
# Runtime Stage
############################################
FROM node:20-slim AS runtime
LABEL org.opencontainers.image.source="https://github.com/AldairSbarros/api.eklesiakonecta" \
      org.opencontainers.image.title="Eklesia Konecta API" \
      org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production \
    PORT=3000 \
    PRISMA_HIDE_UPDATE_MESSAGE=1

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force >/dev/null 2>&1 || true

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD curl -fsS http://localhost:${PORT}/health | grep '"status":"ok"' >/dev/null || exit 1

CMD ["node","dist/server.js"]
