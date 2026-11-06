# Como executar

## Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git TechnoPTI
cd TechnoPTI
```

Substitua `SEU-USUARIO/SEU-REPOSITORIO` pelo endereço do seu repositório.
Todos os comandos abaixo partem da **raiz do repositório**, salvo indicação
contrária.

## Atalho recomendado

```bash
./scripts/iniciar-technopti.sh
```

O script:

- cria o `venv` do backend e instala as dependências se ainda não existirem;
- instala as dependências do frontend se `node_modules/` não existir;
- inicia o backend em `http://127.0.0.1:5000`;
- inicia o frontend em `http://127.0.0.1:5173`;
- grava os logs em `.technopti-logs/`;
- não duplica processos se os servidores já estiverem no ar.

Para parar:

```bash
./scripts/parar-technopti.sh
```

## URLs

| Serviço | URL |
|---|---|
| Frontend | <http://127.0.0.1:5173> |
| Backend | <http://127.0.0.1:5000/problems> |
| Documentação | <http://127.0.0.1:8000> |

## Pré-requisitos

| Ferramenta | Versão usada no projeto |
|---|---|
| Python | 3.11+ (testado em 3.13) |
| Node.js | 20.19+ (testado em 24) |
| npm | compatível com o Node instalado |
| PowerShell | 5.1+ no Windows 10/11 |
| curl | para testar a API |
| Firefox/Chrome | para a interface |

Os scripts Bash são para **Linux e macOS**. No Windows, use os scripts
PowerShell em `scripts/windows/` ou o passo a passo manual abaixo.

## Windows (PowerShell)

Na raiz do repositório:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows\iniciar-technopti.ps1
```

Para parar:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows\parar-technopti.ps1
```

Os scripts verificam Python, Node.js e npm, criam o `venv` do backend,
instalam as dependências que faltarem e sobem os dois serviços. Os logs ficam
em `.technopti-logs\backend.log`, `.technopti-logs\frontend.log` e nos
arquivos `.err.log` correspondentes.

Se preferir liberar a execução de scripts apenas na sessão atual do PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\windows\iniciar-technopti.ps1
```

## Passo a passo manual

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
python run.py
```

O backend sobe em <http://127.0.0.1:5000>. `run.py` inicia sem recarga; para
desenvolver com recarga automática, use `python app.py`.

!!! note "Banco de dados"

    O caminho de `db.sqlite3` é calculado a partir de `backend/database.py`.
    O banco fica sempre em `backend/db.sqlite3`, não importa de onde o
    comando seja executado.

### Frontend

Em outro terminal, a partir da raiz:

```bash
cd frontend
npm install
npm run dev
```

Acesse <http://127.0.0.1:5173>.

Por padrão, o frontend chama `http://127.0.0.1:5000`. Para usar outro
endereço, copie `frontend/.env.example` para `frontend/.env.local` e ajuste
`VITE_API_URL`.

### Windows — passo a passo manual

Backend:

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python run.py
```

Em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

Se a política de execução do PowerShell bloquear o `Activate.ps1`, use
`venv\Scripts\activate.bat` no Prompt de Comando.

### Nas próximas vezes

Backend:

```bash
cd backend
source venv/bin/activate
python run.py
```

Frontend:

```bash
cd frontend
npm run dev
```

### Build de produção do frontend

```bash
cd frontend
npm run build
npm run preview
```

O build fica em `dist/`, que é ignorado pelo Git. Para publicar, sirva essa
pasta e ajuste a URL da API. Veja [Frontend](frontend.md#build-e-publicacao).

## Testes do backend

```bash
cd backend
python -m unittest discover -s tests -v
```

No Windows, use o Python do `venv`:

```powershell
cd backend
.\venv\Scripts\python.exe -m unittest discover -s tests -v
```

## Documentação

### Servir o site

```bash
./scripts/iniciar-docs.sh
```

Acesse <http://127.0.0.1:8000>.

Para parar:

```bash
./scripts/parar-docs.sh
```

### Gerar o site estático

```bash
./scripts/gerar-docs.sh
```

O script executa `mkdocs build --clean --strict` e gera `site/`. O modo estrito
falha se houver link quebrado ou página fora do `nav`.

### Windows (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows\iniciar-docs.ps1
```

Para gerar o site:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows\gerar-docs.ps1
```

Para parar:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows\parar-docs.ps1
```

### Instalação manual do MkDocs

Linux/macOS:

```bash
python3 -m venv .mkdocs-venv
source .mkdocs-venv/bin/activate
python -m pip install -r requirements-docs.txt
mkdocs serve -a 127.0.0.1:8000
```

Windows (PowerShell):

