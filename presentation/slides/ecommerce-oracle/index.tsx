import type { CSSProperties, ReactNode } from 'react';
import { useSlidePageNumber } from '@open-slide/core';
import type { DesignSystem, Page, SlideMeta, SlideTransition } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#FAFAF8', text: '#16242E', accent: '#185878' },
  fonts: { display: 'Arial, Helvetica, sans-serif', body: 'Arial, Helvetica, sans-serif' },
  typeScale: { hero: 118, body: 32 }, radius: 0,
};

const c = { ink: '#16242E', muted: '#64727A', accent: '#185878', soft: '#557B91', warm: '#8C6332', line: '#D5DCDD', pale: '#EDF3F5', paper: '#FAFAF8' };
const display = 'Arial, Helvetica, sans-serif';
const body = 'Arial, Helvetica, sans-serif';
const targetDistributionImage = new URL('./assets/eda-target-distribution.png', import.meta.url).href;
const featureDistributionsImage = new URL('./assets/eda-feature-distributions.png', import.meta.url).href;
const correlationHeatmapImage = new URL('./assets/eda-correlation-heatmap.png', import.meta.url).href;
const outlierBoxplotsImage = new URL('./assets/eda-outlier-boxplots.png', import.meta.url).href;
const realVsPredImage = new URL('./assets/model-real-vs-pred.png', import.meta.url).href;
const residualsImage = new URL('./assets/model-residuals.png', import.meta.url).href;
const residualDistributionImage = new URL('./assets/model-residual-distribution.png', import.meta.url).href;
const featureImportancesImage = new URL('./assets/model-feature-importances.png', import.meta.url).href;

const root: CSSProperties = { width: '100%', height: '100%', position: 'relative', boxSizing: 'border-box', background: c.paper, color: c.ink, fontFamily: body };

