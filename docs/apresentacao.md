# Apresentação solo — 5 a 7 minutos

!!! warning "Use somente os arquivos desta página"

    A apresentação atual é **solo, de 5 a 7 minutos**. O arquivo
    `docs/assets/arquivo/roteiro-grupo-final.pdf` é um roteiro antigo de
    **grupo, de 10 a 15 minutos**, e cita outros integrantes. **Não use esse
    arquivo na apresentação solo.**

## Materiais oficiais

!!! info "Caminhos"

    Todos os caminhos são relativos à raiz do repositório. A página
    [Documentação em PDF](documentacao-pdf.md) reúne os downloads.

<div class="file-card file-card--ok" markdown>
**Roteiro editável** <span class="badge badge--ok">Markdown</span>

[`docs/roteiro-apresentacao.md`](roteiro-apresentacao.md)

Fonte principal para editar o texto da apresentação.
</div>

<div class="file-card file-card--ok" markdown>
**Roteiro para imprimir** <span class="badge badge--ok">PDF · 5 páginas A4</span>

[`ROTEIRO-APRESENTACAO-TECHNOPTI.pdf`](assets/materiais/ROTEIRO-APRESENTACAO-TECHNOPTI.pdf)

**Roteiro falado** nas primeiras páginas; **cola rápida, comandos, plano B e
Q&A** na sequência. Inclui o exercício, o Solver da planilha e o cronograma.
</div>

<div class="file-card file-card--ok" markdown>
**Backup do relatório oficial** <span class="badge badge--warn">PDF · 1 página A4</span>

[`Relatorio-Oficial-Technopti.pdf`](assets/materiais/Relatorio-Oficial-Technopti.pdf)

Use somente se a exportação ao vivo do relatório falhar.
</div>

A página que você está lendo e o site em `http://127.0.0.1:8000` são o **hub de
navegação**; o PDF oficial continua sendo o material de apoio da apresentação.

<div class="hero-actions" markdown>

[Baixar roteiro em PDF](assets/materiais/ROTEIRO-APRESENTACAO-TECHNOPTI.pdf){ .md-button .md-button--primary }
[Baixar relatório oficial](assets/materiais/Relatorio-Oficial-Technopti.pdf){ .md-button }
[Abrir documentação em PDF](documentacao-pdf.md){ .md-button }

</div>

## Arquivos de apoio da apresentação

<div class="file-card file-card--ok" markdown>
**Planilha do projeto** <span class="badge badge--ok">XLSX</span>

[`EXERCICIO_PROJETO_FINAL.xlsx`](assets/materiais/EXERCICIO_PROJETO_FINAL.xlsx)

Modelo oficial X1..X5, restrições e solução (50 de X3, Z = 500.000).
O Solver está configurado em `H5`, `G3:K3` e `L9:L11 <= M9:M11`.
</div>

<div class="file-card file-card--ok" markdown>
**Trabalho final** <span class="badge badge--ok">DOCX</span>

[`TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx`](assets/materiais/TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx)

Enunciado e formulação do trabalho.
</div>

<div class="file-card file-card--ok" markdown>
**Cronograma do projeto** <span class="badge badge--ok">XLSX</span>

[`CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx`](assets/materiais/CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx)

Planejamento consolidado das entregas e das tarefas por integrante.
É um documento de apoio, não um roteiro de fala.
</div>

!!! tip "LibreOffice em modo claro (opcional)"

    O script `scripts/abrir-libreoffice-claro.sh` abre os materiais com um
    perfil separado do LibreOffice, sem alterar o perfil normal do usuário.
    Ele é opcional, requer o LibreOffice instalado e é voltado a Linux/macOS.
    No Windows, abra os arquivos diretamente pelo LibreOffice ou pelo Office.

**Abrir pelo terminal:**

```bash
./scripts/abrir-libreoffice-claro.sh --calc docs/assets/materiais/EXERCICIO_PROJETO_FINAL.xlsx
./scripts/abrir-libreoffice-claro.sh --calc docs/assets/materiais/CRONOGRAMA_PROJETO_PROGRAMACAO_LINEAR_ATUALIZADO.xlsx
./scripts/abrir-libreoffice-claro.sh --writer docs/assets/materiais/TRABALHO-FINAL-APLICACAO-PROGRAMACAO-LINEAR.docx
```

