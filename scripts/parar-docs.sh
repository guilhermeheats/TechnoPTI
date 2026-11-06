#!/usr/bin/env bash
set -euo pipefail

if command -v fuser >/dev/null 2>&1; then
  fuser -k 8000/tcp 2>/dev/null || true
fi

echo "Documentação parada."
