# Árvore Genealógica — Wiki

Bem-vindo à documentação do projeto **Árvore Genealógica**, uma SPA (Single Page Application) interativa para visualização e navegação de árvores genealógicas familiares.

---

## Índice

| Página | Descrição |
|--------|-----------|
| [Instalação e Uso](Instalação-e-Uso) | Como rodar o projeto localmente ou com Docker |
| [Arquitetura](Arquitetura) | Estrutura de pastas, fluxo de dados e decisões técnicas |
| [Formato dos Dados](Formato-dos-Dados) | Schema completo do `family.json` |
| [Componentes](Componentes) | Guia dos componentes React da interface |
| [Hooks e Contextos](Hooks-e-Contextos) | Hooks customizados e contextos globais |
| [Internacionalização](Internacionalização) | Sistema i18n (PT-BR / EN) |
| [Deploy](Deploy) | Build de produção e deploy com Docker |

---

## Visão Geral

A aplicação permite visualizar uma família inteira em formato de grafo interativo, onde:

- Cada **pessoa** é um nó clicável que abre um painel lateral com detalhes.
- Cada **casal** é representado por um nó central que conecta os dois parceiros.
- As **arestas** diferenciam visualmente casamentos ativos, casais separados, filiações biológicas e adoções.
- Os **ramos** podem ser expandidos ou colapsados clicando no nó de casal.

### Stack Tecnológica

| Tecnologia | Papel |
|---|---|
| React 19 + TypeScript | UI e tipagem estática |
| Vite 6 | Bundler e dev server |
| @xyflow/react (React Flow 12) | Renderização do grafo |
| @dagrejs/dagre | Layout automático top-bottom |
| React Router v7 | Roteamento SPA |
| react-i18next | Internacionalização |
| Tailwind CSS v4 | Estilização utilitária |

---

## Rotas da Aplicação

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `TreePage` | Árvore genealógica completa com minimapa |
| `/person/:id` | `PersonPage` | Página dedicada de uma pessoa |
