# Estrutura do projeto

## Árvore principal

```text
TechnoPTI/
├── README.md
├── LICENSE
├── .gitignore
├── .gitattributes
├── .dockerignore
├── Dockerfile
├── mkdocs.yml
├── requirements-docs.txt
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── docs.yml
│       └── release.yml
├── backend/
│   ├── README.md
│   ├── app.py
│   ├── run.py
│   ├── database.py
│   ├── models.py
│   ├── solver.py
│   ├── requirements.txt
│   ├── requirements-prod.txt
│   ├── api-tester.html
│   ├── db.sqlite3
│   ├── db.sqlite3.backup
│   ├── routes/
│   │   ├── problems.py
│   │   └── results.py
│   ├── tests/
│   │   └── test_api.py
│   └── arquivo/
│       ├── README.md
│       ├── main.py
│       └── teste.py
├── frontend/
│   ├── README.md
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── jsconfig.json
│   ├── index.html
│   ├── public/
│   │   ├── background.png
│   │   └── technopti-logo.png
│   └── src/
│       ├── api.js
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── Paginas/
│       ├── componentes/
│       └── components/ui/
├── docs/
│   ├── index.md
│   ├── apresentacao.md
│   ├── roteiro-apresentacao.md
│   ├── documentacao-pdf.md
│   ├── projeto.md
│   ├── como-executar.md
│   ├── frontend.md
│   ├── backend.md
│   ├── api.md
│   ├── modelo-matematico.md
│   ├── estrutura.md
│   ├── mkdocs.md
│   ├── ci-cd.md
│   ├── faq.md
│   ├── assets/
│   │   ├── materiais/
│   │   │   ├── ROTEIRO-APRESENTACAO-TECHNOPTI.pdf
│   │   │   ├── Relatorio-Oficial-Technopti.pdf
│   │   │   ├── EXERCICIO_PROJETO_FINAL.xlsx
│   │   │   ├── CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx
│   │   │   └── TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx
│   │   ├── arquivo/
│   │   │   ├── roteiro-grupo-final.pdf
│   │   │   ├── technopti-documentacao-36p.pdf
│   │   │   └── projeto-pacote-antigo.zip
│   │   └── img/
│   │       ├── home.jpg
│   │       ├── logo.svg
│   │       └── relatorio-oficial.png
│   └── stylesheets/extra.css
└── scripts/
    ├── iniciar-technopti.sh
    ├── parar-technopti.sh
    ├── iniciar-docs.sh
    ├── gerar-docs.sh
    ├── parar-docs.sh
    ├── abrir-libreoffice-claro.sh
    └── windows/
        ├── _common.ps1
        ├── iniciar-technopti.ps1
        ├── parar-technopti.ps1
        ├── iniciar-docs.ps1
        ├── gerar-docs.ps1
        └── parar-docs.ps1
```

## O que é versionado

| Caminho | Situação |
|---|---|
| `docs/`, `mkdocs.yml` | Versionados. São a fonte do site. |
| `.github/workflows/` | Versionado. CI, publicação da documentação e release. |
| `Dockerfile`, `.dockerignore` | Versionados. Imagem publicada no GHCR. |
| `docs/assets/materiais/` | Versionado. PDFs, planilhas e DOCX oficiais para download. |
| `docs/assets/arquivo/` | Versionado. Materiais históricos. O ZIP foi sanitizado sem a pasta `.git`. |
| `site/` | Ignorado. É gerado pelo `mkdocs build`. |
| `.mkdocs-venv/` | Ignorado. Ambiente local da documentação. |
| `backend/venv/` | Ignorado. Ambiente local do Python. |
| `frontend/node_modules/` | Ignorado. Dependências do npm. |
| `frontend/dist/` | Ignorado. Build do Vite. |
| `frontend/.env.local` | Ignorado. Configuração local da URL da API. |
| `frontend/.env.example` | Versionado. Modelo de configuração. |
| `__pycache__/`, `*.pyc` | Ignorados. Cache do Python. |
| `.technopti-logs/` | Ignorado. Logs e PIDs dos scripts. |
| `backend/db.sqlite3` e `db.sqlite3.backup` | Versionados de propósito para a demonstração. |

## Scripts

Todos os comandos são executados a partir da raiz do repositório:

