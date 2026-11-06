# Backend do Technopti

API REST em **Flask + SQLAlchemy + PuLP/CBC** para cadastrar, resolver e
consultar problemas de Programação Linear. O banco é **SQLite** e fica em
`db.sqlite3`, versionado para a demonstração.

## Como executar

A partir desta pasta:

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
python run.py
```

O backend sobe em **http://127.0.0.1:5000**. O banco fica em
`backend/db.sqlite3`, com caminho calculado a partir de `database.py`.

`run.py` inicia o servidor sem o modo de recarga, que é o comportamento usado
pelos scripts do projeto. Para desenvolver com recarga automática, use
`python app.py`.

Para subir backend e frontend juntos, use o script da raiz:

```bash
cd ..
./scripts/iniciar-technopti.sh
```

No Windows, use o equivalente em PowerShell a partir da raiz:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows\iniciar-technopti.ps1
```

## Estrutura

```text
backend/
├── app.py              # cria o Flask, CORS, blueprints e teardown
├── run.py              # launcher usado pelos scripts de inicialização
├── database.py         # engine SQLite e scoped_session
├── models.py           # tabelas e criação do schema
├── solver.py           # modelo PuLP e chamada ao CBC
├── routes/
│   ├── problems.py     # listar, detalhar, criar e excluir
│   └── results.py      # resolver e consultar resultado
├── requirements.txt
├── db.sqlite3          # banco da demonstração
├── db.sqlite3.backup   # cópia para restaurar
├── api-tester.html     # teste manual das rotas
└── arquivo/            # protótipos antigos
```

## Banco de dados

O banco já contém o problema oficial **“Maximização da Empresa de TI”** e o
resultado salvo.

Backup:

```bash
cp db.sqlite3 db.sqlite3.backup
```

Restaurar:

```bash
cp db.sqlite3.backup db.sqlite3
```

## Documentação

- [Backend e banco](../docs/backend.md)
- [API REST](../docs/api.md)
- [Estrutura do projeto](../docs/estrutura.md)
- [Como executar](../docs/como-executar.md)