export const transition: SlideTransition = {
  duration: 180,
  exit: { duration: 120, keyframes: [{ opacity: 1 }, { opacity: 0 }] },
  enter: { duration: 180, keyframes: [{ opacity: 0 }, { opacity: 1 }] },
};

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return <div style={{ position: 'absolute', left: 150, right: 150, bottom: 38, borderTop: `1px solid ${c.line}`, paddingTop: 13, display: 'flex', justifyContent: 'space-between', color: c.muted, fontSize: 16, letterSpacing: '0.04em' }}><span>Desafio do Oráculo Preditivo · Ecommerce Customers</span><span>{current} / {total}</span></div>;
};
const Frame = ({ children }: { children: ReactNode }) => <section style={root}><div style={{ position: 'relative', zIndex: 1 }}>{children}</div><Footer /></section>;
const Header = ({ number, title, children, width = 1420 }: { number: string; title: ReactNode; children?: ReactNode; width?: number }) => (
  <div style={{ position: 'absolute', left: 150, top: 98, width }}>
    <div style={{ color: c.accent, fontSize: 18, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{number}</div>
    <h1 style={{ margin: '18px 0 0', fontFamily: display, fontSize: 62, lineHeight: 1.08, letterSpacing: '-0.035em', fontWeight: 700 }}>{title}</h1>
    {children && <div style={{ marginTop: 18, maxWidth: 1240, color: c.muted, fontSize: 28, lineHeight: 1.4 }}>{children}</div>}
  </div>
);
const Reading = ({ children, top = 836, width = 1540 }: { children: ReactNode; top?: number; width?: number }) => <div style={{ position: 'absolute', left: 150, top, width, color: c.ink, fontSize: 23, lineHeight: 1.36 }}><span style={{ color: c.accent, fontWeight: 700 }}>Leitura do experimento. </span>{children}</div>;
const Rule = ({ top, left = 150, width = 1540 }: { top: number; left?: number; width?: number }) => <div style={{ position: 'absolute', left, top, width, height: 1, background: c.line }} />;
const Metric = ({ value, label, detail, width = 300 }: { value: string; label: string; detail?: string; width?: number }) => <div style={{ width }}><div style={{ color: c.accent, fontSize: 74, lineHeight: 0.95, letterSpacing: '-0.06em', fontWeight: 700 }}>{value}</div><div style={{ marginTop: 12, fontSize: 20, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{label}</div>{detail && <div style={{ marginTop: 10, color: c.muted, fontSize: 22, lineHeight: 1.32 }}>{detail}</div>}</div>;
const Field = ({ label, detail }: { label: string; detail: string }) => <div style={{ padding: '17px 0', borderBottom: `1px solid ${c.line}`, display: 'flex', justifyContent: 'space-between', gap: 24, fontSize: 24 }}><span>{label}</span><span style={{ color: c.muted, textAlign: 'right' }}>{detail}</span></div>;
const TableHead = ({ children }: { children: ReactNode }) => <div style={{ color: c.accent, fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{children}</div>;

const S01Cover: Page = () => <Frame>
  <div style={{ position: 'absolute', left: 150, top: 188, width: 1120 }}>
    <div style={{ color: c.accent, fontSize: 20, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Grupo 01 · Aprendizagem de Máquina</div>
    <h1 style={{ margin: '26px 0 0', fontFamily: display, fontSize: 122, lineHeight: 0.94, letterSpacing: '-0.065em', fontWeight: 700 }}>Desafio do<br />Oráculo Preditivo</h1>
    <p style={{ margin: '34px 0 0', color: c.muted, fontSize: 36 }}>Ecommerce Customers</p>
    <p style={{ margin: '20px 0 0', maxWidth: 920, color: c.ink, fontSize: 29, lineHeight: 1.42 }}>Comparamos modelos de regressão para estimar o gasto anual de clientes a partir de sinais de uso e relacionamento.</p>
    <p style={{ margin: '54px 0 0', color: c.muted, fontSize: 18, letterSpacing: '0.04em' }}>Apolo Bastos · Nicolas Gabriel · Caio Simonassi · Gabriel Nito · Jônatas</p>
  </div>
  <div style={{ position: 'absolute', right: 168, top: 260, width: 340, color: c.muted, fontSize: 23, lineHeight: 1.5 }}><Rule top={0} left={0} width={340} /><p style={{ marginTop: 26 }}>Base de dados</p><p>Preparação</p><p>Modelos</p><p>Resultados</p><p>Recomendação</p></div>
</Frame>;

const S02Question: Page = () => <Frame>
  <Header number="01 · Pergunta do experimento" title="Estimativa do gasto anual">A variável que queremos prever é <strong>Yearly Amount Spent</strong>. Como o resultado é numérico e contínuo, tratamos o problema como regressão.</Header>
  <div style={{ position: 'absolute', left: 150, top: 410, width: 720 }}><TableHead>Entradas usadas</TableHead><div style={{ marginTop: 26 }}><Field label="Avg. Session Length" detail="duração média da sessão" /><Field label="Time on App" detail="tempo no aplicativo" /><Field label="Time on Website" detail="tempo no site" /><Field label="Length of Membership" detail="tempo de relacionamento" /></div></div>
  <div style={{ position: 'absolute', left: 1080, top: 462, width: 510 }}><TableHead>VARIÁVEL-ALVO (y)</TableHead><div style={{ marginTop: 26, fontSize: 48, lineHeight: 1.08, fontWeight: 700 }}>Yearly Amount Spent</div><p style={{ marginTop: 24, color: c.muted, fontSize: 25, lineHeight: 1.42 }}>O modelo recebe quatro medidas observadas de cada cliente e devolve um valor anual estimado.</p></div>
  <Reading>O slide define a pergunta antes de mostrar métricas: queremos saber quanto o modelo consegue aproximar o gasto anual usando apenas essas quatro variáveis.</Reading>
</Frame>;

const S03Data: Page = () => <Frame>
  <Header number="02 · Base e seleção de colunas" title="O que existe no arquivo">O arquivo Ecommerce Customers contém 500 registros e 8 colunas. A inspeção inicial separou dados úteis para previsão de identificadores textuais.</Header>
  <div style={{ position: 'absolute', left: 150, top: 405, display: 'flex', gap: 150 }}><Metric value="500" label="registros" detail="uma linha por cliente" /><Metric value="8" label="colunas" detail="5 numéricas e 3 textuais" /><Metric value="4" label="features" detail="mais 1 variável-alvo" /></div>
  <Rule top={625} />
  <div style={{ position: 'absolute', left: 150, top: 670, width: 680 }}><TableHead>Colunas que entram no modelo</TableHead><p style={{ margin: '20px 0 0', fontSize: 25, lineHeight: 1.45 }}>Avg. Session Length, Time on App, Time on Website e Length of Membership</p></div>
  <div style={{ position: 'absolute', left: 970, top: 670, width: 620 }}><TableHead>Colunas que ficam fora</TableHead><p style={{ margin: '20px 0 0', fontSize: 25, lineHeight: 1.45 }}>Email, Address e Avatar são textos sem papel preditivo justificável neste experimento.</p></div>
  <Reading top={835}>Não havia valores ausentes nem linhas completamente duplicadas. Por isso, a preparação não precisou imputar ou remover registros nessa etapa.</Reading>
</Frame>;

const S04Protocol: Page = () => <Frame>
  <Header number="03 · Preparação e protocolo" title="Como evitamos comparar modelos de forma injusta">A base foi dividida antes do treinamento. O mesmo conjunto de treino e o mesmo conjunto de teste foram usados por todos os modelos.</Header>
  <div style={{ position: 'absolute', left: 150, top: 420, width: 1540, display: 'flex', gap: 82 }}>
    <div style={{ width: 430 }}><div style={{ color: c.accent, fontSize: 54, fontWeight: 700 }}>1</div><h2 style={{ margin: '18px 0 0', fontSize: 31 }}>Divisão 80% / 20%</h2><p style={{ margin: '14px 0 0', color: c.muted, fontSize: 24, lineHeight: 1.4 }}>400 registros para treino e 100 para teste, com random_state = 42.</p></div>
    <div style={{ width: 430 }}><div style={{ color: c.accent, fontSize: 54, fontWeight: 700 }}>2</div><h2 style={{ margin: '18px 0 0', fontSize: 31 }}>Escala aprendida no treino</h2><p style={{ margin: '14px 0 0', color: c.muted, fontSize: 24, lineHeight: 1.4 }}>O StandardScaler aplica fit_transform() em X_train e apenas transform() em X_test.</p></div>
    <div style={{ width: 430 }}><div style={{ color: c.accent, fontSize: 54, fontWeight: 700 }}>3</div><h2 style={{ margin: '18px 0 0', fontSize: 31 }}>Teste preservado</h2><p style={{ margin: '14px 0 0', color: c.muted, fontSize: 24, lineHeight: 1.4 }}>O Pipeline mantém o scaler dentro de cada dobra. A busca usa o treino; o teste compara os resultados finais.</p></div>
  </div>
  <Reading>Esse protocolo evita vazamento de dados e permite atribuir diferenças de desempenho ao modelo, não a uma divisão diferente da base.</Reading>
</Frame>;

const S05TargetDistribution: Page = () => <Frame>
  <Header number="04 · Análise exploratória" title="Distribuição do gasto anual">O histograma usa os 400 registros de treino. Ele mostra como os valores do target se distribuem antes da modelagem.</Header>
  <img src={targetDistributionImage} alt="Histograma de Yearly Amount Spent no conjunto de treinamento" style={{ position: 'absolute', left: 150, top: 350, width: 1030, height: 460, objectFit: 'contain' }} />
  <div style={{ position: 'absolute', left: 1270, top: 424, width: 350 }}><Metric value="501,99" label="média no treino" width={350} /><div style={{ marginTop: 66 }}><Metric value="0,068" label="assimetria" detail="próxima de zero" width={350} /></div></div>
  <Reading>Os valores se concentram em torno da média e não apresentam assimetria acentuada. A figura descreve a amostra, sem assumir normalidade ou uma moeda específica.</Reading>
</Frame>;

const S06Features: Page = () => <Frame>
  <Header number="05 · Análise exploratória" title="Escalas e associações das features">As quatro variáveis de entrada têm unidades e amplitudes diferentes. A leitura visual ajuda a justificar a padronização nos modelos sensíveis à escala.</Header>
  <img src={featureDistributionsImage} alt="Histogramas das quatro features selecionadas no treinamento" style={{ position: 'absolute', left: 150, top: 330, width: 1050, height: 480, objectFit: 'contain' }} />
  <div style={{ position: 'absolute', left: 1270, top: 390, width: 380 }}><TableHead>Correlação com o target</TableHead><div style={{ marginTop: 18 }}><Field label="Membership" detail="0,818" /><Field label="Time on App" detail="0,509" /><Field label="Avg. Session" detail="0,324" /><Field label="Time on Website" detail="0,010" /></div></div>
  <Reading>Length of Membership é a feature com maior associação linear com o gasto anual. Tempo no website tem associação praticamente nula nesta amostra.</Reading>
</Frame>;

const S07Correlations: Page = () => <Frame>
  <Header number="06 · Análise exploratória" title="Correlação entre as variáveis">O heatmap usa correlação de Pearson no conjunto de treino. Além do target, verificamos se as features carregam informação muito parecida entre si.</Header>
  <img src={correlationHeatmapImage} alt="Heatmap de correlação das features e do target no treinamento" style={{ position: 'absolute', left: 150, top: 355, width: 925, height: 455, objectFit: 'contain' }} />
  <div style={{ position: 'absolute', left: 1210, top: 405, width: 440 }}><Metric value="0,079" label="maior |r| entre features" detail="correlação baixa entre os preditores" width={440} /><Rule top={230} left={0} width={440} /><div style={{ marginTop: 120 }}><Metric value="1,002–1,010" label="faixa de VIF" detail="sem evidência relevante de multicolinearidade" width={440} /></div></div>
  <Reading>Membership se destaca na relação com o target, mas a análise permanece associativa: esses números não demonstram causalidade.</Reading>
</Frame>;

const S08Outliers: Page = () => <Frame>
  <Header number="07 · Análise exploratória" title="Candidatos a outlier">Boxplots apontam observações distantes do centro da distribuição. O método identifica candidatos, não erros automáticos.</Header>
  <img src={outlierBoxplotsImage} alt="Boxplots das quatro features e do target no treinamento; candidatos pela regra de 1,5 × IQR" style={{ position: 'absolute', left: 150, top: 335, width: 1050, height: 475, objectFit: 'contain' }} />
  <div style={{ position: 'absolute', left: 1280, top: 402, width: 340 }}><Metric value="18" label="linhas candidatas" detail="pela regra de 1,5 × IQR" width={340} /><div style={{ marginTop: 86 }}><Metric value="0" label="linhas removidas" detail="não havia evidência de erro de registro" width={340} /></div></div>
  <Reading>Manter os casos preserva o protocolo e evita que a análise descarte clientes reais apenas por terem valores pouco frequentes.</Reading>
</Frame>;

const S09Models: Page = () => <Frame>
  <Header number="08 · Modelagem" title="Modelos comparados">Todos os modelos partem das mesmas observações. Cada um responde à pergunta de forma diferente e será avaliado com as mesmas métricas.</Header>
  <div style={{ position: 'absolute', left: 150, top: 400, width: 1540 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '340px 460px 1fr', paddingBottom: 17, borderBottom: `1px solid ${c.accent}` }}><TableHead>Modelo</TableHead><TableHead>Função na comparação</TableHead><TableHead>Configuração</TableHead></div>
    <div style={{ display: 'grid', gridTemplateColumns: '340px 460px 1fr', padding: '22px 0', borderBottom: `1px solid ${c.line}`, fontSize: 25 }}><span>Dummy</span><span style={{ color: c.muted }}>baseline</span><span style={{ color: c.muted }}>prevê a média do treino</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '340px 460px 1fr', padding: '22px 0', borderBottom: `1px solid ${c.line}`, fontSize: 25 }}><span>Regressão Linear Múltipla</span><span style={{ color: c.muted }}>referência interpretável</span><span style={{ color: c.muted }}>LinearRegression + StandardScaler</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '340px 460px 1fr', padding: '22px 0', borderBottom: `1px solid ${c.line}`, fontSize: 25 }}><span>Random Forest</span><span style={{ color: c.muted }}>ensemble de árvores</span><span style={{ color: c.muted }}>100 árvores · random_state = 42</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '340px 460px 1fr', padding: '22px 0', borderBottom: `1px solid ${c.line}`, fontSize: 25 }}><span>SVR Linear</span><span style={{ color: c.muted }}>margem linear</span><span style={{ color: c.muted }}>StandardScaler + kernel linear</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '340px 460px 1fr', padding: '22px 0', borderBottom: `1px solid ${c.line}`, fontSize: 25 }}><span>SVR RBF</span><span style={{ color: c.muted }}>margem não linear</span><span style={{ color: c.muted }}>StandardScaler + kernel rbf</span></div>
  </div>
  <Reading>O Dummy mostra o patamar mínimo. A RLM prioriza interpretação; Random Forest e SVR verificam se relações mais flexíveis melhoram a previsão.</Reading>