| Script | Função |
|---|---|
| `scripts/iniciar-technopti.sh` | Cria os ambientes se necessário e sobe backend e frontend. |
| `scripts/parar-technopti.sh` | Encerra backend e frontend pelas portas e pelos PIDs salvos. |
| `scripts/iniciar-docs.sh` | Serve o MkDocs em `http://127.0.0.1:8000`. |
| `scripts/gerar-docs.sh` | Gera o site com `mkdocs build --clean --strict`. |
| `scripts/parar-docs.sh` | Encerra o servidor da documentação. |
| `scripts/abrir-libreoffice-claro.sh` | Utilitário opcional para abrir planilhas e DOCX no LibreOffice. |

No **Windows**, os equivalentes estão em `scripts/windows/`:

| Script | Função |
|---|---|
| `windows/iniciar-technopti.ps1` | Sobe backend e frontend. |
| `windows/parar-technopti.ps1` | Encerra backend e frontend. |
| `windows/iniciar-docs.ps1` | Serve o MkDocs. |
| `windows/gerar-docs.ps1` | Gera o site com `--strict`. |
| `windows/parar-docs.ps1` | Encerra o servidor da documentação. |

## Backend

O código fica em `backend/`. Os principais arquivos são:

| Arquivo | Responsabilidade |
|---|---|
| `app.py` | Cria o Flask, habilita CORS, registra os blueprints e remove a sessão ao final da requisição. |
| `run.py` | Inicia o backend em `127.0.0.1:5000` sem o modo de recarga, usado pelos scripts. |
| `database.py` | Cria o engine SQLite e uma `scoped_session` (uma sessão por thread/requisição). |
| `models.py` | Define as cinco tabelas e cria o schema no banco. |
| `solver.py` | Monta o modelo PuLP, chama o CBC e devolve status, valor ótimo e variáveis. |
| `routes/problems.py` | Lista, detalha, cria e exclui problemas. |
| `routes/results.py` | Resolve o problema e consulta o último resultado. |
| `tests/test_api.py` | Testes de fumaça usados pelo CI. |
| `api-tester.html` | Página estática para testar as rotas manualmente. |

O caminho do banco é calculado a partir de `backend/database.py`, então o
backend encontra `db.sqlite3` mesmo que seja iniciado da raiz do repositório.

### Sessão por thread

O backend usa `scoped_session` para evitar que duas requisições concorrentes
compartilhem a mesma sessão do SQLAlchemy. O `app.py` registra um
`teardown_appcontext` que chama `session.remove()` ao final de cada requisição.

### Validação e transação

A criação do problema usa `session.flush()` para obter os IDs gerados e
`session.rollback()` quando uma validação falha. O `commit` só acontece depois
de criar problema, variáveis, restrições e coeficientes. Veja o detalhamento em
[Backend e banco](backend.md).

## Banco de dados

### `Problema`

| Coluna | Tipo | Observação |
|---|---|---|
| `idProblema` | Integer | Chave primária. |
| `Nome_Problema` | String(45) | Nome exibido na interface. |
| `Data_Criacao` | Date | Data de criação. |
| `objetivo` | String(200) | `maximize` ou `minimize`. |
| `resolvido` | Boolean | Indica se já foi resolvido. |

### `Variavel_de_Decisao`

| Coluna | Tipo | Observação |
|---|---|---|
| `idVariavel_de_Decisao` | Integer | Chave primária. |
| `Nome` | String(45) | Nome da variável. |
| `Unidade_Medida` | String(45) | Ex.: `projetos`, `contratos`. |
| `Lucro` | Float | Lucro/custo calculado após a resolução. |
| `Coeficiente` | Float | Coeficiente na função objetivo. |
| `Problema_idProblema` | Integer | FK para `Problema`. |

### `Restricao`

| Coluna | Tipo | Observação |
|---|---|---|
| `idRestricao` | Integer | Chave primária. |
| `Tipo` | String(45) | Nome da restrição. |
| `Limite` | Float | Lado direito da restrição. |
| `Operador` | String(5) | `<=`, `>=` ou `=`. |
| `atendida` | Boolean | Preenchido após a resolução. |
| `Problema_idProblema` | Integer | FK para `Problema`. |

### `CoeficienteRestricao`

| Coluna | Tipo | Observação |
|---|---|---|
| `id` | Integer | Chave primária. |
| `valor` | Float | Coeficiente da variável na restrição. |
| `variavel_id` | Integer | FK para `Variavel_de_Decisao`. |
| `restricao_id` | Integer | FK para `Restricao`. |

### `Resultados`

