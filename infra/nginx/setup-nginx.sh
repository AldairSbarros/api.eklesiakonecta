#!/usr/bin/env bash
set -euo pipefail

# Script de setup automatizado Nginx + Certbot para Eklesia API
# Uso:
#  sudo bash setup-nginx.sh --domain api.seu-dominio.com --email seu@email.com
# Requisitos: Debian/Ubuntu com APT, DNS já apontando para o servidor.

DOMAIN=""
EMAIL=""
FORCE="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain) DOMAIN="$2"; shift 2;;
    --email) EMAIL="$2"; shift 2;;
    --force) FORCE="true"; shift;;
    *) echo "Parâmetro desconhecido: $1"; exit 1;;
  esac
done

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "Uso: $0 --domain api.seu-dominio.com --email seu@email.com [--force]" >&2
  exit 1
fi

if ! command -v nginx >/dev/null 2>&1; then
  echo "[nginx-setup] Instalando Nginx e Certbot..."
  apt-get update
  apt-get install -y nginx certbot python3-certbot-nginx
else
  echo "[nginx-setup] Nginx já instalado"
fi

CONF_PATH="/etc/nginx/sites-available/${DOMAIN}.conf"
ENABLED_LINK="/etc/nginx/sites-enabled/${DOMAIN}.conf"
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"

if [ -f "$CONF_PATH" ] && [ "$FORCE" != "true" ]; then
  echo "[nginx-setup] Config já existe em $CONF_PATH (use --force para recriar)"
else
  echo "[nginx-setup] Gerando config Nginx para $DOMAIN"
  cat > "$CONF_PATH" <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/${DOMAIN}/chain.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy no-referrer-when-downgrade;
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: http: https:";

    proxy_read_timeout 120s;
    proxy_send_timeout 120s;

    access_log /var/log/nginx/${DOMAIN}_access.log;
    error_log  /var/log/nginx/${DOMAIN}_error.log;

    location /metrics {
        # auth_basic "Restricted"; # opcional
        proxy_pass http://127.0.0.1:3001/metrics;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
fi

mkdir -p /var/www/certbot

if [ ! -d "$CERT_DIR" ] || [ "$FORCE" = "true" ]; then
  echo "[nginx-setup] Gerando certificado Let's Encrypt para $DOMAIN"
  systemctl enable nginx
  systemctl start nginx
  certbot certonly --nginx -d "$DOMAIN" --agree-tos -m "$EMAIL" --non-interactive --redirect || {
    echo "[nginx-setup] Falha na emissão. Verifique DNS propagado."; exit 1; }
else
  echo "[nginx-setup] Certificado já existe em $CERT_DIR (use --force para renovar manualmente)"
fi

ln -sf "$CONF_PATH" "$ENABLED_LINK"
nginx -t
systemctl reload nginx

echo "[nginx-setup] Concluído. Teste: https://${DOMAIN}/api/health/multi-tenancy"