</Frame>;

const S10Validation: Page = () => <Frame>
  <Header number="09 · Seleção dentro do treino" title="Validação cruzada e busca de hiperparâmetros">Usamos 5 folds nas 400 observações de treino. Em cada dobra, 320 registros treinam e 80 validam.</Header>
  <div style={{ position: 'absolute', left: 150, top: 395, width: 1120 }}><div style={{ display: 'grid', gridTemplateColumns: '420px 210px 250px 1fr', paddingBottom: 15, borderBottom: `1px solid ${c.accent}` }}><TableHead>Modelo</TableHead><TableHead>R² médio</TableHead><TableHead>RMSE médio</TableHead><TableHead>Gap treino–val.</TableHead></div>
    <div style={{ display: 'grid', gridTemplateColumns: '420px 210px 250px 1fr', padding: '18px 0', borderBottom: `1px solid ${c.line}`, fontSize: 23 }}><span>Dummy</span><span>−0,0166</span><span>81,04</span><span>0,0166</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '420px 210px 250px 1fr', padding: '18px 0', borderBottom: `1px solid ${c.line}`, fontSize: 23 }}><span>Regressão Linear Múltipla</span><span>0,9848</span><span>9,88</span><span>0,0007</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '420px 210px 250px 1fr', padding: '18px 0', borderBottom: `1px solid ${c.line}`, fontSize: 23 }}><span>Random Forest</span><span>0,9381</span><span>19,92</span><span>0,0527</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '420px 210px 250px 1fr', padding: '18px 0', borderBottom: `1px solid ${c.line}`, fontSize: 23 }}><span>SVR Linear</span><span>0,9848</span><span>9,86</span><span>0,0006</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '420px 210px 250px 1fr', padding: '18px 0', borderBottom: `1px solid ${c.line}`, fontSize: 23 }}><span>SVR RBF</span><span>0,9212</span><span>22,02</span><span>0,0574</span></div>
  </div>
  <div style={{ position: 'absolute', left: 1370, top: 400, width: 280 }}><TableHead>Busca no treino</TableHead><p style={{ margin: '20px 0 0', fontSize: 24, lineHeight: 1.42 }}>GridSearchCV testou 4 configurações do Forest, 2 do SVR Linear e 4 do SVR RBF.</p><p style={{ margin: '26px 0 0', color: c.muted, fontSize: 22, lineHeight: 1.4 }}>A busca manteve as configurações iniciais. O teste continuou reservado.</p></div>
  <Reading>RLM e SVR Linear têm desempenho e estabilidade muito próximos na validação interna. Essa etapa apoia a seleção, mas não é uma validação externa.</Reading>
