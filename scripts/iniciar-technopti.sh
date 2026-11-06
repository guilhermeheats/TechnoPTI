#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"
VENV="$BACKEND/venv"
LOGDIR="$ROOT/.technopti-logs"
mkdir -p "$LOGDIR"

for cmd in python3 npm curl; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Erro: '$cmd' não encontrado. Instale as dependências e tente novamente." >&2
    exit 1
  fi
done

port_open() {
  local port="$1"
  local path="${2:-/}"
  curl -s -o /dev/null --max-time 1 "http://127.0.0.1:${port}${path}"
}

if port_open 5000 /problems; then
  echo "Backend já está rodando em http://127.0.0.1:5000"
else
  cd "$BACKEND"
  if [ ! -d "$VENV" ]; then
    echo "Criando ambiente Python do backend..."
    python3 -m venv "$VENV"
    "$VENV/bin/python" -m pip install -r requirements.txt
  elif ! "$VENV/bin/python" -c "import flask, pulp, sqlalchemy" >/dev/null 2>&1; then
    echo "Instalando dependências do backend..."
    "$VENV/bin/python" -m pip install -r requirements.txt
  fi
  nohup "$VENV/bin/python" run.py > "$LOGDIR/backend.log" 2>&1 &
  echo $! > "$LOGDIR/backend.pid"
  sleep 2
  if port_open 5000 /problems; then
    echo "Backend iniciado em http://127.0.0.1:5000"
  else
    echo "Falha ao iniciar o backend. Log:"
    cat "$LOGDIR/backend.log"
    exit 1
  fi
fi

if port_open 5173 /; then
  echo "Frontend já está rodando em http://127.0.0.1:5173"
else
  cd "$FRONTEND"
  if [ ! -d node_modules ]; then
    echo "Instalando dependências do frontend..."
    npm install
  fi
  nohup npm run dev -- --host 127.0.0.1 --port 5173 > "$LOGDIR/frontend.log" 2>&1 &
  echo $! > "$LOGDIR/frontend.pid"
  sleep 3
  if port_open 5173 /; then
    echo "Frontend iniciado em http://127.0.0.1:5173"
  else
    echo "Falha ao iniciar o frontend. Log:"
    cat "$LOGDIR/frontend.log"
    exit 1
  fi
fi

echo
echo "Technopti pronto:"
echo "  Frontend: http://127.0.0.1:5173"
echo "  Backend:  http://127.0.0.1:5000/problems"
