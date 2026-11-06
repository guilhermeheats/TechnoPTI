---
title: "Roteiro de Apresentação — Technopti"
subtitle: "Apresentação solo | 5 a 7 minutos"
date: "22 de outubro de 2026"
---

# Antes de começar

| Checklist | |
|---|---|
| ☐ Backend em `127.0.0.1:5000` | ☐ Frontend em `127.0.0.1:5173` |
| ☐ Home com o problema oficial | ☐ Relatório oficial abrindo |
| ☐ Exportação de PDF testada | ☐ Backup do banco feito |
| ☐ Planilha do exercício aberta | ☐ Solver conferido |
| ☐ Cronograma na `Visão Geral` | ☐ Abas individuais conferidas |
| ☐ PDF de backup salvo | ☐ Notificações desligadas |
| ☐ Zoom do navegador em 80–90% | ☐ Cronômetro visível |
| ☐ Arquivos de apoio abertos | ☐ Janelas posicionadas |

> **Janelas:** deixe o Technopti na Home, a planilha `docs/assets/materiais/EXERCICIO_PROJETO_FINAL.xlsx` na aba `EX_PROJETO` e o `docs/assets/materiais/CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx` na aba `Visão Geral`. Se quiser o LibreOffice em modo claro, use `./scripts/abrir-libreoffice-claro.sh`.

# Roteiro falado

## 0:00–0:30 — Abertura

> “Boa tarde. Este é o Technopti, uma aplicação web que automatiza a modelagem e a resolução de problemas de Programação Linear. Hoje eu vou mostrar o exercício que usamos como base, o Solver da planilha e o cronograma do projeto — e, no fim, como o Technopti executa esse mesmo ciclo.”

## 0:30–1:05 — Contexto

> “O problema é uma empresa de TI com cinco serviços. Ela precisa decidir quantos contratos fechar para maximizar o lucro, respeitando horas de desenvolvimento, horas de especialistas e orçamento de infraestrutura. É um problema clássico de alocação de recursos, normalmente resolvido em planilhas — com risco de erro, retrabalho e pouca rastreabilidade. O Technopti transforma esse processo em um fluxo guiado, validado e rastreável.”

## 1:05–1:30 — Arquitetura

> “A aplicação tem frontend React com Vite e Chakra UI, backend Flask com SQLAlchemy e PuLP, solver CBC e banco SQLite. O fluxo é: cadastrar o problema, validar os dados, montar o modelo, resolver e gerar o relatório.”

## 1:30–2:50 — Demonstração rápida

> “Vou fazer um cadastro curto para mostrar o fluxo.”

1. Home → **Criar problema**.
2. Nome: `Demo Rápida`; objetivo: **Maximização**.
3. Adicionar variável `Sites`, coeficiente `3000`, unidade `projetos`.
4. Adicionar variável `Apps`, coeficiente `2000`, unidade `projetos`.
5. Aba **Restrições**:
   - `Capacidade da equipe`: Sites `1`, Apps `1`, operador `<=`, limite `10`.
   - `Horas de desenvolvimento`: Sites `2`, Apps `1`, operador `<=`, limite `16`.
6. Em cada coeficiente, clicar em **Vincular** antes de adicionar a restrição.
7. **Seguinte** → **Calcular**.

> “O resultado é 6 Sites e 4 Apps, com lucro de R$ 26.000. As duas restrições ficaram 100% utilizadas. O gráfico mostra a participação de cada variável e o PDF é gerado automaticamente.”

Mostrar o gráfico e clicar em **Exportar como PDF**.

## 2:50–4:05 — Exercício e Solver da planilha

1. Trocar para `docs/assets/materiais/EXERCICIO_PROJETO_FINAL.xlsx`, aba `EX_PROJETO`.
2. Apontar para o modelo à esquerda e para a tabela à direita.

> “Este é o exercício que usamos como referência. O modelo está escrito à esquerda e implementado à direita. Temos cinco variáveis de decisão, X1 a X5, que representam os cinco serviços. A função objetivo está em H5: maximizar 20.000 X1 + 25.000 X2 + 10.000 X3 + 30.000 X4 + 35.000 X5.”

