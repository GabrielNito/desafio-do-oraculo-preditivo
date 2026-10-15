import type { CSSProperties, ReactNode } from 'react';
import { useSlidePageNumber } from '@open-slide/core';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#08090B', text: '#F1F1EE', accent: '#55B7D9' },
  fonts: {
    display: 'Arial, Helvetica, sans-serif',
    body: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 168, body: 36 },
  radius: 8,
};

const c = {
  muted: '#77808C',
  surface: '#11151A',
  line: '#27313A',
  soft: '#A4DCEC',
  accent: '#55B7D9',
  attention: '#C9A86A',
  dim: '#4B5661',
};

const mono = 'SFMono-Regular, "Cascadia Code", "Roboto Mono", ui-monospace, Menlo, monospace';
const display = 'Arial, Helvetica, sans-serif';
const targetDistributionImage = new URL('./assets/eda-target-distribution.png', import.meta.url).href;
const featureDistributionsImage = new URL('./assets/eda-feature-distributions.png', import.meta.url).href;
const correlationHeatmapImage = new URL('./assets/eda-correlation-heatmap.png', import.meta.url).href;
const outlierBoxplotsImage = new URL('./assets/eda-outlier-boxplots.png', import.meta.url).href;
const realVsPredImage = new URL('./assets/model-real-vs-pred.png', import.meta.url).href;
const residualsImage = new URL('./assets/model-residuals.png', import.meta.url).href;
const residualDistributionImage = new URL('./assets/model-residual-distribution.png', import.meta.url).href;
const featureImportancesImage = new URL('./assets/model-feature-importances.png', import.meta.url).href;
const easeOut = 'cubic-bezier(0, 0, 0.2, 1)';
const easeIn = 'cubic-bezier(0.4, 0, 1, 1)';

const root: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  boxSizing: 'border-box',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
};

export const transition: SlideTransition = {
  duration: 200,
  exit: {
    duration: 140,
    easing: easeIn,
    keyframes: [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-4px)' }],
  },
  enter: {
    duration: 200,
    delay: 80,
    easing: easeOut,
    keyframes: [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
  },
};

const Grid = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      inset: 0,
      opacity: 0.22,
      pointerEvents: 'none',
      backgroundImage: `linear-gradient(${c.line} 1px, transparent 1px), linear-gradient(90deg, ${c.line} 1px, transparent 1px)`,
      backgroundSize: '96px 96px',
      maskImage: 'radial-gradient(ellipse at center, black, transparent 78%)',
    }}
  />
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div style={{ position: 'absolute', left: 128, right: 128, bottom: 42, paddingTop: 14, borderTop: `1px solid ${c.line}`, display: 'flex', justifyContent: 'space-between', color: c.muted, fontFamily: mono, fontSize: 19, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
      <span>DESAFIO DO ORÁCULO · ECOMMERCE CUSTOMERS</span>
      <span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  );
};

