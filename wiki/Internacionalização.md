# Internacionalização (i18n)

A aplicação suporta dois idiomas: **Português Brasileiro (PT-BR)** (padrão) e **Inglês (EN)**.

---

## Stack

- [i18next](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)

---

## Configuração

**Arquivo:** `src/i18n/index.ts`

```ts
i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
    en:      { translation: en },
  },
  lng:         'pt-BR',     // idioma padrão
  fallbackLng: 'pt-BR',     // fallback se chave não existir no idioma ativo
  interpolation: { escapeValue: false },
  supportedLngs: ['pt-BR', 'en'],
});
```

---

## Estrutura de Arquivos

```
src/i18n/
├── index.ts           # Configuração do i18next
└── locales/
    ├── pt-BR.json     # Traduções em Português Brasileiro
    └── en.json        # Traduções em Inglês
```

---

## Namespaces de Tradução

As chaves estão organizadas em grupos temáticos no arquivo JSON:

| Namespace | Exemplos de chaves |
|---|---|
| `tree` | `expand`, `collapse`, `fitView`, `zoomIn`, `zoomOut`, `noData` |
| `person` | `name`, `birthDate`, `deathDate`, `children`, `parents`, `spouse`, `viewProfile` |
| `relationship` | `biological`, `adoptive`, `married`, `divorced`, `cohabiting`, `widowed` |
| `gender` | `male`, `female`, `other` |
| `theme` | `toggleDark`, `toggleLight` |
| `language` | `pt`, `en` |
| `errors` | `personNotFound`, `personNotFoundDesc` |

---

## Uso nos Componentes

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <span>{t('person.birthDate')}</span>;
}
```

### Interpolação

```tsx
// Arquivo de tradução:
// "childrenCount": "{{count}} filho"
// "childrenCount_plural": "{{count}} filhos"

t('person.childrenCount', { count: 3 }) // → "3 filhos"
```

---

## Alternância de Idioma

O componente `LanguageToggle` (em `components/layout/`) chama `i18n.changeLanguage(lang)` ao ser clicado.

A troca é reativa — todos os componentes que usam `useTranslation()` re-renderizam automaticamente.

---

## Adicionar um Novo Idioma

1. Crie o arquivo `src/i18n/locales/es.json` (ou o idioma desejado) seguindo a mesma estrutura de `pt-BR.json`.
2. Importe e registre em `src/i18n/index.ts`:
   ```ts
   import es from './locales/es.json';
   // ...
   resources: { 'pt-BR': { translation: ptBR }, en: { translation: en }, es: { translation: es } },
   supportedLngs: ['pt-BR', 'en', 'es'],
   ```
3. Adicione a opção no componente `LanguageToggle`.
