#!/bin/sh
# Script para ejecutar el cron de email sequences
# Este servicio se ejecuta cada hora via Railway Cron

echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] Iniciando cron de email sequences..."

# Verificar variables requeridas
if [ -z "$TARGET_URL" ]; then
  echo "ERROR: TARGET_URL no configurada"
  exit 1
fi

if [ -z "$CRON_SECRET" ]; then
  echo "ERROR: CRON_SECRET no configurada"
  exit 1
fi

# Ejecutar el request
echo "Llamando a: $TARGET_URL"

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  "$TARGET_URL")

# Separar body y status code
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $BODY"

# Verificar resultado
if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] Cron completado exitosamente"
  exit 0
else
  echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] ERROR: HTTP $HTTP_CODE"
  exit 1
fi