const Eyebrow = ({ children, color = 'var(--osd-accent)' }: { children: ReactNode; color?: string }) => (
  <div style={{ color, fontFamily: mono, fontSize: 22, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{children}</div>
);

const Heading = ({ children }: { children: ReactNode }) => (
  <h1 style={{ margin: '22px 0 0', maxWidth: 1500, fontFamily: 'var(--osd-font-display)', fontSize: 76, lineHeight: 1.02, letterSpacing: '-0.05em', fontWeight: 900 }}>{children}</h1>
);

const Subheading = ({ children, maxWidth = 1100 }: { children: ReactNode; maxWidth?: number }) => (
  <p style={{ margin: '24px 0 0', maxWidth, color: c.muted, fontSize: 32, lineHeight: 1.42 }}>{children}</p>
);

type Stage = 'cover' | 'problem' | 'dataset' | 'structure' | 'quality' | 'state' | 'target' | 'split' | 'scaling' | 'eda-target' | 'eda-features' | 'eda-correlation' | 'eda-heatmap' | 'eda-outliers' | 'eda-summary' | 'models' | 'cv' | 'test' | 'prediction' | 'diagnostics' | 'importance' | 'decision';
type NodeStatus = 'done' | 'active' | 'pending' | 'future';

const FlowNode = ({ label, status }: { label: string; status: NodeStatus }) => {
  const color = status === 'active' ? c.accent : status === 'done' ? c.soft : status === 'pending' ? c.attention : c.dim;
  const background = status === 'active' ? `${c.accent}18` : status === 'pending' ? `${c.attention}10` : c.surface;
  return (
    <div style={{ width: 160, height: 52, boxSizing: 'border-box', border: `1px solid ${color}`, background, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontFamily: mono, fontSize: 18, letterSpacing: '0.08em' }}>
      {label}
    </div>
  );
};

const RailConnector = ({ status }: { status: NodeStatus }) => (
  <div style={{ width: 44, height: 1, background: status === 'active' || status === 'done' ? c.accent : c.line }} />
);

const FlowRail = ({ stage }: { stage: Stage }) => {
  const modelStages: Stage[] = ['models', 'cv', 'test', 'prediction', 'diagnostics', 'importance', 'decision'];
  const predictionStages: Stage[] = ['prediction', 'diagnostics', 'importance', 'decision'];
  const decisionStages: Stage[] = ['decision'];
  const client: NodeStatus = stage === 'cover' ? 'active' : 'done';
  const data: NodeStatus = stage === 'cover' || stage === 'problem' || stage === 'dataset' || stage === 'quality' || stage.startsWith('eda-') ? 'active' : 'done';
  const features: NodeStatus = stage === 'structure' || stage === 'target' ? 'active' : stage === 'problem' || stage === 'dataset' || stage === 'quality' ? 'pending' : 'done';
  const models: NodeStatus = stage === 'models' ? 'active' : modelStages.includes(stage) ? 'done' : 'future';
  const prediction: NodeStatus = stage === 'test' || stage === 'prediction' ? 'active' : predictionStages.includes(stage) ? 'done' : 'future';
  const decision: NodeStatus = stage === 'decision' ? 'active' : decisionStages.includes(stage) ? 'done' : 'future';
  return (
    <div style={{ position: 'absolute', left: 128, bottom: 112, zIndex: 2 }}>
      <div style={{ marginBottom: 12, color: c.muted, fontFamily: mono, fontSize: 16, letterSpacing: '0.16em', textTransform: 'uppercase' }}>pipeline / estado atual</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FlowNode label="CLIENTE" status={client} />
        <RailConnector status={client} />
        <FlowNode label="DADOS" status={data} />
        <RailConnector status={data} />
        <FlowNode label="FEATURES" status={features} />
        <RailConnector status={features} />
        <FlowNode label="MODELOS" status={models} />
        <RailConnector status={models} />
        <FlowNode label="PREVISÃO" status={prediction} />
        <RailConnector status={prediction} />
        <FlowNode label="DECISÃO" status={decision} />
      </div>
    </div>
  );
};

const Frame = ({ children, stage, grid = true }: { children: ReactNode; stage: Stage; grid?: boolean }) => (
  <section style={root}>
    {grid && <Grid />}
    <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    <FlowRail stage={stage} />
    <Footer />
  </section>
);

const Connector = ({ width = 150, color = c.accent }: { width?: number; color?: string }) => (
  <div style={{ width, height: 1, background: color }} />
);

const PredictionNode = ({ label, detail, accent = false }: { label: string; detail: string; accent?: boolean }) => (
  <div style={{ width: 330, minHeight: 112, boxSizing: 'border-box', border: `1px solid ${accent ? c.accent : c.line}`, background: c.surface, padding: '22px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ color: accent ? c.accent : 'var(--osd-text)', fontFamily: mono, fontSize: 25, letterSpacing: '0.08em' }}>{label}</div>
    <div style={{ marginTop: 10, color: c.muted, fontSize: 22 }}>{detail}</div>
  </div>
);

const QualityMetric = ({ value, label, detail }: { value: string; label: string; detail: string }) => (
  <div style={{ width: 520, minHeight: 250, padding: '18px 0 28px', borderTop: `1px solid ${c.line}`, borderBottom: `1px solid ${c.line}` }}>
    <div style={{ color: c.accent, fontFamily: mono, fontSize: 132, lineHeight: 0.95, letterSpacing: '-0.08em' }}>{value}</div>
    <div style={{ marginTop: 24, color: 'var(--osd-text)', fontFamily: mono, fontSize: 24, letterSpacing: '0.08em' }}>{label}</div>
    <div style={{ marginTop: 12, color: c.muted, fontSize: 24 }}>{detail}</div>
  </div>
);

const FieldLine = ({ children, color = c.soft }: { children: ReactNode; color?: string }) => (
  <div style={{ minHeight: 42, boxSizing: 'border-box', borderBottom: `1px solid ${c.line}`, display: 'flex', alignItems: 'center', color, fontFamily: mono, fontSize: 22 }}>{children}</div>
);

const CorrelationRow = ({ label, value, valueText }: { label: string; value: number; valueText: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', minHeight: 72, borderBottom: `1px solid ${c.line}` }}>
    <div style={{ width: 390, color: c.soft, fontFamily: mono, fontSize: 22 }}>{label}</div>
    <div style={{ width: 720, height: 12, background: c.line, position: 'relative' }}>
      <div style={{ width: `${Math.abs(value) * 720}px`, height: 12, background: c.accent }} />
    </div>
    <div style={{ width: 120, marginLeft: 28, color: c.accent, fontFamily: display, fontSize: 34, fontWeight: 800 }}>{valueText}</div>
  </div>
);

const StateLine = ({ children, color = c.soft }: { children: ReactNode; color?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18, minHeight: 54, borderBottom: `1px solid ${c.line}`, color, fontFamily: mono, fontSize: 24 }}>
    <span style={{ color: color === c.attention ? c.attention : c.accent, fontSize: 18 }}>•</span>
    <span>{children}</span>
  </div>
);

// ── SLIDE 01 — Cover ──────────────────────────────────────────────────────
const S01Cover: Page = () => (
  <Frame stage="cover">
    <div style={{ position: 'absolute', left: 152, top: 188, width: 920 }}>
      <Eyebrow>Grupo 01 · Aprendizagem de Máquina</Eyebrow>
      <h1 style={{ margin: '30px 0 0', fontFamily: display, fontSize: 132, lineHeight: 0.94, letterSpacing: '-0.065em', fontWeight: 900 }}>
        DESAFIO DO<br /><span style={{ color: 'var(--osd-accent)' }}>ORÁCULO</span><br />PREDITIVO
      </h1>
      <p style={{ margin: '36px 0 0', color: c.muted, fontSize: 40, lineHeight: 1.35 }}>Ecommerce Customers</p>
      <div style={{ marginTop: 34, color: c.dim, fontFamily: mono, fontSize: 19, letterSpacing: '0.06em' }}>APOLO BASTOS · NICOLAS GABRIEL · CAIO SIMONASSI</div>
      <div style={{ marginTop: 10, color: c.dim, fontFamily: mono, fontSize: 19, letterSpacing: '0.06em' }}>GABRIEL NITO · JÔNATAS</div>
    </div>
    <div style={{ position: 'absolute', right: 218, top: 270, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <PredictionNode label="DADOS" detail="sinais observados" accent />
      <div style={{ height: 44, width: 1, background: c.accent }} />
      <PredictionNode label="MODELO" detail="alternativas avaliadas" />
      <div style={{ height: 44, width: 1, background: c.line }} />
      <PredictionNode label="PREVISÃO" detail="valor contínuo estimado" />
    </div>
  </Frame>
);

// ── SLIDE 02 — Problem ────────────────────────────────────────────────────
const S02Problem: Page = () => (
  <Frame stage="problem">
    <div style={{ position: 'absolute', left: 152, top: 126 }}>
      <Eyebrow>01 · O PROBLEMA</Eyebrow>
      <Heading>O que queremos prever?</Heading>
      <Subheading>O projeto é de regressão. O target agora está confirmado no arquivo real.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 224, top: 470, display: 'flex', alignItems: 'center', gap: 26 }}>
      <PredictionNode label="DADOS DO CLIENTE" detail="comportamento observado" accent />
      <Connector width={112} />
      <div style={{ width: 208, height: 144, border: `1px solid ${c.accent}`, background: `${c.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: c.accent }}>
        <span style={{ fontFamily: mono, fontSize: 20, letterSpacing: '0.12em' }}>TARGET (y)</span>
        <span style={{ marginTop: 16, fontFamily: display, fontSize: 32, fontWeight: 800 }}>CONTÍNUO</span>
      </div>
      <Connector width={92} color={c.line} />
      <PredictionNode label="YEARLY AMOUNT" detail="valor gasto anualmente" />
    </div>
    <div style={{ position: 'absolute', left: 250, top: 715, color: c.accent, fontFamily: mono, fontSize: 22, letterSpacing: '0.1em' }}>REGRESSÃO · TARGET DEFINIDO</div>
  </Frame>
);

// ── SLIDE 03 — Dataset ────────────────────────────────────────────────────
const S03Dataset: Page = () => (
  <Frame stage="dataset">
    <div style={{ position: 'absolute', left: 152, top: 126 }}>
      <Eyebrow>02 · DADOS</Eyebrow>
      <Heading>500 registros. 8 colunas.</Heading>
      <Subheading>Antes de decidir o modelo, o notebook primeiro conferiu o arquivo e suas dimensões.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 430, width: 520, minHeight: 204, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: c.surface, padding: '28px 34px' }}>
      <div style={{ color: c.accent, fontFamily: mono, fontSize: 20, letterSpacing: '0.16em' }}>ARQUIVO</div>
      <div style={{ marginTop: 24, color: 'var(--osd-text)', fontFamily: mono, fontSize: 32 }}>Ecommerce Customers</div>
      <div style={{ marginTop: 16, color: c.muted, fontSize: 24 }}>CSV sem extensão · carregado com pandas</div>
      <div style={{ marginTop: 20, color: c.dim, fontFamily: mono, fontSize: 19 }}>../data/Ecommerce Customers</div>
    </div>
    <div style={{ position: 'absolute', left: 850, top: 402, display: 'flex', alignItems: 'flex-start', gap: 94 }}>
      <div>
        <div style={{ color: c.accent, fontFamily: display, fontSize: 154, lineHeight: 0.88, letterSpacing: '-0.09em' }}>500</div>
        <div style={{ marginTop: 22, color: c.muted, fontFamily: mono, fontSize: 23, letterSpacing: '0.12em' }}>REGISTROS</div>
      </div>
      <div style={{ width: 1, height: 192, background: c.line }} />
      <div>
        <div style={{ color: 'var(--osd-text)', fontFamily: display, fontSize: 154, lineHeight: 0.88, letterSpacing: '-0.09em' }}>8</div>
        <div style={{ marginTop: 22, color: c.muted, fontFamily: mono, fontSize: 23, letterSpacing: '0.12em' }}>COLUNAS</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 748, color: c.dim, fontFamily: mono, fontSize: 20, letterSpacing: '0.1em' }}>FONTE · KAGGLE / ECOMMERCE CUSTOMER DEVICE USAGE</div>
  </Frame>
);

// ── SLIDE 04 — Structure ──────────────────────────────────────────────────
const S04Structure: Page = () => (
  <Frame stage="structure">
    <div style={{ position: 'absolute', left: 152, top: 116 }}>
      <Eyebrow>03 · ESTRUTURA</Eyebrow>
      <Heading>Nem toda coluna é uma feature.</Heading>
      <Subheading maxWidth={1240}>A inspeção separou campos numéricos de campos textuais. A seleção preserva apenas sinais com papel preditivo justificável neste experimento.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 442, width: 370, minHeight: 280, boxSizing: 'border-box', border: `1px solid ${c.line}`, background: c.surface, padding: '24px 28px' }}>
      <div style={{ color: c.muted, fontFamily: mono, fontSize: 19, letterSpacing: '0.12em' }}>3 · CATEGÓRICAS / TEXTUAIS</div>
      <div style={{ marginTop: 18 }}>
        <FieldLine color={c.soft}>Email</FieldLine>
        <FieldLine color={c.soft}>Address</FieldLine>
        <FieldLine color={c.soft}>Avatar</FieldLine>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 730, top: 500, width: 420, height: 168, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: `${c.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div style={{ color: c.accent, fontFamily: mono, fontSize: 20, letterSpacing: '0.16em' }}>REGISTRO</div>
      <div style={{ marginTop: 14, color: 'var(--osd-text)', fontFamily: display, fontSize: 42, fontWeight: 800 }}>CLIENTE</div>
      <div style={{ marginTop: 8, color: c.muted, fontFamily: mono, fontSize: 18 }}>uma linha · um conjunto de sinais</div>
    </div>
    <div style={{ position: 'absolute', left: 1195, top: 388, width: 540, minHeight: 382, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: c.surface, padding: '24px 28px' }}>
      <div style={{ color: c.accent, fontFamily: mono, fontSize: 19, letterSpacing: '0.12em' }}>5 · NUMÉRICAS</div>
      <div style={{ marginTop: 14 }}>
        <FieldLine>Avg. Session Length</FieldLine>
        <FieldLine>Time on App</FieldLine>
        <FieldLine>Time on Website</FieldLine>
        <FieldLine>Length of Membership</FieldLine>
        <FieldLine>Yearly Amount Spent</FieldLine>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 546, top: 582, width: 184, height: 1, background: c.line }} />
    <div style={{ position: 'absolute', left: 1150, top: 582, width: 45, height: 1, background: c.accent }} />
    <div style={{ position: 'absolute', left: 176, top: 794, color: c.accent, fontFamily: mono, fontSize: 19, letterSpacing: '0.08em' }}>4 FEATURES · 1 TARGET · 3 EXCLUSÕES · SEM ENCODING</div>
    <div style={{ position: 'absolute', left: 176, top: 834, color: c.muted, fontFamily: mono, fontSize: 18, letterSpacing: '0.08em' }}>0 VALORES AUSENTES · 0 LINHAS COMPLETAMENTE DUPLICADAS · NENHUM REGISTRO REMOVIDO</div>
  </Frame>
);

// ── SLIDE 05 — Target ─────────────────────────────────────────────────────
const S07Target: Page = () => (
  <Frame stage="target">
    <div style={{ position: 'absolute', left: 152, top: 120 }}>
      <Eyebrow>04 · PREPARAÇÃO</Eyebrow>
      <Heading>Features entram. Um target sai.</Heading>
      <Subheading maxWidth={1320}>A pergunta agora é explícita: usar sinais de uso e relacionamento para estimar um valor contínuo.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 400, display: 'flex', alignItems: 'center', gap: 34 }}>
      <div style={{ width: 570, height: 286, boxSizing: 'border-box', border: `1px solid ${c.line}`, background: c.surface, padding: '22px 28px' }}>
        <div style={{ color: c.soft, fontFamily: mono, fontSize: 20, letterSpacing: '0.14em' }}>FEATURES (X) · 4 SINAIS</div>
        <div style={{ marginTop: 16 }}>
          <FieldLine>Avg. Session Length</FieldLine>
          <FieldLine>Time on App</FieldLine>
          <FieldLine>Time on Website</FieldLine>
          <FieldLine>Length of Membership</FieldLine>
        </div>
      </div>
      <div style={{ width: 150, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Connector width={92} />
        <span style={{ color: c.accent, fontFamily: display, fontSize: 46, lineHeight: 1 }}>→</span>
      </div>
      <div style={{ width: 500, height: 220, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: `${c.accent}12`, padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ color: c.accent, fontFamily: mono, fontSize: 20, letterSpacing: '0.14em' }}>VARIÁVEL-ALVO (y)</div>
        <div style={{ marginTop: 18, color: 'var(--osd-text)', fontFamily: display, fontSize: 32, fontWeight: 800 }}>Yearly Amount Spent</div>
        <div style={{ marginTop: 12, color: c.muted, fontSize: 22 }}>variável dependente · valor contínuo</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 764, color: c.accent, fontFamily: mono, fontSize: 22, letterSpacing: '0.1em' }}>PROBLEMA DE REGRESSÃO · VALOR ANUAL A ESTIMAR</div>
  </Frame>
);

// ── SLIDE 06 — Split ──────────────────────────────────────────────────────
const S08Split: Page = () => (
  <Frame stage="split">
    <div style={{ position: 'absolute', left: 152, top: 120 }}>
      <Eyebrow>05 · DIVISÃO DOS DADOS</Eyebrow>
      <Heading>Uma divisão. Comparação justa.</Heading>
      <Subheading maxWidth={1320}>Os 500 registros passam por uma única separação reproduzível antes de treinar e comparar os modelos.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 416, display: 'flex', alignItems: 'center', gap: 44 }}>
      <div style={{ width: 350, height: 154, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: `${c.accent}12`, padding: '24px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ color: c.accent, fontFamily: mono, fontSize: 20, letterSpacing: '0.14em' }}>DATASET</div>
        <div style={{ marginTop: 12, color: 'var(--osd-text)', fontFamily: display, fontSize: 58, lineHeight: 0.95, letterSpacing: '-0.05em' }}>500</div>
        <div style={{ marginTop: 8, color: c.muted, fontFamily: mono, fontSize: 18, letterSpacing: '0.1em' }}>REGISTROS</div>
      </div>
      <div style={{ position: 'relative', width: 92, height: 250 }}>
        <div style={{ position: 'absolute', left: 18, top: 124, width: 1, height: 2, background: c.line }} />
        <div style={{ position: 'absolute', left: 18, top: 62, width: 1, height: 126, background: c.line }} />
        <div style={{ position: 'absolute', left: 18, top: 62, width: 74, height: 1, background: c.accent }} />
        <div style={{ position: 'absolute', left: 18, top: 187, width: 74, height: 1, background: c.soft }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ width: 660, height: 104, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: c.surface, padding: '18px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: c.accent, fontFamily: mono, fontSize: 20, letterSpacing: '0.14em' }}>80% · TREINO</div>
            <div style={{ marginTop: 8, color: 'var(--osd-text)', fontSize: 26 }}>aprende padrões</div>
          </div>
          <div style={{ color: c.accent, fontFamily: display, fontSize: 54, fontWeight: 800 }}>400</div>
        </div>
        <div style={{ width: 660, height: 104, boxSizing: 'border-box', border: `1px solid ${c.soft}`, background: c.surface, padding: '18px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ color: c.soft, fontFamily: mono, fontSize: 20, letterSpacing: '0.14em' }}>20% · TESTE</div>
            <div style={{ marginTop: 8, color: 'var(--osd-text)', fontSize: 26 }}>avalia generalização</div>
          </div>
          <div style={{ color: c.soft, fontFamily: display, fontSize: 54, fontWeight: 800 }}>100</div>
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 770, display: 'flex', alignItems: 'center', gap: 26, color: c.muted, fontFamily: mono, fontSize: 21, letterSpacing: '0.08em' }}>
      <span style={{ color: c.accent }}>random_state = 42</span>
      <span style={{ width: 1, height: 22, background: c.line }} />
      <span>mesmos registros para Linear · Forest · SVR</span>
    </div>
  </Frame>
);

// ── SLIDE 07 — Scaling ────────────────────────────────────────────────────
const S09Scaling: Page = () => (
  <Frame stage="scaling">
    <div style={{ position: 'absolute', left: 152, top: 120 }}>
      <Eyebrow>06 · ESCALA E VAZAMENTO</Eyebrow>
      <Heading>A escala pertence ao treino.</Heading>
      <Subheading maxWidth={1320}>O StandardScaler aprende parâmetros em X_train e apenas transforma X_test.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 390, width: 1568 }}>
      <div style={{ display: 'flex', alignItems: 'center', height: 120 }}>
        <div style={{ width: 112, color: c.accent, fontFamily: mono, fontSize: 20, letterSpacing: '0.14em' }}>TREINO</div>
        <div style={{ width: 286, height: 82, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: c.surface, padding: '18px 22px' }}>
          <div style={{ color: c.accent, fontFamily: mono, fontSize: 19 }}>X_train</div>
          <div style={{ marginTop: 8, color: c.muted, fontSize: 21 }}>parâmetros aprendidos</div>
        </div>
        <div style={{ width: 330, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
          <Connector width={75} />
          <span style={{ color: c.accent, fontFamily: mono, fontSize: 18 }}>fit_transform()</span>
        </div>
        <div style={{ width: 330, height: 82, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: `${c.accent}12`, padding: '18px 22px' }}>
          <div style={{ color: c.accent, fontFamily: mono, fontSize: 19 }}>X_train_scaled</div>
          <div style={{ marginTop: 8, color: c.muted, fontSize: 21 }}>média ≈ 0 · desvio ≈ 1</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', height: 120 }}>
        <div style={{ width: 112, color: c.soft, fontFamily: mono, fontSize: 20, letterSpacing: '0.14em' }}>TESTE</div>
        <div style={{ width: 286, height: 82, boxSizing: 'border-box', border: `1px solid ${c.soft}`, background: c.surface, padding: '18px 22px' }}>
          <div style={{ color: c.soft, fontFamily: mono, fontSize: 19 }}>X_test</div>
          <div style={{ marginTop: 8, color: c.muted, fontSize: 21 }}>nenhum ajuste novo</div>
        </div>
        <div style={{ width: 330, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
          <Connector width={75} color={c.soft} />
          <span style={{ color: c.soft, fontFamily: mono, fontSize: 18 }}>transform()</span>
        </div>
        <div style={{ width: 330, height: 82, boxSizing: 'border-box', border: `1px solid ${c.soft}`, background: c.surface, padding: '18px 22px' }}>
          <div style={{ color: c.soft, fontFamily: mono, fontSize: 19 }}>X_test_scaled</div>
          <div style={{ marginTop: 8, color: c.muted, fontSize: 21 }}>mesma escala do treino</div>
        </div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 704, display: 'flex', alignItems: 'stretch', gap: 70 }}>
      <div style={{ width: 410, borderTop: `1px solid ${c.accent}`, paddingTop: 18 }}>
        <div style={{ color: c.accent, fontFamily: mono, fontSize: 21, letterSpacing: '0.12em' }}>SVR</div>
        <div style={{ marginTop: 10, color: c.muted, fontSize: 24 }}>sensível à escala</div>
      </div>
      <div style={{ width: 410, borderTop: `1px solid ${c.line}`, paddingTop: 18 }}>
        <div style={{ color: c.soft, fontFamily: mono, fontSize: 21, letterSpacing: '0.12em' }}>RANDOM FOREST</div>
        <div style={{ marginTop: 10, color: c.muted, fontSize: 24 }}>geralmente dispensa</div>
      </div>
      <div style={{ width: 410, borderTop: `1px solid ${c.line}`, paddingTop: 18 }}>
        <div style={{ color: 'var(--osd-text)', fontFamily: mono, fontSize: 21, letterSpacing: '0.12em' }}>LINEAR</div>
        <div style={{ marginTop: 10, color: c.muted, fontSize: 24 }}>capacidade equivalente</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 808, color: c.accent, fontFamily: mono, fontSize: 21, letterSpacing: '0.09em' }}>SEM FIT NO TESTE · SEM VAZAMENTO DE DADOS</div>
  </Frame>
);

// ── SLIDE 08 — Target distribution ────────────────────────────────────────
const S10TargetDistribution: Page = () => (
  <Frame stage="eda-target">
    <div style={{ position: 'absolute', left: 152, top: 88 }}>
      <Eyebrow>07 · EDA · TARGET</Eyebrow>
    </div>
    <div style={{ position: 'absolute', right: 152, top: 90, color: c.muted, fontFamily: mono, fontSize: 17, letterSpacing: '0.1em' }}>FIGURA ORIGINAL DO NOTEBOOK · TREINO</div>
    <img src={targetDistributionImage} alt="Histograma de Yearly Amount Spent no conjunto de treinamento" style={{ position: 'absolute', left: 176, top: 160, width: 1568, height: 650, objectFit: 'contain' }} />
  </Frame>
);

// ── SLIDE 09 — Feature distributions ──────────────────────────────────────
const S11FeatureDistributions: Page = () => (
  <Frame stage="eda-features">
    <div style={{ position: 'absolute', left: 152, top: 88 }}>
      <Eyebrow>08 · EDA · FEATURES</Eyebrow>
    </div>
    <div style={{ position: 'absolute', right: 152, top: 90, color: c.muted, fontFamily: mono, fontSize: 17, letterSpacing: '0.1em' }}>FIGURA ORIGINAL DO NOTEBOOK · ESCALAS INDEPENDENTES</div>
    <img src={featureDistributionsImage} alt="Histogramas das quatro features selecionadas no treinamento" style={{ position: 'absolute', left: 176, top: 160, width: 1568, height: 650, objectFit: 'contain' }} />
  </Frame>
);

// ── SLIDE 10 — Correlations and multicollinearity ─────────────────────────
const S13CorrelationHeatmap: Page = () => (
  <Frame stage="eda-heatmap">
    <div style={{ position: 'absolute', left: 152, top: 88 }}>
      <Eyebrow>09 · EDA · CORRELAÇÕES</Eyebrow>
    </div>
    <div style={{ position: 'absolute', right: 152, top: 90, color: c.muted, fontFamily: mono, fontSize: 17, letterSpacing: '0.1em' }}>FIGURA ORIGINAL DO NOTEBOOK · PEARSON</div>
    <img src={correlationHeatmapImage} alt="Heatmap de correlação das features e do target no treinamento" style={{ position: 'absolute', left: 176, top: 170, width: 1000, height: 600, objectFit: 'contain' }} />
    <div style={{ position: 'absolute', left: 1240, top: 190, width: 470 }}>
      <div style={{ color: c.accent, fontFamily: mono, fontSize: 19, letterSpacing: '0.1em' }}>COM O TARGET</div>
      <div style={{ marginTop: 14 }}>
        <FieldLine>Membership <span style={{ marginLeft: 'auto', color: c.accent }}>0,818</span></FieldLine>
        <FieldLine>Time on App <span style={{ marginLeft: 'auto', color: c.soft }}>0,509</span></FieldLine>
        <FieldLine>Avg. Session <span style={{ marginLeft: 'auto', color: c.soft }}>0,324</span></FieldLine>
        <FieldLine>Time on Website <span style={{ marginLeft: 'auto', color: c.muted }}>0,010</span></FieldLine>
      </div>
      <div style={{ marginTop: 42, color: c.attention, fontFamily: mono, fontSize: 18, letterSpacing: '0.1em' }}>ENTRE AS FEATURES</div>
      <div style={{ marginTop: 12, color: 'var(--osd-text)', fontFamily: display, fontSize: 46, fontWeight: 800 }}>|r| máx. 0,079</div>
      <div style={{ marginTop: 12, color: c.muted, fontSize: 22, lineHeight: 1.4 }}>VIF entre 1,002 e 1,010. Não há evidência relevante de multicolinearidade nesta amostra.</div>
      <div style={{ marginTop: 24, color: c.soft, fontFamily: mono, fontSize: 17, letterSpacing: '0.07em' }}>ASSOCIAÇÃO LINEAR NÃO É CAUSALIDADE</div>
    </div>
  </Frame>
);

// ── SLIDE 11 — Outliers ───────────────────────────────────────────────────
const S14Outliers: Page = () => (
  <Frame stage="eda-outliers">
    <div style={{ position: 'absolute', left: 152, top: 88 }}>
      <Eyebrow>10 · EDA · OUTLIERS</Eyebrow>
    </div>
    <div style={{ position: 'absolute', right: 152, top: 90, color: c.muted, fontFamily: mono, fontSize: 17, letterSpacing: '0.1em' }}>FIGURA ORIGINAL DO NOTEBOOK · IQR · TREINO</div>
    <img src={outlierBoxplotsImage} alt="Boxplots das quatro features e do target no treinamento; candidatos pela regra de 1,5 × IQR, 18 linhas únicas candidatas e 0 REMOVIDAS" style={{ position: 'absolute', left: 176, top: 160, width: 1568, height: 650, objectFit: 'contain' }} />
  </Frame>
);

// ── SLIDE 12 — Models ────────────────────────────────────────────────────
const S16Models: Page = () => (
  <Frame stage="models">
    <div style={{ position: 'absolute', left: 152, top: 112 }}>
      <Eyebrow>11 · MODELAGEM</Eyebrow>
      <Heading>Cinco réguas para a mesma previsão.</Heading>
      <Subheading maxWidth={1320}>Os modelos recebem os mesmos dados de treino. O baseline mostra o patamar mínimo que uma previsão útil precisa superar.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 395, display: 'flex', gap: 24 }}>
      <div style={{ width: 286, minHeight: 260, boxSizing: 'border-box', border: `1px solid ${c.dim}`, background: c.surface, padding: '24px 26px' }}>
        <div style={{ color: c.dim, fontFamily: mono, fontSize: 18, letterSpacing: '0.12em' }}>BASELINE</div>
        <div style={{ marginTop: 18, color: 'var(--osd-text)', fontFamily: display, fontSize: 31, fontWeight: 800 }}>Dummy</div>
        <div style={{ marginTop: 14, color: c.muted, fontSize: 21, lineHeight: 1.35 }}>prevê a média do treino</div>
      </div>
      <div style={{ width: 286, minHeight: 260, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: `${c.accent}12`, padding: '24px 26px' }}>
        <div style={{ color: c.accent, fontFamily: mono, fontSize: 18, letterSpacing: '0.12em' }}>REFERÊNCIA</div>
        <div style={{ marginTop: 18, color: 'var(--osd-text)', fontFamily: display, fontSize: 31, fontWeight: 800 }}>RLM</div>
        <div style={{ marginTop: 14, color: c.muted, fontSize: 21, lineHeight: 1.35 }}>LinearRegression<br />+ StandardScaler</div>
      </div>
      <div style={{ width: 286, minHeight: 260, boxSizing: 'border-box', border: `1px solid ${c.soft}`, background: c.surface, padding: '24px 26px' }}>
        <div style={{ color: c.soft, fontFamily: mono, fontSize: 18, letterSpacing: '0.12em' }}>ENSEMBLE</div>
        <div style={{ marginTop: 18, color: 'var(--osd-text)', fontFamily: display, fontSize: 31, fontWeight: 800 }}>Forest</div>
        <div style={{ marginTop: 14, color: c.muted, fontSize: 21, lineHeight: 1.35 }}>100 árvores<br />random_state = 42</div>
      </div>
      <div style={{ width: 286, minHeight: 260, boxSizing: 'border-box', border: `1px solid ${c.attention}`, background: c.surface, padding: '24px 26px' }}>
        <div style={{ color: c.attention, fontFamily: mono, fontSize: 18, letterSpacing: '0.12em' }}>MARGEM</div>
        <div style={{ marginTop: 18, color: 'var(--osd-text)', fontFamily: display, fontSize: 31, fontWeight: 800 }}>SVR Linear</div>
        <div style={{ marginTop: 14, color: c.muted, fontSize: 21, lineHeight: 1.35 }}>StandardScaler<br />+ kernel linear</div>
      </div>
      <div style={{ width: 286, minHeight: 260, boxSizing: 'border-box', border: `1px solid ${c.attention}`, background: c.surface, padding: '24px 26px' }}>
        <div style={{ color: c.attention, fontFamily: mono, fontSize: 18, letterSpacing: '0.12em' }}>NÃO LINEAR</div>
        <div style={{ marginTop: 18, color: 'var(--osd-text)', fontFamily: display, fontSize: 31, fontWeight: 800 }}>SVR RBF</div>
        <div style={{ marginTop: 14, color: c.muted, fontSize: 21, lineHeight: 1.35 }}>StandardScaler<br />+ kernel RBF</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 758, color: c.accent, fontFamily: mono, fontSize: 21, letterSpacing: '0.08em' }}>PIPELINES PROTEGEM A ESCALA DENTRO DE CADA TREINO</div>
  </Frame>
);

