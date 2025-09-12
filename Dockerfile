###############################
# Stage 1: Build (Typescript -> JS)
###############################
FROM node:20-slim AS build

WORKDIR /app

# Instala dependências de build (para bcrypt / libs nativas se necessário)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential openssl ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

# Copia manifests primeiro para cache de dependências
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copia código fonte
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY global.d.ts ./

# Gera client Prisma + build TS
RUN npx prisma generate
RUN npm run build

###############################
# Stage 2: Production runtime
###############################
FROM node:20-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Usuário não-root por segurança
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/* \
    && useradd -m nodeusr

# Copia somente o necessário
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && chown -R nodeusr:nodeusr /app

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:3001/ || exit 1

USER nodeusr
ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm","run","start:prod"]