```powershell
py -m venv .mkdocs-venv
.\.mkdocs-venv\Scripts\Activate.ps1
python -m pip install -r requirements-docs.txt
python -m mkdocs serve -a 127.0.0.1:8000
```

Se o comando `py` não existir, use `python` no lugar.

Para gerar sem os scripts:

```bash
# Linux/macOS
.mkdocs-venv/bin/mkdocs build --clean --strict
```

```powershell
# Windows
.\.mkdocs-venv\Scripts\python.exe -m mkdocs build --clean --strict
```

O fluxo completo de edição, navegação, imagens e publicação está em
[Documentação (MkDocs)](mkdocs.md).

## Materiais oficiais

Os PDFs, planilhas e o DOCX ficam em `docs/assets/materiais/` e também podem
ser baixados pela página [Documentação em PDF](documentacao-pdf.md).

| Arquivo | Uso |
|---|---|
| `docs/assets/materiais/ROTEIRO-APRESENTACAO-TECHNOPTI.pdf` | Roteiro da apresentação. |
| `docs/assets/materiais/Relatorio-Oficial-Technopti.pdf` | Backup do relatório. |
| `docs/assets/materiais/EXERCICIO_PROJETO_FINAL.xlsx` | Planilha com o Solver. |
| `docs/assets/materiais/CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx` | Cronograma. |
| `docs/assets/materiais/TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx` | Trabalho final. |

## Abrir planilhas e DOCX no LibreOffice

O script abaixo é opcional e útil para abrir os materiais com a interface
clara do LibreOffice durante a apresentação:

```bash
./scripts/abrir-libreoffice-claro.sh --calc docs/assets/materiais/EXERCICIO_PROJETO_FINAL.xlsx
./scripts/abrir-libreoffice-claro.sh --calc docs/assets/materiais/CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx
./scripts/abrir-libreoffice-claro.sh --writer docs/assets/materiais/TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx
```

O utilitário usa um perfil separado (`~/.config/libreoffice-technopti-claro`)
e não altera o perfil normal do LibreOffice. Se o perfil não existir, abre com
o perfil padrão.

## Banco de dados

O banco fica em:

```text
backend/db.sqlite3
```

Ele já contém o problema oficial e o resultado salvo. O arquivo
`db.sqlite3.backup` é uma cópia limpa para restaurar a demonstração.

### Fazer backup

```bash
cd backend
cp db.sqlite3 db.sqlite3.backup
```

### Restaurar

```bash
cd backend
cp db.sqlite3.backup db.sqlite3
```

Depois reinicie o backend. O backup versionado contém o problema oficial.

## Teste rápido da API

```bash
curl http://127.0.0.1:5000/problems
curl http://127.0.0.1:5000/problems/1/result
```

Resposta esperada do problema oficial:

```json
{
  "status": "Optimal",
  "valor_objetivo": 500000.0,
  "variaveis": {
    "Análise de Dados": 0.0,
    "Cibersegurança": 0.0,
    "Des. Mobile": 0.0,
    "Des. Web": 0.0,
    "Suporte Téc. Mensal": 50.0
  }
}
```

O contrato completo está em [API REST](api.md).

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| `Address already in use` na porta 5000 ou 5173 | Processo antigo rodando | `./scripts/parar-technopti.sh` ou, no Windows, `scripts\windows\parar-technopti.ps1` |
| Frontend abre, mas não lista problemas | Backend parado | Inicie o backend e confira `curl http://127.0.0.1:5000/problems` |
| Erro 500 ao abrir o relatório | Banco em estado inconsistente | Restaure `db.sqlite3.backup` e reinicie o backend |
| PDF não é gerado | Relatório ainda carregando ou bloqueio do navegador | Aguarde o relatório completo e tente de novo; use o PDF de backup |
| Backend não encontra o banco | Arquivo apagado ou caminho incorreto | Confira `backend/db.sqlite3` e restaure o backup |
| `mkdocs: command not found` | Venv da documentação não ativado | Use `./scripts/iniciar-docs.sh` ou ative `.mkdocs-venv` |
| `npm: command not found` | Node.js não instalado | Instale o Node.js 24 ou compatível |
| `pip install` falha no backend | `venv` não ativado | Ative `venv` antes de instalar |

## Encerrar processos manualmente

Linux/macOS:

```bash
fuser -k 5000/tcp
fuser -k 5173/tcp
fuser -k 8000/tcp
```

Windows (PowerShell):

```powershell
5000, 5173, 8000 | ForEach-Object {
    Get-NetTCPConnection -LocalPort $_ -State Listen -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique |
        ForEach-Object { Stop-Process -Id $_ -Force }
}
```
