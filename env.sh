#!/bin/sh
set -e

: "${APP_PREFIX:?APP_PREFIX must be set (e.g. APP_PREFIX='MY_APP_')}"
: "${ASSET_DIR:?ASSET_DIR must be set (e.g. ASSET_DIR='./frontend/dist')}"

echo "Injecting runtime envs into assets in $ASSET_DIR"

env | grep "^${APP_PREFIX}" | while IFS='=' read -r key value; do
  echo "  • Replacing ${key} → ${value}"
  find "$ASSET_DIR" -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) \
    -exec sed -i "s|${key}|${value}|g" {} +
done
