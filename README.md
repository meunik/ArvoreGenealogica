# Árvore Genealógica

SPA de árvore genealógica interativa, construída com React + TypeScript + Vite.

## Funcionalidades

- Visualização de árvore genealógica com layout automático (Dagre)
- Suporte a múltiplos casamentos, divórcio, adoção e uniões estáveis
- Expansão/colapso de ramos clicando no nó de casal
- Painel lateral (*slide-over*) com detalhes de cada pessoa
- Página dedicada por pessoa (`/person/:id`)
- Avatares SVG vetoriais com variações por sexo e faixa etária (criança, jovem, adulto, idoso)
- Tema escuro (padrão) e claro com alternância
- Internacionalização PT-BR / EN (padrão PT-BR)
- Minimapa retrátil

## Stack

| Tecnologia | Papel |
|---|---|
| [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) | UI e tipagem |
| [Vite 6](https://vite.dev) | Bundler e dev server |
| [@xyflow/react](https://reactflow.dev) | Renderização do grafo (React Flow 12) |
| [@dagrejs/dagre](https://github.com/dagrejs/dagre) | Layout automático top-bottom |
| [React Router v7](https://reactrouter.com) | Roteamento SPA |
| [react-i18next](https://react.i18next.com) | Internacionalização |
| [Tailwind CSS v4](https://tailwindcss.com) | Estilização (sem config.js) |

## Estrutura

```
src/
├── components/
│   ├── avatar/       # SVGs de avatar (8 variantes) + seletor
│   ├── layout/       # Header, AppLayout, ThemeToggle, LanguageToggle
│   ├── slideover/    # Painel lateral de detalhes
│   ├── tree/         # PersonNode, CoupleNode, arestas, FamilyTree
│   └── ui/           # Badge, Button, InfoRow
├── context/          # ThemeContext, FamilyContext, TreeCallbacksContext
├── data/
│   └── family.json   # Dados da família (formato flat com UUIDs)
├── hooks/            # useTreeBuilder, useExpandCollapse, useSlideOver
├── i18n/             # Configuração i18next + locales pt-BR / en
├── pages/            # TreePage (/), PersonPage (/person/:id)
├── types/            # Interfaces TypeScript globais
└── utils/            # treeBuilder, layoutEngine, personUtils
```

## Formato dos dados (`family.json`)

```jsonc
{
  "persons": [
    {
      "uuid": "p-001",
      "firstName": "Carlos",
      "lastName": "Mendes",
      "gender": "male",
      ...
    }
  ],
  "conjugalRelationships": [
    {
      "uuid": "c-001",
      "partner1Uuid": "p-001",
      "partner2Uuid": "p-002",
      "status": "married",
      ...
    }
  ],
  "parentalRelationships": [
    {
      "uuid": "pr-001",
      "parentUuid": "p-001",
      "childUuid": "p-003",
      "conjugalRelationshipUuid": "c-001",
      "type": "biological"
    }
  ]
}
```

## Instalação e uso

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção em dist/
```