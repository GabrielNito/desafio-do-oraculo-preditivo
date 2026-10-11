# Desafio do Oráculo Preditivo — apresentação

Deck Open-slide do projeto de Aprendizagem de Máquina sobre `Ecommerce Customers`.

## Fonte de verdade

O deck deriva do notebook científico em:

```text
../notebooks/ecommerce_customers.ipynb
```

O notebook sustenta a inspeção de `500 × 8`, cinco colunas numéricas, três
textuais/categóricas, zero valores ausentes e zero linhas completamente
duplicadas. A Etapa 02 também está refletida no deck: o target é
`Yearly Amount Spent`, quatro features foram selecionadas, três textos foram excluídos, e a
divisão reproduzível é de 400 registros para treino e 100 para teste. O
`StandardScaler` é ajustado somente no treino.

A EDA foi concluída no conjunto de treinamento e está refletida em seis novos
slides: distribuição do target e das features, correlações, heatmap,
multicolinearidade, outliers e síntese. Os gráficos reproduzíveis ficam em
`slides/ecommerce-oracle/assets/`. O deck não apresenta modelos treinados,
métricas, conclusões de desempenho ou vencedor.

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

Para conferir a correspondência entre páginas, speaker notes, tema e evidências
do notebook:

```bash
node scripts/verify-deck.mjs
```

## Organização

- `slides/ecommerce-oracle/`: quinze páginas sustentadas pelo notebook atual.
- `slides/ecommerce-oracle/assets/`: gráficos da EDA gerados pelo notebook.
- `themes/technical-oracle.md`: direção visual e componentes fixos.
- `themes/technical-oracle.demo.tsx`: demonstração do tema no painel Themes.
- `scripts/verify-deck.mjs`: checagens de contrato e fidelidade aos outputs do notebook, com contagem dinâmica de páginas e notes.