// ── SLIDE 17 — Cross-validation ──────────────────────────────────────────
const S17CrossValidation: Page = () => (
  <Frame stage="cv">
    <div style={{ position: 'absolute', left: 152, top: 112 }}>
      <Eyebrow>12 · VALIDAÇÃO CRUZADA</Eyebrow>
      <Heading>A comparação acontece dentro do treino.</Heading>
      <Subheading maxWidth={1320}>K-Fold com 5 dobras no treino. Cada dobra valida 80 registros.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 400, width: 1180 }}>
      <div style={{ display: 'flex', minHeight: 56, alignItems: 'center', borderBottom: `1px solid ${c.accent}`, color: c.accent, fontFamily: mono, fontSize: 18, letterSpacing: '0.1em' }}><div style={{ width: 390 }}>MODELO</div><div style={{ width: 240 }}>R² VAL.</div><div style={{ width: 260 }}>RMSE VAL.</div><div>GAP TREINO − VAL.</div></div>
      <div style={{ display: 'flex', minHeight: 66, alignItems: 'center', borderBottom: `1px solid ${c.line}`, color: c.muted, fontSize: 24 }}><div style={{ width: 390 }}>Dummy</div><div style={{ width: 240 }}>−0,0166</div><div style={{ width: 260 }}>81,04</div><div>0,0166</div></div>
      <div style={{ display: 'flex', minHeight: 66, alignItems: 'center', borderBottom: `1px solid ${c.accent}`, color: 'var(--osd-text)', fontSize: 24 }}><div style={{ width: 390 }}>Regressão Linear Múltipla</div><div style={{ width: 240, color: c.accent }}>0,9848</div><div style={{ width: 260, color: c.accent }}>9,88</div><div>0,0007</div></div>
      <div style={{ display: 'flex', minHeight: 66, alignItems: 'center', borderBottom: `1px solid ${c.line}`, color: c.muted, fontSize: 24 }}><div style={{ width: 390 }}>Random Forest</div><div style={{ width: 240 }}>0,9381</div><div style={{ width: 260 }}>19,92</div><div>0,0527</div></div>
      <div style={{ display: 'flex', minHeight: 66, alignItems: 'center', borderBottom: `1px solid ${c.accent}`, color: 'var(--osd-text)', fontSize: 24 }}><div style={{ width: 390 }}>SVR Linear</div><div style={{ width: 240, color: c.accent }}>0,9848</div><div style={{ width: 260, color: c.accent }}>9,86</div><div>0,0006</div></div>
      <div style={{ display: 'flex', minHeight: 66, alignItems: 'center', borderBottom: `1px solid ${c.line}`, color: c.muted, fontSize: 24 }}><div style={{ width: 390 }}>SVR RBF</div><div style={{ width: 240 }}>0,9212</div><div style={{ width: 260 }}>22,02</div><div>0,0574</div></div>
    </div>
    <div style={{ position: 'absolute', left: 1450, top: 416, width: 280, borderTop: `1px solid ${c.attention}`, paddingTop: 20 }}>
      <div style={{ color: c.attention, fontFamily: mono, fontSize: 18, letterSpacing: '0.1em' }}>LEITURA</div>
      <div style={{ marginTop: 14, color: c.muted, fontSize: 23, lineHeight: 1.42 }}>RLM e SVR Linear tiveram desempenho e estabilidade muito próximos.</div>
      <div style={{ marginTop: 28, color: c.attention, fontFamily: mono, fontSize: 18, letterSpacing: '0.08em' }}>NÃO É ESTIMATIVA EXTERNA</div>
      <div style={{ marginTop: 10, color: c.muted, fontSize: 21, lineHeight: 1.38 }}>A mesma CV ajudou a selecionar configurações.</div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 810, color: c.soft, fontFamily: mono, fontSize: 20, letterSpacing: '0.08em' }}>N = 400 · 5 FOLDS · RMSE EM UNIDADES MONETÁRIAS DO DATASET</div>
  </Frame>
);

