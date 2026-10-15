import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const deckPath = path.join(root, 'slides', 'ecommerce-oracle', 'index.tsx');
const themePath = path.join(root, 'themes', 'technical-oracle.md');
const demoPath = path.join(root, 'themes', 'technical-oracle.demo.tsx');
const notebookPath = path.resolve(root, '..', 'notebooks', 'ecommerce_customers.ipynb');
const assetsPath = path.join(root, 'slides', 'ecommerce-oracle', 'assets');
const requiredAssets = [
  'eda-target-distribution.png',
  'eda-feature-distributions.png',
  'eda-correlation-heatmap.png',
  'eda-outlier-boxplots.png',
  'model-real-vs-pred.png',
  'model-residuals.png',
  'model-residual-distribution.png',
  'model-feature-importances.png',
];

const contractOnly = process.argv.includes('--contract-only');

function fail(message) {
  throw new Error(message);
}

function requireIncludes(value, expected, label) {
  for (const item of expected) {
    if (!value.includes(item)) fail(`${label} missing: ${item}`);
  }
}

if (!fs.existsSync(deckPath)) fail(`missing deck: ${deckPath}`);
if (!fs.existsSync(themePath) || !fs.existsSync(demoPath)) fail('theme bundle is incomplete');
for (const asset of requiredAssets) {
  if (!fs.existsSync(path.join(assetsPath, asset))) fail(`missing EDA asset: ${asset}`);
}

const deck = fs.readFileSync(deckPath, 'utf8');
const theme = fs.readFileSync(themePath, 'utf8');
const demo = fs.readFileSync(demoPath, 'utf8');

const pageMatches = [...deck.matchAll(/^const (S\d{2}[A-Za-z0-9_]*): Page =/gm)].map((match) => match[1]);
const notesBlock = deck.match(/export const notes = \[([\s\S]*?)\] satisfies/);
const noteMatches = notesBlock?.[1].match(/^  '[^']*',?$/gm) ?? [];
const exportedPages = deck.match(/export default \[([\s\S]*?)\] satisfies Page\[\];/);