> “As restrições estão nas linhas 9 a 11: horas de desenvolvimento, horas de especialistas e orçamento de infraestrutura. A coluna L calcula o consumo e a coluna M traz os limites: 4.000, 3.000 e 500.000.”

3. Abrir **Tools → Solver** no LibreOffice (em português, **Ferramentas → Solver**); no Excel, **Dados → Solver**.
4. Mostrar os campos já preenchidos: destino `$H$5`, **Maximum/Máximo**, células variáveis `$G$3:$K$3`, restrições `$L$9:$L$11 <= $M$9:$M$11`.

> “O modelo do Solver está salvo na própria planilha. A célula de destino é H5, o objetivo é maximizar, as células variáveis são G3:K3, e as restrições são L9:L11 menores ou iguais a M9:M11. Também marcamos as variáveis como não negativas.”

5. Fechar o Solver e apontar para o resultado na planilha.

> “A solução encontrada é 50 contratos de Suporte Técnico Mensal, com Z igual a 500.000. Na planilha, isso aparece como 0, 0, 50, 0, 0 em G3:K3 e 500.000 em H5. As três restrições ficam no limite. O motivo é o retorno por hora escassa: R$ 125 por hora de desenvolvimento, contra R$ 100 dos outros serviços.”

> **Nota:** o Solver já vem preenchido com o modelo salvo. Para a apresentação, basta mostrar os campos e o resultado. Se quiser demonstrar, clique em **Resolver/Solve**; o resultado será o mesmo.

## 4:05–4:55 — Problema oficial no Technopti

1. Voltar ao navegador, Home.
2. Abrir o problema **“Maximização da Empresa de TI”**.

> “Aqui está o mesmo problema cadastrado no Technopti. São cinco variáveis e três restrições. O sistema resolve com PuLP e CBC e devolve 50 contratos de Suporte Técnico Mensal, com lucro de R$ 500.000. As três restrições ficam no limite: 4.000 horas de desenvolvimento, 3.000 horas de especialistas e R$ 500.000 de infraestrutura.”

> “O resultado é exatamente o mesmo da planilha — o que muda é o processo. O modelo é construído e validado pelo sistema, o resultado fica persistido e o relatório é gerado automaticamente.”

Mostrar a tabela de restrições e o relatório já gerado.

## 4:55–5:40 — Cronograma do projeto

1. Trocar para `docs/assets/materiais/CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx`, aba `Visão Geral`.
2. Mostrar a legenda de status e as colunas de entrega.

> “Este é o cronograma do projeto. A aba **Visão Geral** consolida as entregas, os papéis e o foco técnico de cada frente, com o status de cada tarefa. As abas individuais detalham as tarefas de cada frente e permitem acompanhar o que estava previsto para cada data.”

> “O planejamento está organizado em quatro entregas — 28/05, 03/06, 11/06 e 17/06 — e a visão consolidada permite comparar o andamento de todas as frentes. Foi esse cronograma que guiou a divisão do trabalho e o acompanhamento do escopo.”

3. Abrir uma aba individual rapidamente e voltar à `Visão Geral`.

## 5:40–6:25 — Destaques técnicos

> “No frontend, o sistema é componentizado e valida os campos. No backend, o JSON vira um modelo PuLP; o CBC retorna Optimal, Infeasible ou Unbounded, e o sistema calcula uso e folga de cada restrição. Tudo é persistido em cinco entidades: problema, variável, restrição, coeficiente e resultado.”

> “A planilha foi a validação manual; o Technopti industrializa esse processo.”

## 6:25–7:00 — Fechamento

> “O Technopti fecha o ciclo completo: modelagem, resolução, análise e relatório. A planilha mostra a base matemática; o Solver valida o resultado; o cronograma mostra como o projeto foi conduzido; e a aplicação transforma tudo isso em um fluxo guiado, rastreável e repetível. Obrigado.”

> **Se estiver atrasado:** corte a demonstração rápida e vá direto ao problema oficial. Mantenha o bloco do exercício/Solver e o cronograma, que são o foco desta versão.

