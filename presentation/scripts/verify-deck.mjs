import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const deckPath = path.join(root, 'slides', 'ecommerce-oracle', 'index.tsx');
const themePath = path.join(root, 'themes', 'technical-oracle.md');
const demoPath = path.join(root, 'themes', 'technical-oracle.demo.tsx');
const notebookPath = path.resolve(root, '..', 'notebooks', 'ecommerce_customers.ipynb');

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
if (!deck.includes("theme: 'technical-oracle'")) fail('missing theme metadata');
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
requireIncludes(notebookSource, ['df.head()', 'df.shape', 'df.info()', 'df.isnull().sum()', 'df.duplicated().sum()'], 'notebook source');
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
], 'deck evidence');

if (/variável-alvo ainda não foi definida/i.test(deck)) fail('deck retains the stale undefined-target claim');
if (/treino · teste · pré-processamento/i.test(deck)) fail('deck retains the stale pending-preprocessing claim');
if (/(?:R²|RMSE|MAPE|MAE)\s*[:=]\s*\d/i.test(deck)) fail('deck contains an unverified metric value');
if (/(?:modelo vencedor|modelo recomendado|random forest venceu|svr venceu|regressão linear venceu)/i.test(deck)) fail('deck contains an unverified verdict');
if (!/ainda não|a definir|não realizado/i.test(deck)) fail('deck does not mark unfinished work');

console.log('deck evidence verification passed');