</Frame>;

const S11Test: Page = () => <Frame>
  <Header number="10 · Teste reservado" title="Resultados nas 100 observações de teste">O conjunto de teste ficou fora da busca de hiperparâmetros. Ele oferece uma comparação final única entre as alternativas treinadas.</Header>
  <div style={{ position: 'absolute', left: 150, top: 385, width: 1540 }}><div style={{ display: 'grid', gridTemplateColumns: '480px 190px 210px 190px 1fr', paddingBottom: 15, borderBottom: `1px solid ${c.accent}` }}><TableHead>Modelo</TableHead><TableHead>R²</TableHead><TableHead>MAE</TableHead><TableHead>MAPE</TableHead><TableHead>RMSE</TableHead></div>
    <div style={{ display: 'grid', gridTemplateColumns: '480px 190px 210px 190px 1fr', padding: '21px 0', borderBottom: `1px solid ${c.line}`, fontSize: 25 }}><span>Dummy</span><span>−0,0362</span><span>54,91</span><span>12,35%</span><span>71,63</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '480px 190px 210px 190px 1fr', padding: '21px 0', borderBottom: `1px solid ${c.line}`, fontSize: 25 }}><span>Regressão Linear Múltipla</span><span>0,9778</span><span>8,56</span><span>1,79%</span><span>10,48</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '480px 190px 210px 190px 1fr', padding: '21px 0', borderBottom: `1px solid ${c.line}`, fontSize: 25 }}><span>Random Forest</span><span>0,9336</span><span>13,65</span><span>2,99%</span><span>18,13</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '480px 190px 210px 190px 1fr', padding: '21px 0', borderBottom: `1px solid ${c.line}`, fontSize: 25, color: c.warm }}><span>SVR Linear</span><span>0,9780</span><span>8,53</span><span>1,79%</span><span>10,43</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: '480px 190px 210px 190px 1fr', padding: '21px 0', borderBottom: `1px solid ${c.line}`, fontSize: 25 }}><span>SVR RBF</span><span>0,9613</span><span>10,19</span><span>2,22%</span><span>13,85</span></div>
  </div>
  <Reading>O SVR Linear teve o menor RMSE, 10,43. A RLM ficou a 0,05 unidade de distância, com RMSE de 10,48; a diferença prática é muito pequena.</Reading>
