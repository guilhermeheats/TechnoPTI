#!/usr/bin/env bash
# Utilitário opcional para abrir planilhas e documentos com o LibreOffice
# em modo claro, sem alterar o perfil normal do usuário.
set -euo pipefail

if ! command -v libreoffice >/dev/null 2>&1; then
  echo "Erro: 'libreoffice' não encontrado. Abra os arquivos no seu editor preferido." >&2
  exit 1
fi

PROFILE="${LIBREOFFICE_CLARO_PROFILE:-$HOME/.config/libreoffice-technopti-claro}"
export SAL_USE_VCLPLUGIN=gen

if [ ! -f "$PROFILE/user/registrymodifications.xcu" ]; then
  echo "Perfil claro não encontrado; usando o perfil padrão com interface clara." >&2
  exec libreoffice --norestore --nologo --nofirststartwizard "$@"
fi

exec libreoffice \
  -env:UserInstallation="file://$PROFILE" \
  --norestore --nologo --nofirststartwizard \
  "$@"