## Arquivos que não são o roteiro solo

<div class="file-card file-card--old" markdown>
**Roteiro antigo de grupo** <span class="badge badge--old">Não usar</span>

[`docs/assets/arquivo/roteiro-grupo-final.pdf`](assets/arquivo/roteiro-grupo-final.pdf)

Roteiro de **10–15 minutos**, dividido entre os integrantes. Não é a versão solo.
</div>

<div class="file-card file-card--warn" markdown>
**Documentação técnica histórica** <span class="badge badge--warn">Consulta</span>

[`docs/assets/arquivo/technopti-documentacao-36p.pdf`](assets/arquivo/technopti-documentacao-36p.pdf)

Documentação de **36 páginas** sobre arquitetura e desenvolvimento. Serve de
consulta, não de roteiro de fala. A versão atual está neste site.
</div>

!!! tip "Regra prática"

    Para apresentar, abra **apenas** o `ROTEIRO-APRESENTACAO-TECHNOPTI.pdf`.
    O restante é apoio.

## Estrutura do PDF solo

| Página | Conteúdo |
|---|---|
| **Páginas 1–3** | Checklist, abertura, contexto, arquitetura, demo rápida, exercício/Solver, problema oficial, cronograma, destaques e fechamento. |
| **Páginas 3–5** | Cola rápida: modelo e Solver, cronograma, números da demo, comandos, backup, plano B e perguntas prováveis. |

## Roteiro em 9 blocos

| Tempo | Bloco | O que fazer |
|---|---|---|
| 0:00–0:30 | Abertura | Apresentar o Technopti e os três materiais: exercício, Solver e cronograma. |
| 0:30–1:05 | Contexto | Explicar o problema das planilhas e o estudo de caso da empresa de TI. |
| 1:05–1:30 | Arquitetura | React/Vite/Chakra no frontend; Flask/SQLAlchemy/PuLP/CBC no backend. |
| 1:30–2:50 | Demo rápida | Cadastrar “Demo Rápida” e mostrar o resultado 6 Sites + 4 Apps. |
| 2:50–4:05 | Exercício e Solver | Abrir a planilha, mostrar `H5`, `G3:K3`, `L9:L11 <= M9:M11` e o resultado 50 de X3. |
| 4:05–4:55 | Problema oficial | Abrir o problema salvo e repetir a solução no Technopti. |
| 4:55–5:40 | Cronograma | Mostrar a `Visão Geral` e as abas individuais. |
| 5:40–6:25 | Destaques técnicos | Componentização, validação, solver, persistência e relatório em PDF. |
| 6:25–7:00 | Fechamento | Retomar o ciclo completo e agradecer. |

## Demo simples — valores exatos

| Item | Valor |
|---|---|
| Nome | `Demo Rápida` |
| Objetivo | Maximização |
| Variável `Sites` | Coeficiente `3000`, unidade `projetos` |
| Variável `Apps` | Coeficiente `2000`, unidade `projetos` |
| Restrição “Capacidade da equipe” | `1 Site + 1 App ≤ 10` |
| Restrição “Horas de desenvolvimento” | `2 Sites + 1 App ≤ 16` |
| Resultado esperado | **6 Sites e 4 Apps** |
| Lucro esperado | **R$ 26.000** |
| Restrições | Ambas 100% utilizadas |

!!! tip "Não esqueça do botão Vincular"

    Na tela de restrições, clique em **Vincular** em cada coeficiente antes de
    adicionar a restrição. Esse é o passo que mais causa dúvida na demo.

## Problema oficial — resultado

| Variável | Lucro unitário | Horas Dev. | Horas Esp. | Infraestrutura |
|---|---:|---:|---:|---:|
| Des. Web | 20.000 | 200 | 150 | 20.000 |
| Des. Mobile | 25.000 | 250 | 180 | 25.000 |
| Suporte Téc. Mensal | 10.000 | 80 | 60 | 10.000 |
| Análise de Dados | 30.000 | 300 | 250 | 40.000 |
| Cibersegurança | 35.000 | 350 | 300 | 50.000 |
| **Limite** | | **4.000** | **3.000** | **R$ 500.000** |