</Frame>;

const S12Predictions: Page = () => <Frame>
  <Header number="11 · Previsões" title="Valores reais e valores estimados">Cada ponto representa uma observação do teste. Quanto mais próximo da diagonal tracejada, menor o erro da previsão.</Header>
  <img src={realVsPredImage} alt="Valores reais versus preditos para os quatro modelos no conjunto de teste" style={{ position: 'absolute', left: 150, top: 350, width: 1540, height: 455, objectFit: 'contain' }} />
  <Reading>RLM e SVR Linear se concentram mais perto da diagonal. O gráfico reforça a tabela de métricas, mas não substitui nova validação em outra base.</Reading>
</Frame>;

const S13Diagnostics: Page = () => <Frame>
  <Header number="12 · Diagnóstico" title="Resíduos da previsão">Resíduo é a diferença entre o valor real e o valor previsto. Os gráficos ajudam a procurar padrões de erro que as métricas resumidas não mostram.</Header>
  <img src={residualsImage} alt="Resíduos versus predições dos modelos no teste" style={{ position: 'absolute', left: 150, top: 360, width: 1060, height: 380, objectFit: 'contain' }} />
  <img src={residualDistributionImage} alt="Distribuição dos resíduos da regressão linear múltipla" style={{ position: 'absolute', left: 1260, top: 410, width: 420, height: 280, objectFit: 'contain' }} />
  <Reading top={805}>Na RLM, os resíduos aparecem dos dois lados de zero e não formam um funil evidente. Isso não prova normalidade nem homocedasticidade.</Reading>
