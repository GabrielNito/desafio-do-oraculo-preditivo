# Desafio do Oráculo Preditivo — apresentação

Deck Open-slide do projeto de Aprendizagem de Máquina sobre `Ecommerce Customers`.

## Fonte de verdade

O deck deriva do notebook científico em:

```text
../notebooks/ecommerce_customers.ipynb
```

O estado observado no notebook é inicial: carregamento e inspeção de `500 × 8`,
cinco colunas numéricas, três textuais/categóricas, zero valores ausentes e zero
linhas completamente duplicadas. Ainda não há variável-alvo definida, EDA
completa, pré-processamento, treino/teste, modelos ou métricas.

## Executar localmente

```bash
cd presentation
pnpm install
pnpm dev
```

Abra `http://localhost:5173/s/ecommerce-oracle` ou a página inicial do servidor.
Para validar o bundle estático:

```bash
pnpm build
```

## Organização

- `slides/ecommerce-oracle/`: seis páginas sustentadas pelo notebook atual.
- `themes/technical-oracle.md`: direção visual e componentes fixos.
- `themes/technical-oracle.demo.tsx`: demonstração do tema no painel Themes.
- `scripts/verify-deck.mjs`: checagens de contrato e fidelidade aos outputs do notebook.
