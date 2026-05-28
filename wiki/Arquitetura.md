# Arquitetura

## Estrutura de Pastas

```
src/
├── components/
│   ├── avatar/       # SVGs de avatar (8 variantes) + componente seletor
│   ├── layout/       # Header, AppLayout, ThemeToggle, LanguageToggle
│   ├── person/       # PersonHeroCard, PersonInfoGrid, PersonRelationships, PersonBackButton
│   ├── slideover/    # Painel lateral de detalhes (SlideOver)
│   ├── tree/         # PersonNode, CoupleNode, arestas (FamilyEdges), FamilyTree
│   └── ui/           # Componentes genéricos: Badge, Button, InfoRow
├── context/
│   ├── FamilyContext.tsx        # Dados da família + helpers de consulta
│   ├── ThemeContext.tsx         # Tema claro/escuro
│   └── TreeCallbacksContext.tsx # Callbacks do grafo (onNodeClick, etc.)
├── data/
│   └── family.json   # Dados da família (formato flat com UUIDs)
├── hooks/
│   ├── useTreeBuilder.ts      # Constrói nodes/edges com layout Dagre
│   ├── useExpandCollapse.ts   # Gerencia colapso de ramos
│   └── useSlideOver.ts        # Controla abertura do painel lateral
├── i18n/
│   ├── index.ts               # Configuração do i18next
│   └── locales/
│       ├── pt-BR.json
│       └── en.json
├── pages/
│   ├── TreePage.tsx    # Rota "/"
│   └── PersonPage.tsx  # Rota "/person/:id"
├── types/
│   └── index.ts        # Interfaces TypeScript globais
└── utils/
    ├── treeBuilder.ts    # Converte FamilyData em nodes/edges React Flow
    ├── layoutEngine.ts   # Aplica layout Dagre + correções pós-layout
    └── personUtils.ts    # Utilitários: calcAge, formatDate, getDisplayName
```

---

## Fluxo de Dados

```
family.json
    │
    ▼
FamilyContext (carrega e indexa os dados)
    │
    ▼
useTreeBuilder
    ├── buildFamilyGraph()   ← treeBuilder.ts
    │     • Cria PersonNodes e CoupleNodes
    │     • Classifica relacionamentos conjugais
    │     • Gera arestas (marriage, parental, separated, adoptive)
    │
    └── applyDagreLayout()   ← layoutEngine.ts
          • Roda Dagre para posicionamento automático (top-bottom)
          • Pós-layout: ordena irmãos (childOrder)
          • Pós-layout: encaixa casais sem filhos lado a lado
    │
    ▼
FamilyTree (React Flow)
    ├── PersonNode       → clique abre SlideOver ou navega para /person/:id
    └── CoupleNode       → clique colapsa/expande ramo de filhos
```

---

## Tipos de Nós (React Flow)

| Tipo | ID | Visibilidade | Descrição |
|------|----|-------------|-----------|
| `personNode` | `p-{uuid}` | sempre visível | Cartão de uma pessoa |
| `coupleNode` | `c-{conjugalUuid}` | visível se tem filhos OU é ativo | Nó central do casal |

## Tipos de Arestas

| Tipo | Estilo | Quando é usado |
|------|--------|---------------|
| `marriageEdge` | sólida | Casamento / união estável ativo com filhos |
| `cohabitationEdge` | tracejada fina | Coabitação ativa com filhos |
| `separatedEdge` | cinza tracejada | Casal divorciado/viúvo com filhos |
| `bloodParentalEdge` | sólida descendente | Filiação biológica ou padrasto |
| `adoptiveParentalEdge` | pontilhada | Adoção ou guarda |

---

## Lógica de Colapso de Ramos

- O hook `useExpandCollapse` mantém um `Set<string>` com os UUIDs dos relacionamentos conjugais colapsados.
- Ao clicar em um `CoupleNode`, o UUID do relacionamento é adicionado/removido do Set.
- O `useTreeBuilder` percorre o grafo de arestas (ignorando `visualOnly`) e marca todos os descendentes como `hidden: true`.
- O React Flow renderiza apenas os nós e arestas visíveis; o Dagre é re-executado a cada mudança.

---

## Casais sem Filhos

Casais ativos sem filhos recebem tratamento especial para evitar que o Dagre crie um rank artificial:

1. O `CoupleNode` é criado com `hidden: true`.
2. As arestas até o CoupleNode são marcadas `visualOnly: true` (ignoradas pelo Dagre).
3. Uma aresta direta entre os dois cônjuges é renderizada visualmente.
4. O `layoutEngine` detecta que os cônjuges estão em **componentes conectados separados** e encaixa o componente do visitante ao lado do âncora (bounding-box aware).
5. O CoupleNode oculto é posicionado no centro exato dos dois cônjuges.