</Frame>;

const S14Interpretation: Page = () => <Frame>
  <Header number="13 · Interpretação" title="Quais variáveis carregam mais sinal">A RLM e o Random Forest apontam a mesma ordem geral: Length of Membership e Time on App aparecem primeiro.</Header>
  <img src={featureImportancesImage} alt="Impacto relativo das features na RLM e importância MDI no Random Forest" style={{ position: 'absolute', left: 150, top: 355, width: 1050, height: 400, objectFit: 'contain' }} />
  <div style={{ position: 'absolute', left: 1280, top: 410, width: 360 }}><TableHead>Leitura da RLM</TableHead><p style={{ margin: '20px 0 0', fontSize: 25, lineHeight: 1.42 }}>Uma unidade adicional de Membership se associa a +61,90 unidades no target, condicionada às demais features.</p><Rule top={268} left={0} width={360} /><p style={{ margin: '62px 0 0', color: c.muted, fontSize: 23, lineHeight: 1.4 }}>Importância e coeficientes descrevem associação no modelo; eles não demonstram causa e efeito.</p></div>
  <Reading>Os dois métodos convergem na prioridade das variáveis. Essa concordância torna a interpretação mais consistente dentro desta base, mas não elimina as limitações do experimento.</Reading>
</Frame>;

const S15Conclusion: Page = () => <Frame>
  <Header number="14 · Conclusão" title="Recomendação para este experimento">O SVR Linear venceu por centésimos. Recomendamos a Regressão Linear Múltipla porque praticamente empata em desempenho e explica a previsão de forma mais direta.</Header>
  <div style={{ position: 'absolute', left: 150, top: 445, width: 660 }}><TableHead>Modelo recomendado</TableHead><div style={{ marginTop: 24, fontSize: 50, lineHeight: 1.08, fontWeight: 700 }}>Regressão Linear Múltipla</div><p style={{ margin: '28px 0 0', fontSize: 26, lineHeight: 1.42 }}>RMSE 10,48 no teste. Coeficientes legíveis para explicar a contribuição de cada feature.</p></div>
  <div style={{ position: 'absolute', left: 1000, top: 445, width: 640 }}><TableHead>Limites da conclusão</TableHead><div style={{ marginTop: 20, fontSize: 25, lineHeight: 1.55 }}><p style={{ margin: 0 }}>500 registros e uma única divisão treino–teste</p><p style={{ margin: '18px 0 0' }}>Busca de hiperparâmetros pequena</p><p style={{ margin: '18px 0 0' }}>Sem validação externa</p><p style={{ margin: '18px 0 0' }}>Não aprova uso em produção real</p></div></div>
  <Reading top={830}>A decisão favorece simplicidade e interpretação diante de uma diferença mínima nas métricas. O repositório reúne notebook, código e figuras para consulta.</Reading>
