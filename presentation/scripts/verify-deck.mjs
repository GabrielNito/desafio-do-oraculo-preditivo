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

const pageMatches = deck.match(/^const S\d{2}[A-Za-z0-9_]*: Page =/gm) ?? [];
const noteMatches = deck.match(/^  '[^']*',?$/gm) ?? [];

if (!deck.includes('export default [')) fail('missing default page export');
if (!deck.includes('export const design: DesignSystem')) fail('missing design system');
if (!deck.includes('export const notes')) fail('missing speaker notes');
if (!deck.includes('export const meta: SlideMeta')) fail('missing metadata');
if (!deck.includes("theme: 'technical-oracle'")) fail('missing theme metadata');
if (pageMatches.length !== 6) fail(`expected 6 pages, found ${pageMatches.length}`);
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
  'dtypes: float64(5), str(3)',
], 'notebook outputs');
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
  'variável-alvo',
], 'deck evidence');

if (/(?:R²|RMSE|MAPE|MAE)\s*[:=]\s*\d/i.test(deck)) fail('deck contains an unverified metric value');
if (/(?:modelo vencedor|modelo recomendado|random forest venceu|svr venceu|regressão linear venceu)/i.test(deck)) fail('deck contains an unverified verdict');
if (!/ainda não|a definir|não realizado/i.test(deck)) fail('deck does not mark unfinished work');

console.log('deck evidence verification passed');