if (!deck.includes('export default [')) fail('missing default page export');
if (!deck.includes('export const design: DesignSystem')) fail('missing design system');
if (!deck.includes('export const notes')) fail('missing speaker notes');
if (!deck.includes('export const meta: SlideMeta')) fail('missing metadata');
if (!deck.includes("theme: 'academic-paper'")) fail('missing theme metadata');
if (pageMatches.length === 0) fail('no page declarations found');
if (new Set(pageMatches).size !== pageMatches.length) fail('duplicate page declarations found');
if (!exportedPages) fail('missing default page list');
const exportedPageNames = exportedPages[1].split(',').map((page) => page.trim()).filter(Boolean);
if (exportedPageNames.some((page) => !/^S\d{2}[A-Za-z0-9_]*$/.test(page))) fail('default page export contains an invalid page identifier');
if (new Set(exportedPageNames).size !== exportedPageNames.length) fail('duplicate page in default export');
if (exportedPageNames.length !== pageMatches.length) fail(`page declarations and exported pages differ: ${pageMatches.length} vs ${exportedPageNames.length}`);
if (exportedPageNames.some((page, index) => page !== pageMatches[index])) {
  fail(`page declarations and exported pages differ in identity/order: declared ${pageMatches.join(', ')}; exported ${exportedPageNames.join(', ')}`);
}
if (noteMatches.length !== pageMatches.length) fail(`expected one note per page, found ${noteMatches.length}`);
if (/overflow:\s*['"](?:auto|scroll)['"]/.test(deck)) fail('scrolling overflow is not allowed');
if (/\.map\s*\(/.test(deck)) fail('repeated visual elements must be explicit JSX instances');

requireIncludes(theme, ['## Palette', '## Typography', '## Layout', '## Fixed components', '## Motion', '## Aesthetic'], 'theme');
requireIncludes(demo, ['export default [', 'useSlidePageNumber', 'const Title', 'const Footer', 'const Eyebrow'], 'theme demo');

if (contractOnly) {
  console.log('source contract verification passed');
  process.exit(0);
}

if (!fs.existsSync(notebookPath)) fail(`notebook source missing: ${notebookPath}`);
const notebook = JSON.parse(fs.readFileSync(notebookPath, 'utf8'));
const outputText = notebook.cells
  .flatMap((cell) => cell.outputs ?? [])
  .map((output) => [output.text, output.data?.['text/plain']].filter(Boolean).flat().join(''))
  .join('\n');
const notebookSource = notebook.cells.map((cell) => (cell.source ?? []).join('')).join('\n');

requireIncludes(outputText, [
  'Quantidade de linhas: 500',
  'Quantidade de colunas: 8',
  'Quantidade de registros duplicados: 0',
  'Dados utilizados na EDA: 400 registros de treinamento.',
  'Maior associação linear com o target: Length of Membership (0.818)',
  'Menor associação linear com o target: Time on Website (0.010)',
  'Maior correlação absoluta entre features: 0.079',
  'Número de condição da matriz de correlação das features: 1.242',
  'Linhas únicas com pelo menos um candidato a outlier: 18 de 400 (4.50%).',
  'Protocolo da Etapa 02 preservado após a EDA: OK',
  'RESUMO DO AJUSTE DE HIPERPARÂMETROS',
  'DESEMPENHO NA VALIDAÇÃO CRUZADA (K=5 FOLDS)',
  'TABELA COMPARATIVA FINAL (CONJUNTO DE TESTE, N = 100)',
], 'notebook outputs');

const dtypeSummaryMatch = outputText.match(/dtypes:\s*([^\r\n]+)/i);
if (!dtypeSummaryMatch) fail('notebook outputs missing dtype summary');
const dtypeEntries = [...dtypeSummaryMatch[1].matchAll(/([A-Za-z][A-Za-z0-9]*(?:\[[^\]]+\])?)\s*\(\s*(\d+)\s*\)/g)];
const numericDtype = /^(?:u?int(?:8|16|32|64|128)?|float(?:16|32|64|128)|complex(?:64|128))$/i;
const textualDtype = /^(?:str|string|object|category)(?:\[[^\]]+\])?$/i;
const numericColumnCount = dtypeEntries
  .filter(([, type]) => numericDtype.test(type))
  .reduce((total, [, , count]) => total + Number(count), 0);
const textualColumnCount = dtypeEntries
  .filter(([, type]) => textualDtype.test(type))
  .reduce((total, [, , count]) => total + Number(count), 0);
const dtypeColumnCount = dtypeEntries.reduce((total, [, , count]) => total + Number(count), 0);
if (dtypeColumnCount !== 8 || numericColumnCount !== 5 || textualColumnCount !== 3) {
  fail(`notebook dtype structure differs: ${numericColumnCount} numeric, ${textualColumnCount} textual, ${dtypeColumnCount} total`);
}
requireIncludes(notebookSource, [
  'df.head()',
  'df.shape',
  'df.info()',
  'df.isnull().sum()',
  'df.duplicated().sum()',
  'dados_eda = X_train.copy()',
  'y_train.reindex(dados_eda.index)',
  'estatisticas_descritivas',
  'matriz_correlacao_treino',
  'np.linalg.cond',
  'tabela_vif',
  "'IQR'",
  'indices_outliers_unicos',
  'boxplot',
], 'notebook source');
requireIncludes(deck, [
  '500',
  '8',
  'Avg. Session Length',
  'Time on App',
  'Time on Website',
  'Length of Membership',
  'Yearly Amount Spent',
  'zero valores ausentes',
  'zero linhas completamente duplicadas',
  'VARIÁVEL-ALVO',
  '80%',
  '20%',
  '400',
  '100',
  'random_state = 42',
  'StandardScaler',
  'fit_transform()',
  'transform()',
  'Pipeline',
  'Análise exploratória',
  '501,99',
  '0,818',
  '0,079',
  '1,002',
  '1,010',
  '18 linhas únicas',
  '1,5 × IQR',
  'linhas removidas',
  'Dummy',
  'Regressão Linear Múltipla',
  'Random Forest',
  'SVR Linear',
  'SVR RBF',
  'GridSearchCV',
  '−0,0166',
  '0,9848',
  '0,0007',
  '0,9381',
  '0,0527',
  '0,0006',
  '0,9212',
  '0,0574',
  '−0,0362',
  '54,91',
  '12,35%',
  '71,63',
  '0,9778',
  '8,56',
  '1,79%',
  '10,48',
  '0,9336',
  '13,65',
  '2,99%',
  '18,13',
  '0,9780',
  '8,53',
  '0,9613',
  '10,19',
  '2,22%',
  '13,85',
  'não prova normalidade',
  "new URL('./assets/eda-outlier-boxplots.png', import.meta.url).href",
  "new URL('./assets/model-real-vs-pred.png', import.meta.url).href",
  "new URL('./assets/model-residuals.png', import.meta.url).href",
  "new URL('./assets/model-residual-distribution.png', import.meta.url).href",
  "new URL('./assets/model-feature-importances.png', import.meta.url).href",
  'src={outlierBoxplotsImage}',
  'src={correlationHeatmapImage}',
  'src={featureDistributionsImage}',
  'src={realVsPredImage}',
  'src={residualsImage}',
  'src={residualDistributionImage}',
  'src={featureImportancesImage}',
], 'deck evidence');

if (/variável-alvo ainda não foi definida/i.test(deck)) fail('deck retains the stale undefined-target claim');
if (/treino · teste · pré-processamento/i.test(deck)) fail('deck retains the stale pending-preprocessing claim');
if (/EDA completa ainda não foi realizada/i.test(deck)) fail('deck retains the stale pending-EDA claim');
if (/modelagem pendente/i.test(deck)) fail('deck retains the stale pending-modeling claim');
if (/a construir/i.test(deck) || /métricas não calculadas/i.test(deck)) fail('deck retains a stale unfinished-work claim');
if (!/outlierBoxplotsImage[^\n]*objectFit: 'contain'/.test(deck)) {
  fail('boxplot must preserve its notebook aspect ratio without cropping');
}
if (!/RECOMENDADO/i.test(deck) || !/NÃO APROVA USO EM PRODUÇÃO REAL/i.test(deck)) {
  fail('deck is missing the bounded recommendation and production caveat');
}
if (!/não é uma validação externa/i.test(deck) || !/não substitui nova validação/i.test(deck)) {
  fail('deck is missing validation caveats');
}

console.log('deck evidence verification passed');