> **Fim do roteiro falado.** A partir daqui estão a cola rápida, os comandos e as respostas para a banca.

# Cola rápida

## Exercício e Solver da planilha

**Arquivo:** `docs/assets/materiais/EXERCICIO_PROJETO_FINAL.xlsx` — aba `EX_PROJETO`

**Modelo:**

```text
Max Z = 20000X1 + 25000X2 + 10000X3 + 30000X4 + 35000X5
200X1 + 250X2 + 80X3 + 300X4 + 350X5 <= 4000
150X1 + 180X2 + 60X3 + 250X4 + 300X5 <= 3000
20000X1 + 25000X2 + 10000X3 + 40000X4 + 50000X5 <= 500000
X1..X5 >= 0
```

| Item | Referência |
|---|---|
| Variáveis de decisão | `G3:K3` (X1..X5) |
| Função objetivo | `H5` = `SUMPRODUCT(G2:K2,G3:K3)` |
| Restrições | `L9:L11 <= M9:M11` |
| Limites | 4.000 / 3.000 / 500.000 |
| Configuração do Solver | maximizar `H5`, variando `G3:K3`, sujeito a `L9:L11 <= M9:M11`, variáveis não negativas |
| Resultado | `G3:K3 = 0, 0, 50, 0, 0`; `H5 = 500.000` |

**Células das restrições:** `L9:L11` usam `SUMPRODUCT` dos coeficientes da respectiva linha por `G3:K3`.

| Restrição | Célula | Limite |
|---|---|---|
| Horas de desenvolvimento | `L9` | `M9` = 4.000 |
| Horas de especialistas | `L10` | `M10` = 3.000 |
| Infraestrutura | `L11` | `M11` = 500.000 |

**Como mostrar:** abra **Tools → Solver** no LibreOffice (em português, **Ferramentas → Solver**; no Excel, **Dados → Solver**). O modelo já vem preenchido; mostre os campos e feche. Se quiser, clique em **Resolver/Solve**; o resultado será o mesmo. O Solver do Excel fica salvo na planilha e o LibreOffice Calc reconhece os campos ao abrir.

## Cronograma do projeto

**Arquivo:** `docs/assets/materiais/CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx`

| Aba | Conteúdo |
|---|---|
| `Visão Geral` | Consolidação das entregas, papéis, foco técnico e status |
| `Guilherme` | Governança do repositório, contrato de API, revisão e homologação |
| `Vinícius` | Setup do frontend, formulário objetivo, integração com a API e UX |
| `Éric` | Backend Flask, algoritmo Simplex/PuLP, API e code freeze |
| `Otávio + Adria` | Documentação MkDocs, fundamentação matemática, arquitetura e revisão |

**Entregas planejadas:** 28/05, 03/06, 11/06 e 17/06. A `Visão Geral` registra a apresentação em 18/06/2026; confira se essa é a data real antes de citá-la.

**Status:** a primeira entrega aparece como `CONCLUÍDO`; as demais estão como `Pendente` nas abas individuais. Se a apresentação for depois da execução, atualize a planilha ou apresente-a como cronograma planejado.

**Frase-chave:** “A Visão Geral consolida as entregas e o status; as abas individuais detalham as tarefas de cada frente.”

## Números da demonstração

**Demo simples — “Demo Rápida”**

| Item | Valor |
|---|---|
| Objetivo | Maximizar |
| Variável `Sites` | Coeficiente 3.000 / unidade “projetos” |
| Variável `Apps` | Coeficiente 2.000 / unidade “projetos” |
| Restrição “Capacidade da equipe” | 1 Site + 1 App ≤ 10 |
| Restrição “Horas de desenvolvimento” | 2 Sites + 1 App ≤ 16 |
| Resultado esperado | 6 Sites e 4 Apps |
| Lucro esperado | R$ 26.000 |
| Restrições | Ambas 100% utilizadas |

**Problema oficial — “Maximização da Empresa de TI”**

