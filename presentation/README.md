# Desafio do Oráculo Preditivo — apresentação

Deck Open-slide do projeto de Aprendizagem de Máquina sobre `Ecommerce Customers`.

## Fonte de verdade

O deck deriva do notebook científico em:

```text
../notebooks/ecommerce_customers.ipynb
```

O notebook sustenta a inspeção de `500 × 8`, cinco colunas numéricas, três
textuais/categóricas, zero valores ausentes e zero linhas completamente
duplicadas. O target é `Yearly Amount Spent`; quatro features foram
selecionadas e três textos foram excluídos. A divisão reproduzível é de 400
registros para treino e 100 para teste, com `StandardScaler` ajustado somente
no treino e dentro dos pipelines sensíveis à escala.

O deck acompanha as Etapas 01–06 concluídas no notebook: EDA, cinco
abordagens de regressão, validação cruzada K-Fold no treino, busca pequena de
hiperparâmetros, avaliação no teste, diagnósticos visuais e recomendação. Os
gráficos reproduzíveis ficam em `slides/ecommerce-oracle/assets/`. A conclusão
mantém as ressalvas do notebook: o SVR Linear tem vantagem numérica marginal,
mas a Regressão Linear Múltipla é recomendada neste experimento pelo equilíbrio
entre desempenho, simplicidade e interpretabilidade; isso não é uma aprovação
para produção real.

As figuras analíticas do deck são os PNGs exportados pelo notebook. Em
particular, histogramas, heatmap e boxplots são inseridos diretamente como
imagens proporcionais, sem replotar ou recortar seus dados no React.

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

- `slides/ecommerce-oracle/`: vinte páginas sustentadas pelo notebook atual.
- `slides/ecommerce-oracle/assets/`: gráficos da EDA e dos diagnósticos gerados pelo notebook.
- `themes/technical-oracle.md`: direção visual e componentes fixos.
- `themes/technical-oracle.demo.tsx`: demonstração do tema no painel Themes.
- `scripts/verify-deck.mjs`: checagens de contrato e fidelidade aos outputs do notebook, com contagem dinâmica de páginas e notes.
