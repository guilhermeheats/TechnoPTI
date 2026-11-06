# Frontend do Technopti

Interface web em **React 19 + Vite + Chakra UI v3** para cadastrar, resolver e
consultar problemas de Programação Linear.

## Comandos

```bash
npm install
npm run dev      # desenvolvimento em http://127.0.0.1:5173
npm run build    # gera dist/
npm run preview  # serve o build localmente
npm run lint     # ESLint
```

## Estrutura

```text
src/
├── api.js                  # instância do Axios e URL da API
├── App.jsx                 # rotas com React Router
├── main.jsx                # bootstrap, Provider e Toaster
├── Paginas/
│   ├── RootLayout.jsx      # layout e cabeçalho
│   ├── Home.jsx            # lista e exclusão de problemas
│   ├── Problema.jsx        # fluxo guiado em quatro etapas
│   ├── TelaVisaoGeral.jsx  # revisão antes do cálculo
│   └── TelaResultado.jsx   # resultado, gráfico e PDF
├── componentes/            # cards, abas, gráfico e ajuda
└── components/ui/          # snippets do Chakra UI
```

## API

O frontend chama o backend em `http://127.0.0.1:5000` por padrão. A URL vem de
`VITE_API_URL` e pode ser alterada em `.env.local`; use `.env.example` como
modelo. A instância do Axios fica em `src/api.js`.

A documentação detalhada está em [`docs/frontend.md`](../docs/frontend.md).