// ── SLIDE 13 — Hyperparameters ───────────────────────────────────────────
const S17Hyperparameters: Page = () => (
  <Frame stage="cv">
    <div style={{ position: 'absolute', left: 152, top: 112 }}>
      <Eyebrow>13 · AJUSTE DE HIPERPARÂMETROS</Eyebrow>
      <Heading>A busca confirmou a configuração inicial.</Heading>
      <Subheading maxWidth={1320}>GridSearchCV usou somente o conjunto de treino.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 430, display: 'flex', gap: 36 }}>
      <div style={{ width: 470, minHeight: 278, boxSizing: 'border-box', border: `1px solid ${c.soft}`, background: c.surface, padding: '24px 28px' }}>
        <div style={{ color: c.soft, fontFamily: mono, fontSize: 19, letterSpacing: '0.1em' }}>RANDOM FOREST · 4 CONFIGURAÇÕES</div>
        <div style={{ marginTop: 24, color: 'var(--osd-text)', fontFamily: mono, fontSize: 22, lineHeight: 1.65 }}>n_estimators = 100<br />max_depth = None<br />min_samples_leaf = 1</div>
        <div style={{ marginTop: 22, color: c.muted, fontSize: 21 }}>RMSE médio CV: 19,9157</div>
      </div>
      <div style={{ width: 410, minHeight: 278, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: `${c.accent}12`, padding: '24px 28px' }}>
        <div style={{ color: c.accent, fontFamily: mono, fontSize: 19, letterSpacing: '0.1em' }}>SVR LINEAR · 2 CONFIGURAÇÕES</div>
        <div style={{ marginTop: 24, color: 'var(--osd-text)', fontFamily: mono, fontSize: 22, lineHeight: 1.65 }}>kernel = linear<br />C = 10<br />epsilon = 0,1</div>
        <div style={{ marginTop: 22, color: c.muted, fontSize: 21 }}>RMSE médio CV: 9,8626</div>
      </div>
      <div style={{ width: 410, minHeight: 278, boxSizing: 'border-box', border: `1px solid ${c.attention}`, background: c.surface, padding: '24px 28px' }}>
        <div style={{ color: c.attention, fontFamily: mono, fontSize: 19, letterSpacing: '0.1em' }}>SVR RBF · 4 CONFIGURAÇÕES</div>
        <div style={{ marginTop: 24, color: 'var(--osd-text)', fontFamily: mono, fontSize: 22, lineHeight: 1.65 }}>kernel = rbf<br />C = 100<br />epsilon = 0,1 · gamma = scale</div>
        <div style={{ marginTop: 22, color: c.muted, fontSize: 21 }}>RMSE médio CV: 22,0225</div>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 780, color: c.accent, fontFamily: mono, fontSize: 20, letterSpacing: '0.08em' }}>GRADE PEQUENA · COMPARAÇÃO INTERNA · SEM USO DO CONJUNTO DE TESTE</div>
  </Frame>
);

