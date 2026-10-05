import type { DesignSystem, Page } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#08090B', text: '#F1F1EE', accent: '#55B7D9' },
  fonts: {
    display: 'Arial, Helvetica, sans-serif',
    body: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  typeScale: { hero: 168, body: 36 },
  radius: 8,
};

const mono = 'SFMono-Regular, "Cascadia Code", "Roboto Mono", ui-monospace, Menlo, monospace';
const muted = '#77808C';
const surface = '#11151A';
const line = '#27313A';
const accent = '#55B7D9';
const text = '#F1F1EE';

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1 style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 168, fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.055em', margin: 0, color: text }}>{children}</h1>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div style={{ position: 'absolute', left: 128, right: 128, bottom: 42, paddingTop: 14, borderTop: `1px solid ${line}`, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 19, letterSpacing: '0.12em', textTransform: 'uppercase', color: muted }}>
      <span>TECHNICAL ORACLE · THEME DEMO</span>
      <span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  );
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div style={{ color: accent, fontFamily: mono, fontSize: 22, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{children}</div>
);

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#08090B', color: text, fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.22, pointerEvents: 'none', backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`, backgroundSize: '96px 96px', maskImage: 'radial-gradient(ellipse at center, black, transparent 78%)' }} />
    {children}
    <Footer />
  </div>
);

const Cover: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 152, top: 300 }}>
      <Eyebrow>VISUAL SYSTEM</Eyebrow>
      <div style={{ marginTop: 28 }}><Title>Dados →<br />previsão</Title></div>
      <p style={{ margin: '34px 0 0', fontSize: 36, lineHeight: 1.4, color: muted, maxWidth: 900 }}>Nós, camadas e relações explícitas para explicar um modelo técnico.</p>
    </div>
  </Frame>
);

const Flow: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 152, top: 142 }}>
      <Eyebrow>THE FLOW</Eyebrow>
      <h2 style={{ margin: '26px 0 0', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 84, lineHeight: 1, letterSpacing: '-0.045em' }}>Um sistema se explica por camadas.</h2>
    </div>
    <div style={{ position: 'absolute', left: 280, top: 500, display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: 260, height: 116, border: `1px solid ${line}`, background: surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 26 }}>DADOS</div>
      <div style={{ color: accent, fontFamily: mono, fontSize: 28 }}>→</div>
      <div style={{ width: 260, height: 116, border: `1px solid ${accent}`, background: surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 26, color: accent }}>MODELO</div>
      <div style={{ color: accent, fontFamily: mono, fontSize: 28 }}>→</div>
      <div style={{ width: 260, height: 116, border: `1px solid ${line}`, background: surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 26, color: muted }}>DECISÃO</div>
    </div>
  </Frame>
);

const Close: Page = () => (
  <Frame>
    <div style={{ position: 'absolute', left: 152, top: 330 }}>
      <Eyebrow>THE RULE</Eyebrow>
      <div style={{ marginTop: 28 }}><Title>Mostre o que<br />foi verificado.</Title></div>
      <div style={{ marginTop: 42, width: 92, height: 3, background: accent }} />
    </div>
  </Frame>
);

export default [Cover, Flow, Close] satisfies Page[];
