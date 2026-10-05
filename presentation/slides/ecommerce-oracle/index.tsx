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

type Stage = 'cover' | 'problem' | 'dataset' | 'structure' | 'quality' | 'state';
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
  const client: NodeStatus = stage === 'cover' ? 'active' : 'done';
  const data: NodeStatus = stage === 'cover' || stage === 'problem' || stage === 'dataset' || stage === 'quality' ? 'active' : 'done';
  const features: NodeStatus = stage === 'structure' ? 'active' : stage === 'problem' || stage === 'dataset' || stage === 'quality' || stage === 'state' ? 'pending' : 'future';
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
        <FlowNode label="MODELOS" status="future" />
        <RailConnector status="future" />
        <FlowNode label="PREVISÃO" status="future" />
        <RailConnector status="future" />
        <FlowNode label="DECISÃO" status="future" />
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
      <div style={{ marginTop: 34, color: c.dim, fontFamily: mono, fontSize: 21, letterSpacing: '0.08em' }}>APOLO · NICOLAS · CAIO · GABRIEL</div>
    </div>
    <div style={{ position: 'absolute', right: 218, top: 270, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <PredictionNode label="DADOS" detail="sinais observados" accent />
      <div style={{ height: 44, width: 1, background: c.accent }} />
      <PredictionNode label="MODELO" detail="a construir" />
      <div style={{ height: 44, width: 1, background: c.line }} />
      <PredictionNode label="PREVISÃO" detail="valor contínuo · ?" />
    </div>
  </Frame>
);

// ── SLIDE 02 — Problem ────────────────────────────────────────────────────
const S02Problem: Page = () => (
  <Frame stage="problem">
    <div style={{ position: 'absolute', left: 152, top: 126 }}>
      <Eyebrow>01 · O PROBLEMA</Eyebrow>
      <Heading>O que queremos prever?</Heading>
      <Subheading>O projeto é de regressão. A variável-alvo ainda não foi definida no notebook.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 224, top: 470, display: 'flex', alignItems: 'center', gap: 26 }}>
      <PredictionNode label="DADOS DO CLIENTE" detail="comportamento observado" accent />
      <Connector width={112} />
      <div style={{ width: 144, height: 144, border: `1px solid ${c.attention}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: c.attention }}>
        <span style={{ fontFamily: display, fontSize: 74, lineHeight: 0.9 }}>?</span>
        <span style={{ marginTop: 12, fontFamily: mono, fontSize: 16, letterSpacing: '0.1em' }}>TARGET</span>
      </div>
      <Connector width={112} color={c.line} />
      <PredictionNode label="VALOR CONTÍNUO" detail="a ser estimado" />
    </div>
    <div style={{ position: 'absolute', left: 250, top: 715, color: c.attention, fontFamily: mono, fontSize: 22, letterSpacing: '0.1em' }}>REGRESSÃO · PERGUNTA EM ABERTO</div>
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
      <Subheading maxWidth={1240}>A inspeção separou campos numéricos de campos textuais/categóricos. A classificação ainda é preliminar.</Subheading>
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
    <div style={{ position: 'absolute', left: 176, top: 812, color: c.attention, fontFamily: mono, fontSize: 19, letterSpacing: '0.08em' }}>CLASSIFICAÇÃO PRELIMINAR · USO NO MODELO: AINDA NÃO DECIDIDO</div>
  </Frame>
);

// ── SLIDE 05 — Initial quality ────────────────────────────────────────────
const S05Quality: Page = () => (
  <Frame stage="quality">
    <div style={{ position: 'absolute', left: 152, top: 126 }}>
      <Eyebrow>04 · QUALIDADE INICIAL</Eyebrow>
      <Heading>Sem nulos. Sem duplicatas.</Heading>
      <Subheading>É o que a inspeção inicial comprova — e só isso.</Subheading>
    </div>
    <div style={{ position: 'absolute', left: 260, top: 420, display: 'flex', alignItems: 'stretch', gap: 120 }}>
      <QualityMetric value="0" label="VALORES AUSENTES" detail="em todas as 8 colunas observadas" />
      <div style={{ width: 1, background: c.line }} />
      <QualityMetric value="0" label="LINHAS COMPLETAMENTE DUPLICADAS" detail="nenhum registro repetido na checagem" />
    </div>
    <div style={{ position: 'absolute', left: 260, top: 768, color: c.muted, fontFamily: mono, fontSize: 21, letterSpacing: '0.08em' }}>NENHUM REGISTRO FOI REMOVIDO · NENHUM TRATAMENTO FOI APLICADO</div>
  </Frame>
);

// ── SLIDE 06 — Current state ──────────────────────────────────────────────
const S06State: Page = () => (
  <Frame stage="state">
    <div style={{ position: 'absolute', left: 152, top: 112 }}>
      <Eyebrow>05 · ESTADO ATUAL</Eyebrow>
      <Heading>A inspeção terminou.<br />A modelagem ainda não começou.</Heading>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 410, width: 690, minHeight: 324, boxSizing: 'border-box', border: `1px solid ${c.accent}`, background: `${c.accent}0d`, padding: '24px 30px' }}>
      <div style={{ color: c.accent, fontFamily: mono, fontSize: 20, letterSpacing: '0.14em' }}>VERIFICADO NO NOTEBOOK</div>
      <div style={{ marginTop: 18 }}>
        <StateLine>carregamento do arquivo</StateLine>
        <StateLine>head() · shape · info()</StateLine>
        <StateLine>tipos e classificação preliminar</StateLine>
        <StateLine>valores ausentes e duplicatas</StateLine>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1000, top: 410, width: 740, minHeight: 324, boxSizing: 'border-box', border: `1px solid ${c.attention}`, background: `${c.attention}08`, padding: '24px 30px' }}>
      <div style={{ color: c.attention, fontFamily: mono, fontSize: 20, letterSpacing: '0.14em' }}>AINDA NÃO REALIZADO</div>
      <div style={{ marginTop: 18 }}>
        <StateLine color={c.attention}>variável-alvo</StateLine>
        <StateLine color={c.attention}>EDA · correlações · outliers</StateLine>
        <StateLine color={c.attention}>treino · teste · pré-processamento</StateLine>
        <StateLine color={c.attention}>Linear Múltipla · Random Forest · SVR</StateLine>
      </div>
    </div>
    <div style={{ position: 'absolute', left: 176, top: 804, color: c.attention, fontFamily: mono, fontSize: 22, letterSpacing: '0.08em' }}>PRÓXIMA DECISÃO · DEFINIR A VARIÁVEL-ALVO</div>
  </Frame>
);

export const notes = [
  'Abra nomeando o projeto e o grupo. A capa apresenta a metáfora do oráculo como um sistema técnico: sinais entram, uma estimativa poderá sair. Ainda não existe modelo executado; o ponto de interrogação é deliberado.',
  'A pergunta deste slide é a tensão central. O notebook confirma que o objetivo final é comparar regressões para prever uma variável contínua, mas também afirma que a variável-alvo ainda não foi definida. Não diga que Yearly Amount Spent já é o target.',
  'Mostre os números diretamente comprovados pelos outputs: 500 registros e 8 colunas. O arquivo foi carregado com pandas a partir de ../data/Ecommerce Customers e o README o descreve como CSV sem extensão. Este slide fala de dimensão, não de qualidade ou desempenho.',
  'A tabela vem de df.dtypes e da classificação preliminar criada no notebook: cinco colunas float64 e três colunas str. Leia os nomes reais. Não chame todas as colunas de features ainda e não escolha Yearly Amount Spent como alvo antes da próxima etapa.',
  'Os dois zeros são verificações específicas: zero valores ausentes em todas as colunas e zero linhas completamente duplicadas. Isso não prova ausência de outliers, consistência estatística ou adequação para modelagem. Nenhum tratamento foi executado nesta etapa.',
  'Feche o primeiro ato com uma fronteira clara. A inspeção inicial terminou, mas target, EDA, pré-processamento, divisão treino/teste, modelos e métricas ainda não existem no notebook. Linear, Forest e SVR aparecem apenas como escopo futuro do briefing, nunca como resultado. A próxima versão do deck só poderá avançar quando o notebook sustentar cada afirmação.',
] satisfies (string | undefined)[];

export const meta: SlideMeta = {
  title: 'Desafio do Oráculo Preditivo — Ecommerce Customers',
  theme: 'technical-oracle',
  createdAt: '2026-10-05T01:04:16.943Z',
};

export default [S01Cover, S02Problem, S03Dataset, S04Structure, S05Quality, S06State] satisfies Page[];
