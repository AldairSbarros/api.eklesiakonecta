# Guia Nginx + HTTPS (Eklesia Konecta)

Este guia descreve como publicar a API atrás de um reverse proxy Nginx com TLS (Let's Encrypt) em um VPS Debian/Ubuntu.

## 1. Pré‑requisitos
- DNS do domínio (ex: `api.seu-dominio.com`) apontando para o IP público do VPS
- Porta 80 e 443 liberadas no firewall / provedor
- Docker stack da API já rodando (porta 3001 local)

## 2. Script Automático (recomendado)

```
cd /srv/eklesia/app/infra/nginx
sudo bash setup-nginx.sh --domain api.seu-dominio.com --email seu@email.com
```
Flags:
- `--force`: recria config e reemite certificado

Isso irá:
1. Instalar `nginx`, `certbot` e plugin Nginx (se ausentes)
2. Criar config base em `/etc/nginx/sites-available/<dominio>.conf`
3. Emitir certificado Let's Encrypt
4. Habilitar HTTP->HTTPS e proxy para `127.0.0.1:3001`

Testar:
```
curl -I https://api.seu-dominio.com/api/health/multi-tenancy
```

## 3. Config Manual (alternativa)

1. Instalar pacotes:
```
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
```
2. Criar diretório de validação ACME:
```
sudo mkdir -p /var/www/certbot
```
3. Criar arquivo `/etc/nginx/sites-available/api.seu-dominio.com.conf` (exemplo já fornecido em `infra/nginx/api.eklesia.app.br.conf`).
4. Link simbólico:
```
sudo ln -s /etc/nginx/sites-available/api.seu-dominio.com.conf /etc/nginx/sites-enabled/
```
5. Testar e recarregar:
```
sudo nginx -t && sudo systemctl reload nginx
```
6. Emitir certificado:
```
sudo certbot certonly --nginx -d api.seu-dominio.com --agree-tos -m seu@email.com --non-interactive
```
7. Ajustar config apontando para os arquivos gerados em `/etc/letsencrypt/live/api.seu-dominio.com/`.
8. Reload final:
```
sudo systemctl reload nginx
```

## 4. Renovação Automática
Certbot instala `systemd timers` ou cron automaticamente. Teste:
```
sudo certbot renew --dry-run
```

## 5. Protegendo `/metrics`
Exemplo com Basic Auth:
```
sudo apt install -y apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd monitor
# Digite a senha
```
Adicionar dentro do bloco `location /metrics`:
```
auth_basic "Restricted";
auth_basic_user_file /etc/nginx/.htpasswd;
```
Reload:
```
sudo systemctl reload nginx
```

## 6. Checklist de Diagnóstico
| Sintoma | Possível causa | Ação |
|--------|----------------|------|
| 502 Bad Gateway | API parada ou porta errada | `docker ps`, `curl localhost:3001` |
| 404 em /.well-known/acme-challenge | Config ACME ausente | Ver bloco do server:80 |
| Certificado inválido / antigo | Renovação não ocorreu | `sudo certbot renew --dry-run` |
| Timeout nas requisições | API lenta ou rede | Ver logs da API e `proxy_read_timeout` |
| Erro de permissão no cert | Certificados não emitidos | Reemitir com `--force` |

## 7. Logs
- Acesso: `/var/log/nginx/<dominio>_access.log`
- Erros: `/var/log/nginx/<dominio>_error.log`

## 8. Hardening (futuro)
- Ativar HTTP/3 (QUIC)
- Configurar rate limiting no Nginx (já há exemplo comentado)
- Implementar WAF (modsecurity) se necessário
- Adicionar cabeçalho `Strict-Transport-Security` após garantir HTTPS estável

## 9. Rollback
Desabilitar site:
```
sudo rm /etc/nginx/sites-enabled/<dominio>.conf
sudo systemctl reload nginx
```
Certificados permanecem em `/etc/letsencrypt/live/` (podem ser removidos com `sudo certbot delete`).

---
Qualquer ajuste adicional (WebSockets, múltiplas APIs, balanceamento) pode ser incluído em uma versão avançada depois.