// ── SLIDE 14 — Test comparison ───────────────────────────────────────────
const S18TestComparison: Page = () => (
  <Frame stage="test">
    <div style={{ position: 'absolute', left: 152, top: 112 }}>
      <Eyebrow>14 · TESTE RESERVADO</Eyebrow>
      <Heading>No teste, a vantagem é de centésimos.</Heading>
      <Subheading maxWidth={1300}>As métricas abaixo usam as 100 observações separadas antes da modelagem. O teste não entrou na busca desta rodada.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 400, width: 1510 }}>
      <div style={{ display: 'flex', minHeight: 54, alignItems: 'center', borderBottom: `1px solid ${c.accent}`, color: c.accent, fontFamily: mono, fontSize: 18, letterSpacing: '0.08em' }}><div style={{ width: 410 }}>MODELO</div><div style={{ width: 180 }}>R²</div><div style={{ width: 210 }}>MAE</div><div style={{ width: 190 }}>MAPE</div><div>RMSE</div></div>
      <div style={{ display: 'flex', minHeight: 66, alignItems: 'center', borderBottom: `1px solid ${c.line}`, color: c.muted, fontSize: 24 }}><div style={{ width: 410 }}>Dummy</div><div style={{ width: 180 }}>−0,0362</div><div style={{ width: 210 }}>54,91</div><div style={{ width: 190 }}>12,35%</div><div>71,63</div></div>
      <div style={{ display: 'flex', minHeight: 66, alignItems: 'center', borderBottom: `1px solid ${c.accent}`, color: 'var(--osd-text)', fontSize: 24 }}><div style={{ width: 410 }}>Regressão Linear Múltipla</div><div style={{ width: 180, color: c.accent }}>0,9778</div><div style={{ width: 210, color: c.accent }}>8,56</div><div style={{ width: 190, color: c.accent }}>1,79%</div><div style={{ color: c.accent }}>10,48</div></div>
      <div style={{ display: 'flex', minHeight: 66, alignItems: 'center', borderBottom: `1px solid ${c.line}`, color: c.muted, fontSize: 24 }}><div style={{ width: 410 }}>Random Forest</div><div style={{ width: 180 }}>0,9336</div><div style={{ width: 210 }}>13,65</div><div style={{ width: 190 }}>2,99%</div><div>18,13</div></div>
      <div style={{ display: 'flex', minHeight: 66, alignItems: 'center', borderBottom: `1px solid ${c.accent}`, color: 'var(--osd-text)', fontSize: 24 }}><div style={{ width: 410 }}>SVR Linear</div><div style={{ width: 180, color: c.attention }}>0,9780</div><div style={{ width: 210, color: c.attention }}>8,53</div><div style={{ width: 190, color: c.attention }}>1,79%</div><div style={{ color: c.attention }}>10,43</div></div>
      <div style={{ display: 'flex', minHeight: 66, alignItems: 'center', borderBottom: `1px solid ${c.line}`, color: c.muted, fontSize: 24 }}><div style={{ width: 410 }}>SVR RBF</div><div style={{ width: 180 }}>0,9613</div><div style={{ width: 210 }}>10,19</div><div style={{ width: 190 }}>2,22%</div><div>13,85</div></div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 812, color: c.attention, fontFamily: mono, fontSize: 20, letterSpacing: '0.08em' }}>SVR LINEAR É MARGINALMENTE MELHOR · A DIFERENÇA PRÁTICA É PEQUENA</div>
  </Frame>
);

