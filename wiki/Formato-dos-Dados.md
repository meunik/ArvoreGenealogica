# Formato dos Dados (`family.json`)

O arquivo `src/data/family.json` é a **única fonte de dados** da aplicação. Ele possui três coleções principais ligadas por UUIDs.

---

## Estrutura Raiz

```ts
{
  "persons": Person[],
  "conjugalRelationships": ConjugalRelationship[],
  "parentalRelationships": ParentalRelationship[]
}
```

---

## `Person`

Representa um indivíduo da família.

```jsonc
{
  "uuid": "p-001",              // Identificador único (string livre, ex: "p-001")
  "firstName": "Carlos",
  "lastName": "Mendes",
  "gender": "male",             // "male" | "female" | "other"
  "photo": "url-ou-base64",     // (opcional) URL ou base64 da foto
  "birthDate": "1950-03-15",    // (opcional) formato "YYYY-MM-DD"
  "deathDate": "2020-11-01",    // (opcional) formato "YYYY-MM-DD"
  "bloodType": "O+",            // (opcional) "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  "phone": "+55 11 99999-0001", // (opcional)
  "email": "carlos@exemplo.com",// (opcional)
  "profession": "Engenheiro",   // (opcional)
  "avatar": {                   // (opcional) configuração do avatar SVG
    "ageGroup": "elderly",      // "child" | "young" | "adult" | "elderly"
    "gender": "male",
    "skinTone": "medium",       // (opcional) "light" | "medium-light" | "medium" | "medium-dark" | "dark"
    "hairColor": "gray",        // (opcional) "black" | "brown" | "blonde" | "red" | "gray" | "white"
    "hasGlasses": false,        // (opcional)
    "clothingStyle": "formal"   // (opcional) "casual" | "formal" | "sporty"
  }
}
```

> Se `avatar` não for fornecido, a aplicação deriva o `ageGroup` automaticamente com base na `birthDate`.

---

## `ConjugalRelationship`

Representa um vínculo conjugal entre duas pessoas.

```jsonc
{
  "uuid": "c-001",
  "partner1Uuid": "p-001",       // UUID do primeiro parceiro
  "partner2Uuid": "p-002",       // UUID do segundo parceiro
  "status": "married",           // "married" | "cohabiting" | "divorced" | "widowed"
  "relationshipType": "marriage",// "marriage" | "civil_union" | "cohabitation"
  "startDate": "1975-06-20",     // (opcional)
  "endDate": "2020-11-01",       // (opcional) data de término (divórcio ou morte)
  "childOrder": ["p-003", "p-004", "p-005"] // (opcional) ordem esquerda→direita dos filhos na árvore
}
```

### Regras de renderização do nó de casal

| Status | Tem filhos | Comportamento |
|--------|-----------|---------------|
| `married` / `cohabiting` | Sim | CoupleNode visível + arestas conjugais |
| `married` / `cohabiting` | Não | CoupleNode oculto + aresta direta entre cônjuges |
| `divorced` / `widowed` | Sim | CoupleNode visível + arestas tracejadas cinza |
| `divorced` / `widowed` | Não | Relacionamento omitido do grafo |

---

## `ParentalRelationship`

Representa o vínculo entre um pai/mãe e um filho.

```jsonc
{
  "uuid": "pr-001",
  "parentUuid": "p-001",                    // UUID do pai ou mãe
  "childUuid": "p-003",                     // UUID do filho
  "conjugalRelationshipUuid": "c-001",      // (opcional) casal que originou o filho
  "type": "biological"                      // "biological" | "adoptive" | "stepparent" | "foster"
}
```

> Quando `conjugalRelationshipUuid` é informado e o relacionamento conjugal existe no grafo, a aresta sai do **CoupleNode**. Caso contrário, a aresta sai diretamente do nó da pessoa (pai/mãe solo).

### Tipos parentais e suas arestas

| Tipo | Aresta | Descrição |
|------|--------|-----------|
| `biological` | `bloodParentalEdge` (sólida) | Filiação biológica |
| `stepparent` | `bloodParentalEdge` (sólida) | Padrasto ou madrasta |
| `adoptive` | `adoptiveParentalEdge` (pontilhada) | Adoção |
| `foster` | `adoptiveParentalEdge` (pontilhada) | Guarda |

> A aresta será `adoptiveParentalEdge` somente se **todos** os registros parentais daquele par casal→filho forem não-biológicos.

---

## Exemplo Mínimo

```json
{
  "persons": [
    { "uuid": "p-001", "firstName": "João",  "lastName": "Silva", "gender": "male"   },
    { "uuid": "p-002", "firstName": "Maria", "lastName": "Silva", "gender": "female" },
    { "uuid": "p-003", "firstName": "Lucas", "lastName": "Silva", "gender": "male"   }
  ],
  "conjugalRelationships": [
    {
      "uuid": "c-001",
      "partner1Uuid": "p-001",
      "partner2Uuid": "p-002",
      "status": "married",
      "relationshipType": "marriage"
    }
  ],
  "parentalRelationships": [
    { "uuid": "pr-001", "parentUuid": "p-001", "childUuid": "p-003", "conjugalRelationshipUuid": "c-001", "type": "biological" },
    { "uuid": "pr-002", "parentUuid": "p-002", "childUuid": "p-003", "conjugalRelationshipUuid": "c-001", "type": "biological" }
  ]
}
```
