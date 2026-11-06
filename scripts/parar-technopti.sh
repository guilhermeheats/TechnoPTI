#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOGDIR="$ROOT/.technopti-logs"

kill_port() {
  local port="$1"
  if command -v fuser >/dev/null 2>&1; then
    fuser -k "${port}/tcp" 2>/dev/null || true
  fi
}

for name in backend frontend; do
  if [ -f "$LOGDIR/$name.pid" ]; then
    pid="$(cat "$LOGDIR/$name.pid")"
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
      echo "Processo $name encerrado (PID $pid)."
    fi
    rm -f "$LOGDIR/$name.pid"
  fi
done

# Garante que nenhum processo remanescente fique nas portas do projeto.
kill_port 5000
kill_port 5173

echo "Technopti parado."