| Variável | Lucro | Horas Dev. | Horas Esp. | Infraestrutura |
|---|---:|---:|---:|---:|
| Des. Web | 20.000 | 200 | 150 | 20.000 |
| Des. Mobile | 25.000 | 250 | 180 | 25.000 |
| Suporte Téc. Mensal | 10.000 | 80 | 60 | 10.000 |
| Análise de Dados | 30.000 | 300 | 250 | 40.000 |
| Cibersegurança | 35.000 | 350 | 300 | 50.000 |
| **Limite** | | **4.000** | **3.000** | **500.000** |

**Resultado:** 50 contratos de Suporte Técnico Mensal; lucro de **R$ 500.000**; todas as restrições com folga zero.

## Comandos

> **Atalho:** na raiz do projeto, `./scripts/iniciar-technopti.sh` sobe os dois servidores e `./scripts/parar-technopti.sh` encerra. No Windows, use `.\scripts\windows\iniciar-technopti.ps1` e `.\scripts\windows\parar-technopti.ps1`.


**Backend — 1ª vez**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
python run.py
```

**Frontend — 1ª vez (outro terminal)**

```bash
cd frontend
npm install
npm run dev
```

Nas próximas vezes, pule a criação da venv, o `pip install` e o `npm install`. Basta ativar a venv e rodar `python run.py` e `npm run dev`.

**Teste rápido da API**

```bash
curl http://127.0.0.1:5000/problems
```

**Arquivos de apoio no modo claro**

```bash
./scripts/abrir-libreoffice-claro.sh --calc docs/assets/materiais/EXERCICIO_PROJETO_FINAL.xlsx
./scripts/abrir-libreoffice-claro.sh --calc docs/assets/materiais/CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx
./scripts/abrir-libreoffice-claro.sh --writer docs/assets/materiais/TRABALHO-FINAL*.docx
```


## Backup e emergência

```bash
cd backend
cp db.sqlite3 db.sqlite3.backup
```

Restaurar: `cp db.sqlite3.backup db.sqlite3`

Verificar portas: `ss -ltnp | grep -E ':5000|:5173'`

Encerrar processo, se necessário: `fuser -k 5000/tcp` e `fuser -k 5173/tcp`

## Plano B

- Se a demo simples falhar, abra direto o problema oficial.
- Se o Solver não abrir, mostre a tabela de resultados e explique os campos; o resultado já está na planilha.
- Se o cronograma não abrir, use a `Visão Geral` ou mostre a lista de abas deste roteiro.
- Se o backend cair, reinicie com `python run.py`.
- Se o PDF falhar, mostre o PDF de backup.
- Se a internet cair, o sistema continua funcionando localmente após a instalação.

## Perguntas prováveis

**Por que só suporte?** Maior lucro por hora escassa: R$ 125/h contra R$ 100/h.

**A solução é inteira?** Variáveis contínuas; os valores inteiros são consequência do modelo.

**Se não houver solução?** O sistema mostra `Infeasible` (restrições conflitantes) ou `Unbounded` (crescimento infinito).

**Qual solver?** PuLP com CBC; a documentação apresenta o método Simplex.

**Por que usar o Solver da planilha se o Technopti já resolve?** A planilha foi a validação manual do modelo e do resultado; o Technopti automatiza e padroniza o processo.

**O Solver da planilha é o mesmo do Technopti?** Não. A planilha usa o Solver do Excel/LibreOffice; o Technopti usa PuLP com CBC. Os dois chegam ao mesmo resultado porque o modelo é o mesmo.

**O que o cronograma mostra?** A visão consolidada das entregas e o detalhamento das tarefas por frente, com datas e status.

**As datas do cronograma são as da apresentação?** A `Visão Geral` registra 18/06/2026; confirme a data real antes de citar.

**Como o PDF é gerado?** No navegador, com `html2pdf.js`.

**Limitações?** Sem autenticação, um objetivo por problema, variáveis contínuas e banco local SQLite.

**Diferença entre coeficientes?** O da função objetivo é o lucro/custo por unidade; o da restrição é o consumo de recurso por unidade.
