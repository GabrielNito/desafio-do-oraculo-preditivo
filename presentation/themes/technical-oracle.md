---
name: Technical Oracle
description: Explainer técnico de Machine Learning em campo quase preto, com fluxo de dados, nós estruturais e estados pendentes tratados com precisão.
mode: dark
---

# Technical Oracle

## Palette

| Role | Value | Notes |
| --- | --- | --- |
| bg | `#08090B` | fundo quase preto, sem preto absoluto |
| text | `#F1F1EE` | off-white para leitura em projetor |
| accent | `#55B7D9` | dados, conexões ativas e foco narrativo |
| muted | `#77808C` | labels, notas auxiliares e metadados |
| surface | `#11151A` | módulos técnicos e blocos de dados |
| line | `#27313A` | linhas e contornos discretos |
| soft | `#A4DCEC` | valores destacados e texto técnico secundário |
| attention | `#C9A86A` | somente para algo ainda pendente ou a decidir |

## Typography

- Display font: `Arial, Helvetica, sans-serif` — peso 800–900, tracking apertado em títulos curtos.
- Body font: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` — peso 400–600.
- Mono labels: `SFMono-Regular, "Cascadia Code", "Roboto Mono", ui-monospace, Menlo, monospace` — nomes de colunas, métricas, estados e metadados.
- Webfont import: omitido; o tema usa stacks disponíveis no sistema.
- Type-scale overrides:
  - Hero title: 168 px.
  - Section heading: 96 px.
  - Page heading: 72 px.
  - Body text: 36 px.
  - Caption / label: 22 px.

## Layout

- Content padding: 128 px; páginas hero podem usar 152 px (1920 × 1080).
- Alignment: editorial e assimétrico; diagramas ocupam o centro, labels começam em uma borda precisa.
- Grid notes: grid técnico implícito de 12 colunas, com linhas a cada 96 px e máscara radial suave.
- Recurring geometry: módulos com cantos mínimos (`6–8 px`), linhas de `1 px`, nós simples e bastante negative space.
- Footer: linha de base discreta; nome do deck à esquerda e página atual à direita.

## Fixed components

### Title

```tsx
const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 168,
      fontWeight: 900,
      lineHeight: 0.98,
      letterSpacing: '-0.055em',
      margin: 0,
      color: '#F1F1EE',
    }}
  >
    {children}
  </h1>
);
```

### Footer

```tsx
import { useSlidePageNumber } from '@open-slide/core';

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 128,
        right: 128,
        bottom: 42,
        paddingTop: 14,
        borderTop: '1px solid #27313A',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'SFMono-Regular, "Cascadia Code", "Roboto Mono", ui-monospace, Menlo, monospace',
        fontSize: 19,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#77808C',
      }}
    >
      <span>DESAFIO DO ORÁCULO · ECOMMERCE CUSTOMERS</span>
      <span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  );
};
```

### Eyebrow / accents

```tsx
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontFamily: 'SFMono-Regular, "Cascadia Code", "Roboto Mono", ui-monospace, Menlo, monospace',
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#55B7D9',
    }}
  >
    {children}
  </div>
);
```

## Motion

- Philosophy: subtle. A mesma subida/dissolve de 200 ms mantém o fluxo contínuo; não há animação decorativa.
- Reusable keyframes:

```css
@keyframes technicalOracleFadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

## Aesthetic

Minimal technical editorial: campo quase preto, tipografia off-white, cyan frio
para conexões e uma camada de cinzas para o que ainda não foi decidido. A
linguagem vem da apresentação de Nuvem e Segurança: camadas, fluxos, nós e
relações explícitas. O tema não usa gradientes decorativos, cards em excesso,
fotografias, emojis, brilho neon, ilustrações stock ou resultados preenchidos
por aparência.

## Example usage

```tsx
const Cover: Page = () => (
  <div style={{ width: '100%', height: '100%', background: '#08090B', color: '#F1F1EE', padding: '0 152px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Eyebrow>GRUPO 01 · APRENDIZAGEM DE MÁQUINA</Eyebrow>
    <Title>Dados → previsão</Title>
    <p style={{ fontSize: 36, color: '#77808C', maxWidth: 1040, marginTop: 32 }}>
      Um explainer visual sobre o que já foi observado no Ecommerce Customers.
    </p>
    <Footer />
  </div>
);
```