// ── SLIDE 15 — Predictions ───────────────────────────────────────────────
const S19Predictions: Page = () => (
  <Frame stage="prediction">
    <div style={{ position: 'absolute', left: 152, top: 112 }}>
      <Eyebrow>15 · PREVISÕES</Eyebrow>
      <Heading>Os dois modelos lineares acompanham a diagonal.</Heading>
      <Subheading maxWidth={1260}>Valores reais versus preditos nas 100 observações de teste; a linha tracejada representa a previsão perfeita.</Subheading>
    </div>
    <img src={realVsPredImage} alt="Valores reais versus preditos para os quatro modelos no conjunto de teste" style={{ position: 'absolute', left: 176, top: 445, width: 1510, height: 360, objectFit: 'contain' }} />
    <div style={{ position: 'absolute', left: 176, top: 830, color: c.muted, fontFamily: mono, fontSize: 20, letterSpacing: '0.08em' }}>LEITURA VISUAL COERENTE COM AS MÉTRICAS · NÃO SUBSTITUI VALIDAÇÃO EXTERNA</div>
  </Frame>
);

// ── SLIDE 16 — Residual diagnostics ──────────────────────────────────────
const S20Diagnostics: Page = () => (
  <Frame stage="diagnostics">
    <div style={{ position: 'absolute', left: 152, top: 112 }}>
      <Eyebrow>16 · DIAGNÓSTICO</Eyebrow>
      <Heading>Resíduos ajudam a procurar, não a provar.</Heading>
      <Subheading maxWidth={1260}>Na RLM, os resíduos ficam dos dois lados de zero, sem funil evidente.</Subheading>
    </div>
    <img src={residualsImage} alt="Resíduos versus predições dos modelos no teste" style={{ position: 'absolute', left: 176, top: 430, width: 1040, height: 300, objectFit: 'contain' }} />
    <img src={residualDistributionImage} alt="Distribuição dos resíduos da regressão linear múltipla" style={{ position: 'absolute', left: 1260, top: 445, width: 450, height: 240, objectFit: 'contain' }} />
    <div style={{ position: 'absolute', left: 176, top: 770, color: c.attention, fontFamily: mono, fontSize: 20, letterSpacing: '0.08em' }}>SEM FUNIL EVIDENTE · SEM PROVA DE NORMALIDADE OU HOMOCEDASTICIDADE</div>
  </Frame>
);

