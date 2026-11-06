# CI/CD, releases e pacote

## Visão geral

O projeto usa **GitHub Actions** para validar, documentar e publicar o
Technopti. Os fluxos ficam em `.github/workflows/`:

| Workflow | Quando roda | O que faz |
|---|---|---|
| `ci.yml` | Push em `main`, pull requests e execução manual | Testa o backend, faz lint e build do frontend, valida o MkDocs e constrói a imagem Docker. |
| `docs.yml` | Push em `main` e execução manual | Gera o MkDocs e publica a branch `gh-pages`. |
| `release.yml` | Push de tag `v*` | Cria a release com artefatos e publica a imagem no GHCR. |

## CI — integração contínua

O workflow **CI** executa quatro jobs:

1. **Backend:** instala as dependências e roda os testes de fumaça da API com
   `unittest`.
2. **Frontend:** executa `npm ci`, `npm run lint` e `npm run build`.
3. **Documentação:** instala o MkDocs Material e roda
   `mkdocs build --clean --strict`.
4. **Docker:** constrói a imagem sem publicar, para validar o `Dockerfile`.

### Rodar o equivalente localmente

```bash
cd backend
python -m unittest discover -s tests -v
```

```bash
cd frontend
npm ci
npm run lint
npm run build
```

```bash
python -m pip install -r requirements-docs.txt
mkdocs build --clean --strict
```

No Windows, os mesmos comandos funcionam no PowerShell, trocando a ativação do
ambiente para `.\.mkdocs-venv\Scripts\Activate.ps1` quando necessário.

## Release

As releases são criadas por tag. O fluxo gera:

- `technopti-source-<tag>.zip` — código-fonte versionado na tag;
- `technopti-frontend-<tag>.zip` — build de produção do frontend;
- release notes automáticas do GitHub.

### Criar uma release

```bash
git tag -a v1.0.0 -m "Technopti v1.0.0"
git push origin v1.0.0
```

Acompanhe em **GitHub → Actions → Release**.

Use versões semânticas:

| Tipo | Exemplo | Quando usar |
|---|---|---|
| Major | `v2.0.0` | Mudança incompatível. |
| Minor | `v1.1.0` | Nova funcionalidade compatível. |
| Patch | `v1.0.1` | Correção compatível. |

## Pacote no GHCR

O workflow de release publica uma imagem Docker no **GitHub Container Registry**:

```text
ghcr.io/guilhermeheats/technopti
```

Tags geradas:

- `1.0.0` — versão exata;
- `1.0` — linha minor;
- `latest` — release mais recente.

### Executar a imagem

```bash
docker pull ghcr.io/guilhermeheats/technopti:latest
docker run --rm -p 5000:5000 ghcr.io/guilhermeheats/technopti:latest
```

Acesse <http://127.0.0.1:5000>. A imagem contém:

- o backend Flask com Waitress;
- o build de produção do frontend servido pelo próprio Flask;
- o banco SQLite da demonstração.

O banco fica dentro do container. Para persistir alterações, monte o arquivo
`db.sqlite3` como volume:

```bash
docker run --rm -p 5000:5000 \
  -v "$(pwd)/backend/db.sqlite3:/app/backend/db.sqlite3" \
  ghcr.io/guilhermeheats/technopti:latest
```

!!! note "Visibilidade do pacote"

    Por padrão, pacotes do GHCR podem ficar privados mesmo em repositórios
    públicos. Para permitir o `docker pull` sem autenticação, abra a página do
    pacote no GitHub e altere a visibilidade para **Public**.

## Documentação publicada

O workflow **Docs** publica automaticamente o site na branch `gh-pages`.

Para ativar o site:

1. abra **Settings → Pages** no repositório;
2. escolha **Deploy from a branch**;
3. selecione a branch `gh-pages` e a pasta `/ (root)`;
4. salve e aguarde a publicação.

A URL esperada é:

```text
https://guilhermeheats.github.io/TechnoPTI/
```

## Descrição e tópicos do repositório

A descrição pode ser atualizada pelo `gh`:

```bash
gh repo edit guilhermeheats/TechnoPTI \
  --description "Sistema web de otimização de Programação Linear com Flask, React, PuLP/CBC e documentação MkDocs." \
  --add-topic flask \
  --add-topic react \
  --add-topic linear-programming \
  --add-topic optimization \
  --add-topic mkdocs \
  --add-topic github-actions
```

## Checklist de publicação

- [ ] CI verde no GitHub Actions.
- [ ] Workflow **Docs** concluído e branch `gh-pages` criada.
- [ ] GitHub Pages habilitado em `gh-pages`.
- [ ] Tag `v1.0.0` criada e enviada.
- [ ] Release publicada com os dois ZIPs.
- [ ] Imagem disponível em `ghcr.io/guilhermeheats/technopti`.
- [ ] Descrição e tópicos configurados no repositório.
