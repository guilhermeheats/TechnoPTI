# Perguntas frequentes

## Por que a solução usa apenas Suporte Técnico Mensal?

Porque é o serviço com maior retorno por hora escassa. Ele rende **R$ 125 por
hora de desenvolvimento**, enquanto os demais rendem **R$ 100 por hora**. Também
é o mais eficiente por hora de especialista e empata no uso de infraestrutura.
Assim, o modelo concentra os recursos nele.

## A solução é inteira?

Não. As variáveis são contínuas (`cat="Continuous"` no PuLP). Os valores inteiros
da solução oficial são consequência dos coeficientes e das restrições. Para
exigir integralidade em todos os casos, seria necessário usar programação inteira.

## O que acontece se o problema for inviável?

O solver retorna `Infeasible`, e o sistema informa que não existe solução viável.
Isso normalmente acontece quando as restrições se contradizem.

## O que acontece se o problema for ilimitado?

O solver retorna `Unbounded`, e o sistema avisa que a função objetivo cresce ou
decresce sem limite. Nesse caso, falta uma restrição de escassez.

## Qual solver é usado?

**PuLP** com o solver **CBC**. O modelo é montado no backend e resolvido
localmente, sem serviço externo.

## Como o PDF é gerado?

No navegador, com **html2pdf.js**, a partir do relatório renderizado no modal.
O PDF é uma captura do relatório, não um documento montado no backend.

## Quais são as limitações?

- Não há autenticação de usuários.
- Cada problema tem um único objetivo.
- As variáveis são contínuas.
- O banco é local (SQLite).
- O backend usa o servidor de desenvolvimento do Flask.
- Não há edição de problema; o fluxo é criar, resolver e excluir.

## Qual é a diferença entre os coeficientes?

| Coeficiente | O que representa |
|---|---|
| Coeficiente da função objetivo | Lucro ou custo por unidade da variável. |
| Coeficiente da restrição | Quanto de um recurso cada unidade da variável consome. |

## Como o sistema valida os dados?

O backend verifica:

- presença de `nome`, `objetivo`, `variaveis` e `restricoes`;
- objetivo `maximize` ou `minimize`;
- pelo menos uma variável e uma restrição;
- operador `<=`, `>=` ou `=`;
- quantidade de coeficientes igual à quantidade de variáveis.

## Por que Flask e React?

**Flask** é leve, direto e adequado para uma API REST pequena com SQLAlchemy e
PuLP. **React** permite componentizar o formulário dinâmico, o gráfico e o
relatório. A separação também deixa o frontend e o backend independentes.

## Como resetar o banco?

Pare o backend e restaure o backup:

```bash
cd backend
cp db.sqlite3.backup db.sqlite3
```

Depois reinicie a partir da raiz do repositório:

```bash
./scripts/iniciar-technopti.sh
```

## O que é o botão Vincular?

Na tela de restrições, cada coeficiente precisa ser associado a uma variável.
O botão **Vincular** confirma essa associação antes de adicionar a restrição.
Sem ele, a restrição não fica completa.

## Posso adicionar mais variáveis e restrições?

Sim. O formulário é dinâmico e o backend aceita qualquer quantidade de variáveis
e restrições, desde que cada restrição tenha um coeficiente para cada variável.

## O relatório mostra variáveis com valor zero?

Sim. O relatório lista todas as variáveis, inclusive as que ficaram com quantidade
zero, para deixar claro o que o modelo decidiu não produzir.

## O sistema funciona offline?

Sim, depois que as dependências estão instaladas. O frontend, o backend, o banco
e o solver rodam localmente. A única dependência externa é a instalação inicial
dos pacotes.

## Por que o backend usa sessão por thread?

Porque o servidor do Flask pode atender requisições concorrentes. Uma única sessão
global do SQLAlchemy não é thread-safe e pode causar erros intermitentes. O
`scoped_session` cria uma sessão por thread e o `teardown_appcontext` a remove ao
final de cada requisição.

## O que é o MkDocs?

MkDocs é o gerador da documentação. A configuração fica em `mkdocs.yml`, o conteúdo
em `docs/` e o site é servido em <http://127.0.0.1:8000> com
`./scripts/iniciar-docs.sh`.
O fluxo completo está em [Documentação (MkDocs)](mkdocs.md).

## Onde está o código do frontend?

Em `frontend/`. A página
[Frontend](frontend.md) descreve telas, componentes, estado e PDF.

## Onde está o código do backend?

Em `backend/`. A página
[Backend e banco](backend.md) descreve rotas, modelos, sessão e solver.

## Onde estão os arquivos da apresentação?

Na página [Apresentação](apresentacao.md). Resumo:

- **Markdown oficial:** `docs/roteiro-apresentacao.md`
- **PDF oficial:** [`ROTEIRO-APRESENTACAO-TECHNOPTI.pdf`](assets/materiais/ROTEIRO-APRESENTACAO-TECHNOPTI.pdf)
- **Backup do relatório:** [`Relatorio-Oficial-Technopti.pdf`](assets/materiais/Relatorio-Oficial-Technopti.pdf)
- **Planilha do exercício:** [`EXERCICIO_PROJETO_FINAL.xlsx`](assets/materiais/EXERCICIO_PROJETO_FINAL.xlsx) (Solver em `H5`, `G3:K3` e `L9:L11 <= M9:M11`)
- **Cronograma do projeto:** [`CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx`](assets/materiais/CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx)
- **Trabalho final:** [`TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx`](assets/materiais/TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx)

A documentação técnica em PDF está na página
[Documentação em PDF](documentacao-pdf.md).

O arquivo `docs/assets/arquivo/roteiro-grupo-final.pdf` é um roteiro antigo de
grupo e **não** deve ser usado na apresentação solo.