// ── SLIDE 17 — Feature importance ────────────────────────────────────────
const S21Importance: Page = () => (
  <Frame stage="importance">
    <div style={{ position: 'absolute', left: 152, top: 112 }}>
      <Eyebrow>17 · INTERPRETAÇÃO</Eyebrow>
      <Heading>Membership e App carregam o maior sinal.</Heading>
      <Subheading maxWidth={1260}>RLM e Random Forest apontam a mesma ordem geral das features.</Subheading>
    </div>
    <img src={featureImportancesImage} alt="Impacto relativo das features na RLM e importância MDI no Random Forest" style={{ position: 'absolute', left: 176, top: 430, width: 1120, height: 320, objectFit: 'contain' }} />
    <div style={{ position: 'absolute', left: 1390, top: 440, width: 320, borderTop: `1px solid ${c.accent}`, paddingTop: 20 }}>
      <div style={{ color: c.accent, fontFamily: mono, fontSize: 18, letterSpacing: '0.1em' }}>ASSOCIAÇÃO, NÃO CAUSA</div>
      <div style={{ marginTop: 16, color: c.muted, fontSize: 23, lineHeight: 1.42 }}>Na RLM, uma unidade adicional de Membership se associa a +61,90 unidades no target, condicionada às demais features.</div>
      <div style={{ marginTop: 24, color: c.muted, fontSize: 21, lineHeight: 1.4 }}>MDI descreve redução média do erro quadrático nas árvores; não mede causalidade.</div>
    </div>
  </Frame>
);

// ── SLIDE 18 — Decision ──────────────────────────────────────────────────
const S22Decision: Page = () => (
  <Frame stage="decision">
    <div style={{ position: 'absolute', left: 152, top: 112 }}>
      <Eyebrow>18 · DECISÃO</Eyebrow>
      <Heading>A escolha favorece a simplicidade.</Heading>
      <Subheading maxWidth={1280}>O SVR Linear ganhou por uma margem numérica mínima. Para este experimento acadêmico, a RLM oferece o melhor equilíbrio entre precisão, explicação e simplicidade.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 520, width: 700, minHeight: 260, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: `${c.accent}12`, padding: '24px 32px' }}>
      <div style={{ color: c.accent, fontFamily: mono, fontSize: 20, letterSpacing: '0.13em' }}>MODELO RECOMENDADO</div>
      <div style={{ marginTop: 16, color: 'var(--osd-text)', fontFamily: display, fontSize: 46, lineHeight: 1.05, fontWeight: 900 }}>REGRESSÃO LINEAR<br />MÚLTIPLA</div>
      <div style={{ marginTop: 16, color: c.muted, fontSize: 20, lineHeight: 1.35 }}>qualidade praticamente empatada · coeficientes diretos · menor complexidade</div>
    </div>
    <div style={{ position: 'absolute', left: 1050, top: 520, width: 650 }}>
      <div style={{ color: c.attention, fontFamily: mono, fontSize: 20, letterSpacing: '0.13em' }}>O QUE A DECISÃO NÃO DIZ</div>
      <div style={{ marginTop: 18 }}>
        <StateLine color={c.soft}>não aprova uso em produção real</StateLine>
        <StateLine color={c.soft}>não prova causalidade</StateLine>
        <StateLine color={c.soft}>não elimina necessidade de validação externa</StateLine>
        <StateLine color={c.soft}>não declara vencedor universal</StateLine>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 820, color: c.muted, fontFamily: mono, fontSize: 19, letterSpacing: '0.07em' }}>LIMITAÇÕES · 500 REGISTROS · UMA DIVISÃO · CV DE 5 FOLDS · BUSCA PEQUENA · TESTE JÁ USADO EM CONTRIBUIÇÕES ANTERIORES</div>
  </Frame>
);

