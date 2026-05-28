# Componentes

Guia dos componentes React organizados por categoria.

---

## `components/tree/` — Grafo da Árvore

### `FamilyTree`
Componente principal da página `/`. Integra o `ReactFlow` com os nós, arestas e controles.

- Registra os tipos de nós: `personNode`, `coupleNode`
- Registra os tipos de arestas: `marriageEdge`, `cohabitationEdge`, `separatedEdge`, `bloodParentalEdge`, `adoptiveParentalEdge`
- Exibe minimapa retrátil e controles de zoom/fit

### `PersonNode`
Cartão visual de uma pessoa no grafo.

| Prop (via `data`) | Tipo | Descrição |
|---|---|---|
| `person` | `Person` | Dados completos da pessoa |
| `isCollapsed` | `boolean` | Estado de colapso (não usado diretamente no visual do nó) |
| `hasChildren` | `boolean` | Indica se a pessoa tem filhos |

**Comportamento:**
- Clique → abre o `SlideOver` lateral com detalhes da pessoa.
- Exibe avatar SVG, nome, sobrenome, anos de vida (ou ano de nascimento).
- Pessoas falecidas exibem um badge "✝ Falecido(a)" e avatar com borda cinza.
- Possui handles invisíveis `Top` (target), `Bottom` (source), mais handles extras `couple-out` / `couple-in` para arestas diretas entre cônjuges sem filhos.

### `CoupleNode`
Nó central de um casal. Pequeno círculo colorido entre os dois cônjuges.

| Estado | Visual |
|--------|--------|
| Casal ativo com filhos | Círculo azul clicável com `+` / `−` |
| Casal ativo sem filhos | Oculto (apenas a aresta direta é visível) |
| Casal separado/viúvo com filhos | Círculo cinza clicável com `+` / `−` |

**Comportamento:**
- Clique → chama `onToggleCollapse(conjugalRelationshipUuid)` para colapsar/expandir o ramo de filhos.

### `FamilyEdges` (`components/tree/edges/`)
Registra e exporta os tipos de arestas customizadas:

| Edge Type | Estilo |
|-----------|--------|
| `marriageEdge` | Linha sólida colorida (accent) |
| `cohabitationEdge` | Linha tracejada fina (accent) |
| `separatedEdge` | Linha cinza tracejada |
| `bloodParentalEdge` | Linha sólida descendente |
| `adoptiveParentalEdge` | Linha pontilhada descendente |

---

## `components/avatar/` — Avatares SVG

### `PersonAvatar`
Componente seletor que renderiza o avatar correto com base em `gender` e `ageGroup`.

```tsx
<PersonAvatar person={person} size={44} />
```

| Prop | Tipo | Padrão |
|------|------|--------|
| `person` | `Person` | obrigatório |
| `size` | `number` | `44` |

Se `person.avatar` não estiver definido, o `ageGroup` é derivado automaticamente via `deriveAgeGroup()`.

### Avatares disponíveis (8 variantes)

| Componente | Gênero | Faixa etária |
|-----------|--------|--------------|
| `AvatarChildMale` | male | child |
| `AvatarChildFemale` | female | child |
| `AvatarYoungMale` | male | young |
| `AvatarYoungFemale` | female | young |
| `AvatarAdultMale` | male | adult |
| `AvatarAdultFemale` | female | adult |
| `AvatarElderlyMale` | male | elderly |
| `AvatarElderlyFemale` | female | elderly |

> Gênero `other` usa os avatares masculinos por padrão.

---

## `components/slideover/` — Painel Lateral

### `SlideOver`
Container principal do painel lateral. Controla animação de abertura/fechamento.

- Recebe `isOpen`, `onClose` e `selectedPersonId`.
- Composto por: `SlideOverBackdrop`, `SlideOverHeader`, `SlideOverPersonInfo`, `SlideOverRelationships`, `SlideOverFooter`.

### `SlideOverPersonInfo`
Exibe avatar, nome completo, anos de vida, tipo sanguíneo e status (vivo/falecido).

### `SlideOverRelationships`
Lista pais, cônjuges/ex-cônjuges, filhos e irmãos da pessoa selecionada, usando `useFamilyData`.

### `SlideOverFooter`
Botão "Ver perfil completo" que navega para `/person/:id`.

---

## `components/person/` — Página de Pessoa

Componentes usados exclusivamente em `PersonPage`:

| Componente | Descrição |
|-----------|-----------|
| `PersonBackButton` | Botão "← Voltar à árvore" |
| `PersonHeroCard` | Avatar grande + nome + dados principais |
| `PersonInfoGrid` | Grid com informações detalhadas (nascimento, profissão, contato, etc.) |
| `PersonRelationships` | Seção de relacionamentos (pais, cônjuges, filhos, irmãos) |

---

## `components/layout/` — Layout Global

### `AppLayout`
Wrapper da aplicação. Aplica a classe de tema e envolve as rotas.

### `Header`
Barra superior com título da aplicação, `ThemeToggle` e `LanguageToggle`.

### `ThemeToggle`
Botão que alterna entre tema claro e escuro via `ThemeContext`.

### `LanguageToggle`
Botão que alterna entre PT-BR e EN via `i18n.changeLanguage()`.

---

## `components/ui/` — Componentes Genéricos

| Componente | Uso |
|-----------|-----|
| `Button` | Botão estilizado com variantes `default` e `outline` |
| `Badge` | Tag colorida para status e tipos |
| `InfoRow` | Linha de informação com ícone, label e valor |
