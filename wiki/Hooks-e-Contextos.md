# Hooks e Contextos

---

## Hooks Customizados

### `useTreeBuilder`

**Arquivo:** `src/hooks/useTreeBuilder.ts`

Constrói os nós e arestas do React Flow a partir dos dados familiares e do estado de colapso atual.

```ts
const { nodes, edges } = useTreeBuilder(collapsedNodeIds: Set<string>)
```

**Fluxo interno:**
1. Lê `persons`, `conjugalRelationships` e `parentalRelationships` via `useFamilyData`.
2. Chama `buildFamilyGraph()` para gerar os nós/arestas base (memoizado).
3. Quando há nós colapsados, percorre o grafo de arestas e marca todos os descendentes como `hidden: true`.
4. Executa `applyDagreLayout()` para posicionar os nós visíveis.
5. Retorna os arrays finais de `nodes` e `edges`.

**Dependências de memoização:**
- `baseNodes`/`baseEdges` — recalculados apenas quando os dados da família mudam.
- `nodes`/`edges` finais — recalculados quando `collapsedNodeIds` muda.

---

### `useExpandCollapse`

**Arquivo:** `src/hooks/useExpandCollapse.ts`

Gerencia o conjunto de relacionamentos conjugais cujos ramos de filhos estão colapsados.

```ts
const { collapsedNodeIds, toggle, isCollapsed } = useExpandCollapse()
```

| Retorno | Tipo | Descrição |
|---------|------|-----------|
| `collapsedNodeIds` | `Set<string>` | UUIDs conjugais atualmente colapsados |
| `toggle(uuid)` | `(string) => void` | Adiciona/remove um UUID do conjunto |
| `isCollapsed(uuid)` | `(string) => boolean` | Verifica se um UUID está colapsado |

---

### `useSlideOver`

**Arquivo:** `src/hooks/useSlideOver.ts`

Controla o estado de abertura do painel lateral (SlideOver).

```ts
const { isOpen, selectedPersonId, open, close } = useSlideOver()
```

| Retorno | Tipo | Descrição |
|---------|------|-----------|
| `isOpen` | `boolean` | Se o painel está aberto |
| `selectedPersonId` | `string \| null` | UUID da pessoa selecionada |
| `open(uuid)` | `(string) => void` | Abre o painel para a pessoa informada |
| `close()` | `() => void` | Fecha o painel (mantém `selectedPersonId` para evitar flash) |

---

## Contextos Globais

### `FamilyContext`

**Arquivo:** `src/context/FamilyContext.tsx`

Carrega `family.json` e expõe os dados e helpers de consulta para toda a árvore de componentes.

**Provider:** `<FamilyProvider>`

**Hook de acesso:** `useFamilyData()`

| Valor exposto | Tipo | Descrição |
|---|---|---|
| `persons` | `Person[]` | Lista de todas as pessoas |
| `conjugalRelationships` | `ConjugalRelationship[]` | Lista de relacionamentos conjugais |
| `parentalRelationships` | `ParentalRelationship[]` | Lista de relacionamentos parentais |
| `getPersonById(uuid)` | `(string) => Person \| undefined` | Busca por UUID |
| `getChildrenOf(uuid)` | `(string) => Person[]` | Filhos de uma pessoa |
| `getParentsOf(uuid)` | `(string) => { person, type }[]` | Pais com tipo do vínculo |
| `getSpousesOf(uuid)` | `(string) => { person, relationship }[]` | Cônjuges com relacionamento |
| `getSiblingsOf(uuid)` | `(string) => Person[]` | Irmãos (pessoas que compartilham pelo menos um pai) |

---

### `ThemeContext`

**Arquivo:** `src/context/ThemeContext.tsx`

Gerencia o tema da interface (claro/escuro) com persistência em `localStorage`.

**Provider:** `<ThemeProvider>`

**Hook de acesso:** `useTheme()`

| Valor exposto | Tipo | Descrição |
|---|---|---|
| `theme` | `'dark' \| 'light'` | Tema ativo |
| `toggleTheme()` | `() => void` | Alterna entre temas |

**Persistência:** chave `ag-theme` no `localStorage`. Padrão é `dark`.

**Aplicação do tema:** adiciona/remove a classe `light` no `<html>` — o Tailwind CSS v4 aplica os tokens de cor reativamente.

---

### `TreeCallbacksContext`

**Arquivo:** `src/context/TreeCallbacksContext.tsx`

Passa callbacks de interação do grafo para os nós React Flow sem prop drilling.

**Provider:** `<TreeCallbacksProvider value={...}>`

**Hook de acesso:** `useTreeCallbacks()`

| Callback | Tipo | Descrição |
|---|---|---|
| `onSelectPerson(uuid)` | `(string) => void` | Chamado ao clicar em um PersonNode |
| `onToggleCollapse(uuid)` | `(string) => void` | Chamado ao clicar em um CoupleNode |

> Este contexto é fornecido diretamente por `TreePage` que define os dois callbacks (`open` do SlideOver e `toggle` do expand/collapse).
