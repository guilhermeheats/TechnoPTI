#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Erro: 'python3' não encontrado." >&2
  exit 1
fi

if [ ! -d .mkdocs-venv ]; then
  echo "Criando ambiente da documentação..."
  python3 -m venv .mkdocs-venv
fi

if ! .mkdocs-venv/bin/python -c "import mkdocs" >/dev/null 2>&1; then
  echo "Instalando MkDocs Material..."
  .mkdocs-venv/bin/python -m pip install -r requirements-docs.txt
fi

echo "Documentação em http://127.0.0.1:8000"
exec .mkdocs-venv/bin/mkdocs serve -a 127.0.0.1:8000