| Coluna | Tipo | Observação |
|---|---|---|
| `idResultados` | Integer | Chave primária. |
| `status` | String(50) | `Optimal`, `Infeasible`, `Unbounded` etc. |
| `Quantidade_Otima` | Float | Valor ótimo da função objetivo. |
| `Problema_idProblema` | Integer | FK para `Problema`. |

O banco não usa `relationship()` do SQLAlchemy: as consultas são feitas
explicitamente nas rotas. O schema é criado por `Base.metadata.create_all(db)`
no import de `models.py`; não há migrações automáticas.

## Frontend

O código fica em `frontend/`. As páginas e os componentes principais são:

### Páginas

| Arquivo | Tela |
|---|---|
| `src/App.jsx` | Define as rotas com React Router. |
| `src/Paginas/RootLayout.jsx` | Layout raiz com cabeçalho e outlet. |
| `src/Paginas/Home.jsx` | Lista de problemas, abertura do relatório e exclusão. |
| `src/Paginas/Problema.jsx` | Cadastro guiado em quatro etapas. |
| `src/Paginas/TelaVisaoGeral.jsx` | Visão geral do problema em edição. |
| `src/Paginas/TelaResultado.jsx` | Resultado, gráfico e exportação em PDF. |
| `src/api.js` | Instância do Axios com a URL da API configurável. |

### Componentes

| Arquivo | Responsabilidade |
|---|---|
| `Abas.jsx` | Navegação entre variáveis e restrições. |
| `CardVariavel.jsx` | Card de variável de decisão. |
| `CardRestricao.jsx` | Card de restrição e vínculo de coeficientes. |
| `CardProblema.jsx` | Card do problema, modal de relatório e exportação em PDF. |
| `GraficoPizza.jsx` | Gráfico de participação das variáveis. |
| `Cabecalho.jsx` | Cabeçalho da aplicação. |
| `BotaoAjuda.jsx` | Ajuda contextual. |

A URL da API vem de `VITE_API_URL`. Em desenvolvimento, o padrão é
`http://127.0.0.1:5000`; no build de produção servido pelo Flask, o padrão é a
própria origem. Copie `frontend/.env.example` para `frontend/.env.local` apenas
se precisar apontar para outro backend.

### Rotas do frontend

| Rota | Tela |
|---|---|
| `/` | Home com a lista de problemas. |
| `/problem` | Cadastro de um novo problema; o resultado é a etapa 4. |

O detalhamento do fluxo, do estado e da integração com a API está em
[Frontend](frontend.md).

## Documentação

| Arquivo | Conteúdo |
|---|---|
| `mkdocs.yml` | Configuração do site, tema, extensões e navegação. |
| `docs/index.md` | Página inicial. |
| `docs/apresentacao.md` | Materiais oficiais da apresentação solo. |
| `docs/roteiro-apresentacao.md` | Roteiro completo em texto. |
| `docs/documentacao-pdf.md` | Documentação técnica e materiais em PDF. |
| `docs/projeto.md` | Contexto, arquitetura e fluxo funcional. |
| `docs/como-executar.md` | Instalação, scripts e solução de problemas. |
| `docs/frontend.md` | Telas, componentes, estado e PDF. |
| `docs/backend.md` | Flask, SQLAlchemy, SQLite e solver. |
| `docs/api.md` | Contrato da API REST. |
| `docs/modelo-matematico.md` | Formulação e solução. |
| `docs/estrutura.md` | Esta página. |
| `docs/mkdocs.md` | Fluxo de edição e publicação do site. |
| `docs/ci-cd.md` | GitHub Actions, releases e pacote GHCR. |
| `docs/faq.md` | Perguntas frequentes. |

O site é gerado em `site/` e não é versionado. Veja
[Documentação (MkDocs)](mkdocs.md).

## Materiais oficiais

Os arquivos para download ficam em `docs/assets/materiais/`:

- `ROTEIRO-APRESENTACAO-TECHNOPTI.pdf` — roteiro para imprimir;
- `Relatorio-Oficial-Technopti.pdf` — backup do relatório da demonstração;
- `EXERCICIO_PROJETO_FINAL.xlsx` — planilha com o Solver;
- `CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx` — cronograma;
- `TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx` — trabalho final.

O roteiro editável em Markdown é `docs/roteiro-apresentacao.md`. Os roteiros
antigos de grupo, a documentação técnica de 36 páginas e o pacote antigo do
projeto (sem a pasta `.git`) ficam em `docs/assets/arquivo/` apenas para
histórico. Veja [Apresentação](apresentacao.md) e
[Documentação em PDF](documentacao-pdf.md).