</Frame>;

export const notes = [
  'Apresente o grupo e o objetivo geral. A apresentação começa novamente pela pergunta, passa pelos dados e termina em uma recomendação limitada ao experimento.',
  'Yearly Amount Spent é o gasto anual que queremos estimar. Como a saída é numérica e contínua, o problema é de regressão. As quatro entradas são medidas observadas de uso e relacionamento.',
  'A base tem 500 linhas e 8 colunas: cinco numéricas e três textuais. Email, Address e Avatar não entram no modelo. O notebook também registrou zero valores ausentes e zero linhas completamente duplicadas.',
  'A divisão usa 400 registros para treino e 100 para teste, com random_state igual a 42. O scaler aprende no treino e transforma o teste. A busca de hiperparâmetros não usa o teste.',
  'O histograma é uma figura original do notebook com os 400 registros de treino. A média é 501,99 e a assimetria é 0,068. Esses valores descrevem a amostra e não assumem normalidade.',
  'As quatro features mantêm suas escalas originais na figura. Length of Membership tem correlação 0,818 com o target; Time on App, 0,509; Avg. Session Length, 0,324; Time on Website, 0,010.',
  'O heatmap reúne correlações de Pearson. A maior correlação absoluta entre as features é 0,079 e o VIF varia de 1,002 a 1,010. Isso reduz a preocupação com multicolinearidade nesta amostra, sem demonstrar causalidade.',
  'Os boxplots usam a regra de 1,5 vezes o IQR. Há 18 linhas únicas candidatas entre 400, mas não havia evidência de erro de registro. Nenhum dado foi removido.',
  'Dummy prevê a média do treino. A Regressão Linear Múltipla é a referência interpretável. Random Forest traz um ensemble de árvores, enquanto SVR Linear e RBF comparam margens linear e não linear.',
  'A validação cruzada ocorre apenas no treino. RLM e SVR Linear têm R² médio 0,9848 e RMSE médio de 9,88 e 9,86, respectivamente. A mesma CV apoia a comparação interna e a busca; ela não substitui validação externa.',
  'No teste reservado, SVR Linear obtém RMSE 10,43 e RLM, 10,48. MAE mede erro absoluto médio, RMSE dá mais peso a erros grandes e MAPE expressa erro relativo em percentual.',
  'A diagonal tracejada representa previsão perfeita. RLM e SVR Linear se concentram mais perto dela; Random Forest e SVR RBF apresentam dispersão maior. O gráfico ilustra as métricas.',
  'Resíduo é valor real menos valor previsto. Na RLM, os resíduos ficam dos dois lados de zero e não apresentam funil evidente na inspeção. Isso não prova normalidade nem homocedasticidade.',
  'Length of Membership e Time on App carregam o maior sinal. Na RLM, +1 unidade de Membership se associa a +61,90 no target, condicionada às outras features. Não trate isso como causalidade.',
  'O SVR Linear vence por uma diferença numérica muito pequena. A RLM é recomendada pela combinação de desempenho quase empatado e interpretação direta. Reforce: não há validação externa e o modelo não está aprovado para produção.'
] satisfies (string | undefined)[];

export const meta: SlideMeta = { title: 'Desafio do Oráculo Preditivo — Ecommerce Customers', theme: 'academic-paper', createdAt: '2026-10-05T01:04:16.943Z' };
export default [S01Cover, S02Question, S03Data, S04Protocol, S05TargetDistribution, S06Features, S07Correlations, S08Outliers, S09Models, S10Validation, S11Test, S12Predictions, S13Diagnostics, S14Interpretation, S15Conclusion] satisfies Page[];