// ── SLIDE 19 — Close ─────────────────────────────────────────────────────
const S23Close: Page = () => (
  <Frame stage="decision">
    <div style={{ position: 'absolute', left: 152, top: 238, width: 1180 }}>
      <Eyebrow>19 · ENCERRAMENTO</Eyebrow>
      <h1 style={{ margin: '28px 0 0', fontFamily: display, fontSize: 132, lineHeight: 0.94, letterSpacing: '-0.065em', fontWeight: 900 }}>Precisão quase<br />empatada. RLM<br />recomendada.</h1>
      <p style={{ margin: '38px 0 0', maxWidth: 900, color: c.muted, fontSize: 34, lineHeight: 1.42 }}>Neste experimento, a Regressão Linear Múltipla equilibra desempenho, simplicidade e interpretação.</p>
    </div>
    <div style={{ position: 'absolute', right: 176, top: 426, width: 450, borderTop: `1px solid ${c.accent}`, paddingTop: 22 }}>
      <div style={{ color: c.accent, fontFamily: mono, fontSize: 22, letterSpacing: '0.12em' }}>PERGUNTAS</div>
      <div style={{ marginTop: 24, color: 'var(--osd-text)', fontFamily: mono, fontSize: 20, lineHeight: 1.6 }}>github.com/GabrielNito/<br />desafio-do-oraculo-preditivo</div>
    </div>
  </Frame>
);

export const notes = [
  'Abra nomeando o projeto, o dataset e o Grupo 01: Apolo Bastos, Nicolas Gabriel, Caio Simonassi, Gabriel Nito e Jônatas. Antecipe que a apresentação percorre o experimento completo, do dado à recomendação, sem tratar o modelo como pronto para produção.',
  'Yearly Amount Spent é o valor anual que queremos estimar. Como a saída é numérica e contínua, o problema é de regressão. A seguir, apresentamos quais sinais entraram no experimento.',
  'Mostre os números diretamente comprovados pelo notebook: 500 registros e 8 colunas. O arquivo foi carregado com pandas a partir de ../data/Ecommerce Customers. Esta etapa descreve dimensão, não qualidade ou desempenho.',
  'A inspeção mostra cinco colunas numéricas e três textuais. Email, Address e Avatar foram excluídas porque não têm papel preditivo justificável no experimento; por isso não houve encoding. Também foram encontrados zero valores ausentes e zero linhas completamente duplicadas. Esses resultados não eliminam a necessidade de investigar outliers.',
  'O target é a variável dependente y. As quatro features são as variáveis X ligadas a sessão, aplicativo, website e duração do relacionamento. Essa seleção produz uma pergunta de regressão clara e auditável.',
  'A divisão usa 400 registros para treino e 100 para teste, equivalentes a 80% e 20%. random_state=42 fixa o sorteio para que todos os modelos recebam as mesmas observações. O teste ficou separado da busca de hiperparâmetros desta rodada.',
  'StandardScaler aprende média e desvio apenas em X_train com fit_transform e usa esses mesmos parâmetros em X_test com transform. SVR depende mais da escala; Random Forest geralmente não precisa dela. Dentro da validação cruzada, o scaler ficou no Pipeline para impedir vazamento entre as dobras.',
  'O histograma é a figura original do notebook e usa os 400 registros de treino. A média é 501,99 e a assimetria é 0,068. Isso descreve a amostra, sem assumir uma moeda real, normalidade ou qualidade preditiva.',
  'As quatro distribuições mantêm suas escalas originais. Compare formatos dentro de cada painel, não as amplitudes entre features. A padronização já foi delimitada ao contexto dos modelos sensíveis à escala.',
  'O heatmap reúne as correlações de Pearson. Length of Membership tem a maior associação com o target, 0,818; Time on Website tem 0,010. Entre features, a maior correlação absoluta é 0,079 e o VIF varia de 1,002 a 1,010. Fale em associação, nunca em causalidade.',
  'Os boxplots usam a regra de 1,5 vezes o IQR. Há 18 linhas únicas candidatas entre 400, mas não houve evidência de erro de registro. Por isso nenhum dado foi removido. A decisão preserva o protocolo e conduz à modelagem.',
  'Apresente as cinco referências de forma funcional. Dummy prevê a média do treino. A RLM oferece coeficientes interpretáveis. Random Forest adiciona árvores com bagging, ou seja, várias árvores treinadas em amostras reamostradas e combinadas. Os SVRs comparam uma margem linear com uma fronteira RBF mais flexível.',
  'A validação cruzada ocorre apenas nas 400 observações de treino. Em cada dobra, 320 registros treinam e 80 validam. RLM e SVR Linear têm R² médio de 0,9848 e gaps muito baixos. Random Forest e SVR RBF apresentam gaps maiores nesta configuração. Como a mesma CV ajudou na seleção, ela serve à comparação interna, não substitui validação externa.',
  'GridSearchCV avaliou uma grade pequena: quatro configurações para Random Forest, duas para SVR Linear e quatro para SVR RBF. O critério foi o menor RMSE médio de validação. Em todos os casos, a busca preservou a configuração original listada no slide. A próxima comparação usa o teste reservado.',
  'Esta tabela usa as 100 observações de teste. SVR Linear tem a melhor performance numérica por margem estreita: RMSE 10,43 contra 10,48 e R² 0,9780 contra 0,9778 da RLM. MAE mede o erro absoluto médio; RMSE dá peso maior aos erros maiores; MAPE expressa o erro relativo médio em percentual.',
  'A diagonal tracejada representa previsão sem erro. RLM e SVR Linear se concentram mais perto dela; Random Forest e SVR RBF mostram maior dispersão. O gráfico ilustra a tabela, mas não substitui nova validação.',
  'Resíduos são valores reais menos previstos. Na RLM eles aparecem dos dois lados de zero, sem funil evidente nesta inspeção; o Random Forest apresenta maior dispersão. O histograma contém uma curva de referência, mas nenhuma das figuras prova normalidade ou homocedasticidade.',
  'Os dois painéis apontam Length of Membership como o sinal de maior peso, seguido por Time on App. Na RLM, o coeficiente é uma associação condicional. No Forest, MDI mede redução média do erro quadrático nas árvores. Nenhuma das duas leituras prova causalidade.',
  'Diferencie métrica e decisão. O SVR Linear venceu por centésimos, mas a RLM é recomendada porque praticamente empata em desempenho e é mais simples de interpretar, implementar e explicar. Reforce os limites: amostra pequena, uma divisão, grade pequena e ausência de validação externa. O modelo não está aprovado para produção.',
  'Agradeça e convide perguntas. Se perguntarem por que não escolher o SVR Linear, retome a diferença mínima nas métricas e o ganho de interpretabilidade da RLM. O repositório no slide permite consultar notebook, código e figuras completas.'
] satisfies (string | undefined)[];

export const meta: SlideMeta = {
  title: 'Desafio do Oráculo Preditivo — Ecommerce Customers',
  theme: 'technical-oracle',
  createdAt: '2026-10-05T01:04:16.943Z',
};

export default [S01Cover, S02Problem, S03Dataset, S04Structure, S07Target, S08Split, S09Scaling, S10TargetDistribution, S11FeatureDistributions, S13CorrelationHeatmap, S14Outliers, S16Models, S17CrossValidation, S17Hyperparameters, S18TestComparison, S19Predictions, S20Diagnostics, S21Importance, S22Decision, S23Close] satisfies Page[];
