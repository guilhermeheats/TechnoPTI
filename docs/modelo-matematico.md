# Modelo matemático

## Problema oficial

### Variáveis de decisão

| Variável | Descrição | Lucro unitário | Horas Dev. | Horas Esp. | Infraestrutura |
|---|---|---:|---:|---:|---:|
| \(x_1\) | Desenvolvimento Web | 20.000 | 200 | 150 | 20.000 |
| \(x_2\) | Desenvolvimento Mobile | 25.000 | 250 | 180 | 25.000 |
| \(x_3\) | Suporte Técnico Mensal | 10.000 | 80 | 60 | 10.000 |
| \(x_4\) | Análise de Dados | 30.000 | 300 | 250 | 40.000 |
| \(x_5\) | Cibersegurança | 35.000 | 350 | 300 | 50.000 |

### Função objetivo

\[
\max Z = 20000x_1 + 25000x_2 + 10000x_3 + 30000x_4 + 35000x_5
\]

### Restrições

**Horas de desenvolvedores:**

\[
200x_1 + 250x_2 + 80x_3 + 300x_4 + 350x_5 \le 4000
\]

**Horas de especialistas:**

\[
150x_1 + 180x_2 + 60x_3 + 250x_4 + 300x_5 \le 3000
\]

**Orçamento de infraestrutura:**

\[
20000x_1 + 25000x_2 + 10000x_3 + 40000x_4 + 50000x_5 \le 500000
\]

**Não negatividade:**

\[
x_1, x_2, x_3, x_4, x_5 \ge 0
\]

### Solução ótima

| Variável | Valor ótimo |
|---|---:|
| \(x_1\) — Des. Web | 0 |
| \(x_2\) — Des. Mobile | 0 |
| \(x_3\) — Suporte Téc. Mensal | **50** |
| \(x_4\) — Análise de Dados | 0 |
| \(x_5\) — Cibersegurança | 0 |

\[
Z^* = 10000 \times 50 = 500000
\]

**Lucro máximo: R$ 500.000.**

### Verificação das restrições

| Restrição | Cálculo | Uso | Limite | Folga |
|---|---|---:|---:|---:|
| Horas de Desenvolvedores | \(80 \times 50\) | 4.000 | 4.000 | 0 |
| Horas de Especialistas | \(60 \times 50\) | 3.000 | 3.000 | 0 |
| Orçamento de Infraestrutura | \(10000 \times 50\) | 500.000 | 500.000 | 0 |

### Por que apenas Suporte Técnico?

O critério decisivo é o retorno por hora escassa:

| Serviço | Lucro / hora de desenvolvimento |
|---|---:|
| Des. Web | 20.000 / 200 = **R$ 100/h** |
| Des. Mobile | 25.000 / 250 = **R$ 100/h** |
| Suporte Téc. Mensal | 10.000 / 80 = **R$ 125/h** |
| Análise de Dados | 30.000 / 300 = **R$ 100/h** |
| Cibersegurança | 35.000 / 350 = **R$ 100/h** |

O Suporte Técnico Mensal rende mais por hora de desenvolvimento e também por
hora de especialista. Por isso, o modelo concentra todos os recursos nele.

## Demo rápida

### Variáveis

| Variável | Descrição | Coeficiente na função objetivo |
|---|---|---:|
| \(S\) | Sites | 3.000 |
| \(A\) | Apps | 2.000 |

### Função objetivo

\[
\max Z = 3000S + 2000A
\]

### Restrições

**Capacidade da equipe:**

\[
S + A \le 10
\]

**Horas de desenvolvimento:**

\[
2S + A \le 16
\]

**Não negatividade:**

\[
S, A \ge 0
\]

### Solução ótima

| Variável | Valor ótimo |
|---|---:|
| Sites | 6 |
| Apps | 4 |

\[
Z^* = 3000 \times 6 + 2000 \times 4 = 18000 + 8000 = 26000
\]

**Lucro máximo: R$ 26.000.**

Verificação:

- capacidade da equipe: \(6 + 4 = 10\);
- horas de desenvolvimento: \(2 \times 6 + 4 = 16\);
- ambas as restrições com folga zero.

## Método e implementação

O backend usa **PuLP** com o solver **CBC**. O detalhamento do código está em
[Backend e banco](backend.md#solver) e o contrato de resolução em
[API REST](api.md#resolver-problema).

O modelo é configurado assim:

- variáveis contínuas com `lowBound=0`;
- sentido `LpMaximize` ou `LpMinimize`;
- restrições `<=`, `>=` ou `=`;
- status retornado: `Optimal`, `Infeasible`, `Unbounded` etc.;
- em caso de solução ótima, o backend devolve o valor da função objetivo e o
  valor de cada variável.

!!! note "Variáveis contínuas"

    O modelo não impõe integralidade. Os valores inteiros da solução oficial são
    consequência dos coeficientes e das restrições. Para exigir números inteiros
    em todos os casos, seria necessário usar programação inteira.
