# Technopti — Sistema de Otimização de Resultados

[![CI](https://github.com/guilhermeheats/TechnoPTI/actions/workflows/ci.yml/badge.svg)](https://github.com/guilhermeheats/TechnoPTI/actions/workflows/ci.yml)
[![Docs](https://github.com/guilhermeheats/TechnoPTI/actions/workflows/docs.yml/badge.svg)](https://github.com/guilhermeheats/TechnoPTI/actions/workflows/docs.yml)
[![Release](https://img.shields.io/github/v/release/guilhermeheats/TechnoPTI?display_name=tag)](https://github.com/guilhermeheats/TechnoPTI/releases)

Projeto final para a disciplina de **Programação Linear e Aplicações**.

Aplicação web que automatiza a modelagem e a resolução de problemas de
Programação Linear, com cadastro guiado de variáveis e restrições, solver
**PuLP/CBC**, histórico em **SQLite** e relatórios em **PDF**.

## Stack

| Camada | Tecnologias |
|---|---|
| Frontend | React 19, Vite, Chakra UI v3, Axios, Recharts, html2pdf.js |
| Backend | Python, Flask, Flask-CORS, SQLAlchemy |
| Otimização | PuLP com solver CBC |
| Banco | SQLite |
| Documentação | MkDocs Material |
| CI/CD | GitHub Actions, GHCR e Docker |

## Estrutura

```text
TechnoPTI/
├── .github/workflows/             # CI, documentação e release
├── .dockerignore
├── Dockerfile                     # imagem publicada no GHCR
├── backend/                       # Flask, SQLAlchemy, SQLite e PuLP/CBC
│   ├── app.py
│   ├── run.py                     # launcher usado pelos scripts
│   ├── database.py
│   ├── models.py
│   ├── solver.py
│   ├── routes/
│   ├── tests/
│   ├── requirements.txt
│   ├── requirements-prod.txt
│   ├── db.sqlite3
│   ├── db.sqlite3.backup
│   └── arquivo/                   # protótipos antigos
├── frontend/                      # React, Vite e Chakra UI
│   ├── .env.example               # modelo da URL da API
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
├── docs/                          # documentação MkDocs
│   ├── assets/materiais/          # PDFs, planilhas e DOCX oficiais
│   └── assets/arquivo/            # materiais históricos
├── scripts/                       # Linux/macOS (Bash) e Windows (PowerShell)
│   ├── *.sh
│   └── windows/*.ps1
├── mkdocs.yml
├── requirements-docs.txt
└── README.md
```

A árvore completa e o schema do banco estão em
[Estrutura](docs/estrutura.md).

## Como rodar

Pré-requisitos: **Python 3.11+** (testado em 3.13), **Node.js 20.19+**
(testado em 24) e **npm**. No Windows, use **PowerShell 5.1+** (Windows 10/11).

```bash
git clone https://github.com/guilhermeheats/TechnoPTI.git
cd TechnoPTI
./scripts/iniciar-technopti.sh
```

Acesse **http://127.0.0.1:5173**. O backend fica em
**http://127.0.0.1:5000/problems**.

Para encerrar:

```bash
./scripts/parar-technopti.sh
```

### Windows

No **PowerShell**, a partir da raiz do repositório:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows\iniciar-technopti.ps1
```

Para parar:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows\parar-technopti.ps1
```

Os scripts Windows criam o `venv`, instalam as dependências e sobem os dois
serviços. O passo a passo manual, incluindo a instalação de dependências e o
modo manual no Windows, está em [Como executar](docs/como-executar.md).

## Documentação

A documentação é um site **MkDocs Material** em `docs/`, configurado por
`mkdocs.yml`.

```bash
./scripts/iniciar-docs.sh     # http://127.0.0.1:8000
./scripts/gerar-docs.sh       # build estático com --strict
./scripts/parar-docs.sh
```

Páginas principais:

- [Início](docs/index.md)
- [Apresentação](docs/apresentacao.md)
- [Roteiro em texto](docs/roteiro-apresentacao.md)
- [Documentação em PDF](docs/documentacao-pdf.md)
- [Projeto](docs/projeto.md)
- [Como executar](docs/como-executar.md)
- [Frontend](docs/frontend.md)
- [Backend e banco](docs/backend.md)
- [API REST](docs/api.md)
- [Modelo matemático](docs/modelo-matematico.md)
- [Estrutura](docs/estrutura.md)
- [Documentação (MkDocs)](docs/mkdocs.md)
- [CI/CD e release](docs/ci-cd.md)
- [FAQ](docs/faq.md)

## Materiais oficiais

Os arquivos para download ficam em `docs/assets/materiais/`:

- **Roteiro em PDF:** [`ROTEIRO-APRESENTACAO-TECHNOPTI.pdf`](docs/assets/materiais/ROTEIRO-APRESENTACAO-TECHNOPTI.pdf)
- **Backup do relatório:** [`Relatorio-Oficial-Technopti.pdf`](docs/assets/materiais/Relatorio-Oficial-Technopti.pdf)
- **Planilha do projeto:** [`EXERCICIO_PROJETO_FINAL.xlsx`](docs/assets/materiais/EXERCICIO_PROJETO_FINAL.xlsx)
- **Cronograma:** [`CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx`](docs/assets/materiais/CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx)
- **Trabalho final:** [`TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx`](docs/assets/materiais/TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx)

O roteiro editável em Markdown está em
[`docs/roteiro-apresentacao.md`](docs/roteiro-apresentacao.md).

> **Materiais antigos:** os roteiros antigos de grupo, a documentação técnica
> de 36 páginas e o pacote antigo do projeto estão em
> [`docs/assets/arquivo/`](docs/assets/arquivo/), apenas para histórico.

## CI/CD, release e pacote

O projeto usa **GitHub Actions** para testar backend, frontend e MkDocs, além
de construir a imagem Docker. Ao enviar uma tag `v*`, o GitHub cria a release
com os artefatos e publica a imagem no GHCR:

```bash
git tag -a v1.0.0 -m "Technopti v1.0.0"
git push origin v1.0.0
```

Executar o pacote:

```bash
docker run --rm -p 5000:5000 ghcr.io/guilhermeheats/technopti:latest
```

Acesse <http://127.0.0.1:5000>. Links publicados:

- **Documentação:** <https://guilhermeheats.github.io/TechnoPTI/>
- **Release v1.0.0:** <https://github.com/guilhermeheats/TechnoPTI/releases/tag/v1.0.0>
- **Pacote GHCR:** <https://github.com/guilhermeheats/TechnoPTI/pkgs/container/technopti>
- **Actions:** <https://github.com/guilhermeheats/TechnoPTI/actions>

O fluxo completo, permissões e publicação do MkDocs estão em
[CI/CD e release](docs/ci-cd.md).

## Resultado oficial

O modelo oficial escolhe **50 contratos de Suporte Técnico Mensal** e não
utiliza os demais serviços. As três restrições ficam exatamente no limite, com
lucro de **R$ 500.000**.

O motivo é o retorno por hora escassa: **R$ 125/h** de desenvolvimento para o
Suporte Técnico Mensal, contra **R$ 100/h** dos demais serviços. A formulação
completa está em [Modelo matemático](docs/modelo-matematico.md).

## Licença

Este projeto está sob a licença descrita em [`LICENSE`](LICENSE).