**Solução ótima:** 50 contratos de Suporte Técnico Mensal; lucro de **R$ 500.000**;
todas as restrições com folga zero.

**Por que só suporte?** Porque rende **R$ 125 por hora de desenvolvimento**,
contra **R$ 100 por hora** dos demais serviços. O modelo concentra os recursos
no serviço com maior retorno por recurso escasso.

## Checklist antes de começar

- [ ] Backend rodando em `http://127.0.0.1:5000`
- [ ] Frontend rodando em `http://127.0.0.1:5173`
- [ ] Home carregando o problema **“Maximização da Empresa de TI”**
- [ ] Relatório oficial abrindo corretamente
- [ ] Exportação de PDF testada
- [ ] Backup do banco feito (`backend/db.sqlite3.backup`)
- [ ] Planilha do exercício aberta na aba `EX_PROJETO`
- [ ] Solver conferido (`H5`, `G3:K3`, `L9:L11 <= M9:M11`)
- [ ] Cronograma aberto na aba `Visão Geral`
- [ ] Roteiro em PDF baixado
- [ ] Relatório oficial de backup baixado
- [ ] Notificações do sistema desligadas
- [ ] Zoom do navegador em 80–90%
- [ ] Cronômetro visível

## Comandos rápidos

**Iniciar aplicação:**

```bash
./scripts/iniciar-technopti.sh
```

**Parar aplicação:**

```bash
./scripts/parar-technopti.sh
```

**Abrir a documentação:**

```bash
./scripts/iniciar-docs.sh
```

No Windows, use os scripts `.\scripts\windows\iniciar-technopti.ps1`,
`.\scripts\windows\parar-technopti.ps1` e
`.\scripts\windows\iniciar-docs.ps1`.

Depois acesse <http://127.0.0.1:8000>.

## Plano B

- Se a demo simples falhar, abra direto o problema oficial.
- Se o Solver não abrir, mostre a tabela de resultados e explique os campos.
- Se o cronograma não abrir, use a aba `Visão Geral` ou a lista de abas do roteiro.
- Se o backend cair, reinicie com `./scripts/iniciar-technopti.sh`.
- Se o PDF ao vivo falhar, mostre o `Relatorio-Oficial-Technopti.pdf`.
- Se a internet cair, o sistema continua funcionando localmente após a instalação.
- Se o banco for alterado, restaure o backup:

```bash
cd backend
cp db.sqlite3.backup db.sqlite3
```

## Perguntas prováveis

**Por que só suporte?**
Maior lucro por hora escassa: R$ 125/h contra R$ 100/h dos demais.

**A solução é inteira?**
As variáveis são contínuas; os valores inteiros são consequência do modelo.
Para exigir inteiros, seria necessário programação inteira.

**O que acontece se não houver solução?**
O sistema mostra `Infeasible` para restrições conflitantes ou `Unbounded` para
crescimento infinito.

**Qual solver é usado?**
PuLP com CBC; a documentação apresenta o método Simplex.

**Por que usar o Solver da planilha se o Technopti já resolve?**
A planilha foi a validação manual do modelo e do resultado; o Technopti automatiza e padroniza o processo.

**O Solver da planilha é o mesmo do Technopti?**
Não. A planilha usa o Solver do Excel/LibreOffice; o Technopti usa PuLP com CBC. Os dois chegam ao mesmo resultado porque o modelo é o mesmo.

**O que o cronograma mostra?**
A visão consolidada das entregas e o detalhamento das tarefas por frente, com datas e status.

**Como o PDF é gerado?**
No navegador, com `html2pdf.js`, a partir do relatório renderizado.

**Quais as limitações?**
Sem autenticação, um objetivo por problema, variáveis contínuas e banco local SQLite.

Veja mais respostas na página [FAQ](faq.md).

## Ensaio

!!! success "Meta de tempo"

    Faça pelo menos um ensaio cronometrado. O roteiro foi desenhado para
    **5 a 7 minutos**. Se estiver passando de 7 minutos, corte a demonstração
    rápida e mantenha o exercício/Solver, o problema oficial e o cronograma.
