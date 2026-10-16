"""Dashboard Streamlit — Desafio do Oráculo Preditivo (Ecommerce Customers).

Versão alinhada aos slides de `presentation/slides/ecommerce-oracle`: cada página
corresponde a um slide da apresentação (mesma ordem, títulos e textos de leitura),
com os números recalculados a partir do protocolo do notebook
`notebooks/ecommerce_customers.ipynb`: divisão 80/20 com random_state=42, EDA
somente no treino, pipelines com StandardScaler, GridSearchCV pequeno (K=5) e
avaliação final no teste.

Execução (a partir da raiz do repositório):
    streamlit run dashboard/app.py
"""

from pathlib import Path
import time

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import streamlit as st
from sklearn.dummy import DummyRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_absolute_percentage_error,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import GridSearchCV, KFold, cross_validate, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR

# --------------------------------------------------------------------------- #
# Configuração geral
# --------------------------------------------------------------------------- #
CAMINHO_DATASET = Path(__file__).resolve().parent.parent / "data" / "Ecommerce Customers"
VARIAVEL_ALVO = "Yearly Amount Spent"
COLUNAS_FEATURES = [
    "Avg. Session Length",
    "Time on App",
    "Time on Website",
    "Length of Membership",
]
COLUNAS_EXCLUIDAS = ["Email", "Address", "Avatar"]
DESCRICAO_FEATURES = {
    "Avg. Session Length": "duração média da sessão",
    "Time on App": "tempo no aplicativo",
    "Time on Website": "tempo no site",
    "Length of Membership": "tempo de relacionamento",
}
NOME_CURTO_FEATURE = {
    "Avg. Session Length": "Avg. Session",
    "Time on App": "Time on App",
    "Time on Website": "Time on Website",
    "Length of Membership": "Membership",
}
TEST_SIZE = 0.20
RANDOM_STATE = 42
N_FOLDS = 5

# Paleta dos slides (tema "academic-paper")
C = {
    "ink": "#16242E",
    "muted": "#64727A",
    "accent": "#185878",
    "soft": "#557B91",
    "warm": "#8C6332",
    "line": "#D5DCDD",
    "pale": "#EDF3F5",
    "paper": "#FAFAF8",
}
ORDEM_MODELOS = [
    "Dummy (Baseline)",
    "Regressão Linear Múltipla",
    "Random Forest Regressor",
    "SVR (Kernel Linear)",
    "SVR (Kernel RBF)",
]
MODELOS_REAIS = ORDEM_MODELOS[1:]
NOME_CURTO = {
    "Dummy (Baseline)": "Dummy",
    "Regressão Linear Múltipla": "Regressão Linear Múltipla",
    "Random Forest Regressor": "Random Forest",
    "SVR (Kernel Linear)": "SVR Linear",
    "SVR (Kernel RBF)": "SVR RBF",
}
CORES_MODELOS = {
    "Dummy (Baseline)": "#A7B1B6",
    "Regressão Linear Múltipla": C["accent"],
    "Random Forest Regressor": "#6E8F72",
    "SVR (Kernel Linear)": C["warm"],
    "SVR (Kernel RBF)": C["soft"],
}
RLM = "Regressão Linear Múltipla"

st.set_page_config(
    page_title="Oráculo Preditivo — Ecommerce Customers",
    page_icon="🔮",
    layout="wide",
)

# --------------------------------------------------------------------------- #
# Estilo visual (espelha a tipografia e a hierarquia dos slides)
# --------------------------------------------------------------------------- #
CSS = """
<style>
html, body, [class*="css"] { font-family: Arial, Helvetica, sans-serif; }
.block-container { padding-top: 2.4rem; max-width: 1400px; }
.k-kicker { color: #185878; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; margin-bottom: 0.35rem; }
.k-title { font-size: 2.55rem; font-weight: 700; letter-spacing: -0.035em; line-height: 1.08;
  color: #16242E; margin: 0 0 0.7rem; }
.k-lead { color: #64727A; font-size: 1.18rem; line-height: 1.45; max-width: 60rem; margin: 0 0 1.6rem; }
.k-hero { font-size: 4.6rem; font-weight: 700; letter-spacing: -0.06em; line-height: 0.95;
  color: #16242E; margin: 1rem 0 0; }
.k-sub { color: #64727A; font-size: 1.5rem; margin: 1.3rem 0 0; }
.k-body { color: #16242E; font-size: 1.2rem; line-height: 1.45; max-width: 40rem; margin: 0.9rem 0 0; }
.k-members { color: #64727A; font-size: 0.85rem; letter-spacing: 0.04em; margin-top: 2.2rem; }
.k-roteiro { border-top: 1px solid #D5DCDD; margin-top: 5.5rem; padding-top: 1rem;
  color: #64727A; font-size: 1.05rem; line-height: 2.1; }
.k-metric-value { color: #185878; font-size: 3.1rem; font-weight: 700; letter-spacing: -0.05em;
  line-height: 1; }
.k-metric-label { color: #16242E; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.07em;
  text-transform: uppercase; margin-top: 0.55rem; }
.k-metric-detail { color: #64727A; font-size: 0.95rem; line-height: 1.35; margin-top: 0.35rem; }
.k-metric { margin-bottom: 2.2rem; }
.k-th { color: #185878; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; margin-bottom: 0.6rem; }
.k-field { display: flex; justify-content: space-between; gap: 1rem; padding: 0.7rem 0;
  border-bottom: 1px solid #D5DCDD; font-size: 1.02rem; color: #16242E; }
.k-field .d { color: #64727A; text-align: right; }
.k-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem 2rem; }
.k-grid > div { border-top: 1px solid #D5DCDD; padding-top: 0.5rem; font-size: 1rem; color: #16242E; }
.k-grid .d { color: #64727A; margin-top: 0.2rem; }
.k-big { font-size: 2.1rem; font-weight: 700; line-height: 1.1; color: #16242E; margin: 0.4rem 0 0.8rem; }
.k-muted { color: #64727A; font-size: 1.05rem; line-height: 1.45; }
.k-text { color: #16242E; font-size: 1.08rem; line-height: 1.45; }
.k-step-n { color: #185878; font-size: 2.4rem; font-weight: 700; }
.k-step-t { font-size: 1.3rem; font-weight: 700; color: #16242E; margin: 0.5rem 0 0.4rem; }
.k-reading { border-top: 1px solid #D5DCDD; padding-top: 1rem; margin: 1.6rem 0 1rem;
  color: #16242E; font-size: 1.05rem; line-height: 1.5; max-width: 66rem; }
.k-rule { border: none; border-top: 1px solid #D5DCDD; margin: 0.6rem 0 1.4rem; }
.k-acr { color: #185878; font-weight: 700; letter-spacing: 0.035em; }
.k-code { padding: 1px 6px; border: 1px solid #D9E4E7; border-radius: 3px; background: #EDF3F5;
  color: #16242E; font-family: Consolas, "Courier New", monospace; font-size: 0.88em; white-space: nowrap; }
table.k-table { width: 100%; border-collapse: collapse; margin: 0.2rem 0 0.4rem; }
table.k-table th, table.k-table td { border: none !important; background: transparent !important;
  text-align: left; }
table.k-table th { color: #185878; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; padding: 0 0.6rem 0.7rem 0; border-bottom: 1px solid #185878 !important; }
table.k-table td { color: #16242E; font-size: 1.02rem; padding: 0.85rem 0.6rem 0.85rem 0;
  border-bottom: 1px solid #D5DCDD !important; }
table.k-table td.m { color: #64727A; }
table.k-table tr.k-destaque td { color: #8C6332; font-weight: 700; }
.k-footer { color: #64727A; font-size: 0.85rem; letter-spacing: 0.04em; text-align: center;
  padding-top: 0.55rem; }
</style>
"""
st.markdown(CSS, unsafe_allow_html=True)


# --------------------------------------------------------------------------- #
# Utilitários de formatação e componentes visuais
# --------------------------------------------------------------------------- #
def br(valor: float, casas: int = 2) -> str:
    """Formata números no padrão brasileiro usado nos slides (ex.: −0,0166)."""
    texto = f"{valor:,.{casas}f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return texto.replace("-", "−")


def html(conteudo: str) -> None:
    st.markdown(conteudo, unsafe_allow_html=True)


def acr(texto: str) -> str:
    return f'<span class="k-acr">{texto}</span>'


def code(texto: str) -> str:
    return f'<code class="k-code">{texto}</code>'


def cabecalho(kicker: str, titulo: str, lead: str | None = None) -> None:
    bloco = f'<div class="k-kicker">{kicker}</div><div class="k-title">{titulo}</div>'
    if lead:
        bloco += f'<p class="k-lead">{lead}</p>'
    html(bloco)


def metrica(valor: str, rotulo: str, detalhe: str | None = None) -> None:
    bloco = (
        f'<div class="k-metric"><div class="k-metric-value">{valor}</div>'
        f'<div class="k-metric-label">{rotulo}</div>'
    )
    if detalhe:
        bloco += f'<div class="k-metric-detail">{detalhe}</div>'
    html(bloco + "</div>")


def rotulo_tabela(texto: str) -> None:
    html(f'<div class="k-th">{texto}</div>')


def campos(pares: list[tuple[str, str]]) -> None:
    html("".join(f'<div class="k-field"><span>{a}</span><span class="d">{b}</span></div>' for a, b in pares))


def grade(pares: list[tuple[str, str]]) -> None:
    itens = "".join(f'<div>{a}<div class="d">{b}</div></div>' for a, b in pares)
    html(f'<div class="k-grid">{itens}</div>')


def leitura(texto: str) -> None:
    html(f'<div class="k-reading">{texto}</div>')


def tabela_html(colunas: list[str], linhas: list[list[str]], destaque: int | None = None,
                colunas_mutadas: tuple[int, ...] = ()) -> None:
    cab = "".join(f"<th>{c}</th>" for c in colunas)
    corpo = []
    for i, linha in enumerate(linhas):
        classe = ' class="k-destaque"' if destaque is not None and i == destaque else ""
        celulas = "".join(
            f'<td class="m">{v}</td>' if j in colunas_mutadas else f"<td>{v}</td>"
            for j, v in enumerate(linha)
        )
        corpo.append(f"<tr{classe}>{celulas}</tr>")
    html(f'<table class="k-table"><thead><tr>{cab}</tr></thead><tbody>{"".join(corpo)}</tbody></table>')


def estilizar(fig: go.Figure, altura: int = 420) -> go.Figure:
    """Aplica o tema claro dos slides a uma figura Plotly."""
    fig.update_layout(
        template="plotly_white",
        paper_bgcolor=C["paper"],
        plot_bgcolor=C["paper"],
        font=dict(family="Arial, Helvetica, sans-serif", color=C["ink"], size=13),
        height=altura,
        margin=dict(l=40, r=20, t=50, b=40),
        legend=dict(bgcolor="rgba(0,0,0,0)"),
        separators=",.",
    )
    fig.update_xaxes(gridcolor=C["line"], zerolinecolor=C["line"], linecolor=C["line"])
    fig.update_yaxes(gridcolor=C["line"], zerolinecolor=C["line"], linecolor=C["line"])
    fig.update_annotations(font=dict(color=C["ink"], size=13))
    return fig


def grafico(fig: go.Figure, altura: int = 420) -> None:
    st.plotly_chart(estilizar(fig, altura), width="stretch", config={"displayModeBar": False})


def tabela_df(df: pd.DataFrame, casas: int = 4, **kwargs) -> None:
    st.dataframe(df.style.format(precision=casas, decimal=",", thousands="."), width="stretch", **kwargs)


# --------------------------------------------------------------------------- #
# Dados e modelagem (cacheados)
# --------------------------------------------------------------------------- #
@st.cache_data
def carregar_dados() -> pd.DataFrame:
    return pd.read_csv(CAMINHO_DATASET)


@st.cache_data
def dividir_dados(df: pd.DataFrame):
    X = df[COLUNAS_FEATURES].copy()
    y = df[VARIAVEL_ALVO].copy()
    return train_test_split(X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE)


def construir_pipelines() -> dict[str, Pipeline]:
    return {
        "Dummy (Baseline)": Pipeline([("regressor", DummyRegressor(strategy="mean"))]),
        "Regressão Linear Múltipla": Pipeline(
            [("scaler", StandardScaler()), ("regressor", LinearRegression())]
        ),
        "Random Forest Regressor": Pipeline(
            [("regressor", RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE))]
        ),
        "SVR (Kernel Linear)": Pipeline(
            [("scaler", StandardScaler()), ("regressor", SVR(kernel="linear", C=10.0, epsilon=0.1))]
        ),
        "SVR (Kernel RBF)": Pipeline(
            [("scaler", StandardScaler()), ("regressor", SVR(kernel="rbf", C=100.0, epsilon=0.1))]
        ),
    }


GRADES_HIPERPARAMETROS = {
    "Random Forest Regressor": {
        "regressor__n_estimators": [100],
        "regressor__max_depth": [None, 10],
        "regressor__min_samples_leaf": [1, 3],
    },
    "SVR (Kernel Linear)": {
        "regressor__kernel": ["linear"],
        "regressor__C": [1.0, 10.0],
        "regressor__epsilon": [0.1],
    },
    "SVR (Kernel RBF)": {
        "regressor__kernel": ["rbf"],
        "regressor__C": [10.0, 100.0],
        "regressor__epsilon": [0.1, 0.5],
        "regressor__gamma": ["scale"],
    },
}


@st.cache_resource(show_spinner="Treinando modelos (GridSearchCV + K-Fold)…")
def treinar_tudo(_X_train, _y_train, _X_test, _y_test):
    """Executa as etapas de busca, validação cruzada e teste do notebook."""
    kf = KFold(n_splits=N_FOLDS, shuffle=True, random_state=RANDOM_STATE)
    pipelines = construir_pipelines()
    iniciais = construir_pipelines()

    # --- GridSearchCV somente no treino ---
    linhas_busca, resultados_grid, configs, manteve = [], {}, {}, {}
    for nome, grade_hp in GRADES_HIPERPARAMETROS.items():
        busca = GridSearchCV(
            pipelines[nome],
            grade_hp,
            cv=kf,
            scoring="neg_root_mean_squared_error",
            return_train_score=True,
            n_jobs=-1,
            refit=True,
        )
        busca.fit(_X_train, _y_train)
        cvr = pd.DataFrame(busca.cv_results_)
        configs[nome] = len(cvr)
        params_iniciais = iniciais[nome].get_params()
        manteve[nome] = all(params_iniciais[k] == v for k, v in busca.best_params_.items())
        resultados_grid[nome] = pd.DataFrame(
            {
                "Hiperparâmetros": cvr["params"].astype(str),
                "RMSE médio CV": -cvr["mean_test_score"],
                "Desv. RMSE CV": cvr["std_test_score"],
                "RMSE treino médio": -cvr["mean_train_score"],
                "Rank": cvr["rank_test_score"],
            }
        ).sort_values("Rank")
        linhas_busca.append(
            {
                "Algoritmo": nome,
                "Configurações comparadas": len(cvr),
                "Melhores hiperparâmetros": str(busca.best_params_),
                "RMSE médio CV": -busca.best_score_,
                "RMSE treino médio": -cvr["mean_train_score"][busca.best_index_],
            }
        )
        pipelines[nome] = busca.best_estimator_

    # --- Validação cruzada dos modelos selecionados ---
    scoring = {"r2": "r2", "mae": "neg_mean_absolute_error", "rmse": "neg_root_mean_squared_error"}
    linhas_cv, folds_cv = [], []
    for nome in ORDEM_MODELOS:
        cv = cross_validate(pipelines[nome], _X_train, _y_train, cv=kf, scoring=scoring,
                            return_train_score=True, n_jobs=-1)
        linhas_cv.append(
            {
                "Modelo": nome,
                "R² Treino": cv["train_r2"].mean(),
                "R² Validação": cv["test_r2"].mean(),
                "Desv. Padrão R²": cv["test_r2"].std(),
                "Gap Overfit (Treino − Val)": cv["train_r2"].mean() - cv["test_r2"].mean(),
                "MAE Validação": -cv["test_mae"].mean(),
                "RMSE Validação": -cv["test_rmse"].mean(),
            }
        )
        for i, (r2v, rmsev) in enumerate(zip(cv["test_r2"], -cv["test_rmse"]), start=1):
            folds_cv.append({"Modelo": nome, "Fold": i, "R² Validação": r2v, "RMSE Validação": rmsev})

    # --- Avaliação no teste reservado ---
    linhas_teste, predicoes = [], {}
    for nome in ORDEM_MODELOS:
        pipe = pipelines[nome]
        t0 = time.perf_counter()
        pipe.fit(_X_train, _y_train)
        t_treino = (time.perf_counter() - t0) * 1000
        t0 = time.perf_counter()
        y_pred = pipe.predict(_X_test)
        t_pred = (time.perf_counter() - t0) * 1000
        predicoes[nome] = y_pred
        linhas_teste.append(
            {
                "Modelo": nome,
                "Tempo Treino (ms)": t_treino,
                "Tempo Teste (ms)": t_pred,
                "R²": r2_score(_y_test, y_pred),
                "MAE": mean_absolute_error(_y_test, y_pred),
                "MAPE (%)": mean_absolute_percentage_error(_y_test, y_pred) * 100,
                "RMSE": np.sqrt(mean_squared_error(_y_test, y_pred)),
            }
        )

    return {
        "pipelines": pipelines,
        "tabela_busca": pd.DataFrame(linhas_busca),
        "resultados_grid": resultados_grid,
        "configs": configs,
        "manteve": manteve,
        "tabela_cv": pd.DataFrame(linhas_cv).set_index("Modelo"),
        "folds_cv": pd.DataFrame(folds_cv),
        "tabela_teste": pd.DataFrame(linhas_teste).set_index("Modelo"),
        "predicoes": predicoes,
    }


def analisar_outliers(dados: pd.DataFrame) -> tuple[pd.DataFrame, set]:
    linhas, indices = [], set()
    for col in [*COLUNAS_FEATURES, VARIAVEL_ALVO]:
        q1, q3 = dados[col].quantile([0.25, 0.75])
        iqr = q3 - q1
        li, ls = q1 - 1.5 * iqr, q3 + 1.5 * iqr
        mask = (dados[col] < li) | (dados[col] > ls)
        indices |= set(dados.index[mask])
        linhas.append({"Variável": col, "Q1": q1, "Q3": q3, "IQR": iqr, "Limite inferior": li,
                       "Limite superior": ls, "Candidatos": int(mask.sum()),
                       "Percentual (%)": 100 * mask.mean()})
    return pd.DataFrame(linhas).set_index("Variável"), indices


# --------------------------------------------------------------------------- #
# Carregamento e estatísticas compartilhadas
# --------------------------------------------------------------------------- #
df = carregar_dados()
X_train, X_test, y_train, y_test = dividir_dados(df)
dados_eda = X_train.copy()
dados_eda[VARIAVEL_ALVO] = y_train
resultados = treinar_tudo(X_train, y_train, X_test, y_test)
pipelines = resultados["pipelines"]
tabela_cv = resultados["tabela_cv"]
tabela_teste = resultados["tabela_teste"]

corr = dados_eda.corr(method="pearson")
corr_alvo = corr[VARIAVEL_ALVO].drop(VARIAVEL_ALVO).sort_values(ascending=False)
corr_features = dados_eda[COLUNAS_FEATURES].corr().to_numpy()
maior_r_features = np.abs(corr_features[~np.eye(len(COLUNAS_FEATURES), dtype=bool)]).max()
vif = pd.Series(np.diag(np.linalg.inv(corr_features)), index=COLUNAS_FEATURES)
tabela_outliers, indices_outliers = analisar_outliers(dados_eda)

melhor_teste = tabela_teste.loc[MODELOS_REAIS, "RMSE"].idxmin()

pipe_rlm = pipelines[RLM]
reg_rlm, scaler_rlm = pipe_rlm.named_steps["regressor"], pipe_rlm.named_steps["scaler"]
coeficientes = pd.DataFrame(
    {
        "Coeficiente padronizado": reg_rlm.coef_,
        "Desvio-padrão (treino)": scaler_rlm.scale_,
        "Variação por unidade observada": reg_rlm.coef_ / scaler_rlm.scale_,
    },
    index=COLUNAS_FEATURES,
)
importancias_rf = pd.Series(
    pipelines["Random Forest Regressor"].named_steps["regressor"].feature_importances_,
    index=COLUNAS_FEATURES,
)


# --------------------------------------------------------------------------- #
# Páginas — uma por slide, na mesma ordem da apresentação
# --------------------------------------------------------------------------- #
def slide_01_capa():
    c1, c2 = st.columns([2.3, 1])
    with c1:
        html(
            '<div class="k-kicker">Grupo 01 · Aprendizagem de Máquina</div>'
            '<div class="k-hero">Desafio do<br>Oráculo Preditivo</div>'
            '<p class="k-sub">Ecommerce Customers</p>'
            '<p class="k-body">Comparamos modelos de regressão para estimar o gasto anual de clientes '
            'a partir de sinais de uso e relacionamento.</p>'
            '<p class="k-members">Apolo Bastos · Nicolas Gabriel · Caio Simonassi · Gabriel Nito · Jônatas</p>'
        )
    with c2:
        html('<div class="k-roteiro">Base de dados<br>Preparação<br>Modelos<br>Resultados<br>Recomendação</div>')


def slide_02_pergunta():
    cabecalho(
        "Pergunta do experimento",
        "Estimativa do gasto anual",
        "A variável que queremos prever é <strong>Yearly Amount Spent</strong>. Como o resultado é "
        "numérico e contínuo, tratamos o problema como regressão.",
    )
    c1, _, c2 = st.columns([1.4, 0.25, 1])
    with c1:
        rotulo_tabela("Entradas usadas")
        campos([(f, DESCRICAO_FEATURES[f]) for f in COLUNAS_FEATURES])
    with c2:
        rotulo_tabela("Variável-alvo (y)")
        html('<div class="k-big">Yearly Amount Spent</div>'
             '<p class="k-muted">O modelo recebe quatro medidas observadas de cada cliente e devolve '
             'um valor anual estimado.</p>')
    leitura("O slide define a pergunta antes de mostrar métricas: queremos saber quanto o modelo consegue "
            "aproximar o gasto anual usando apenas essas quatro variáveis.")
    with st.expander("Ver amostra dos dados usados"):
        tabela_df(df[[*COLUNAS_FEATURES, VARIAVEL_ALVO]].head(10), casas=2, hide_index=True)


def slide_03_base():
    n_num = df.select_dtypes("number").shape[1]
    n_txt = df.shape[1] - n_num
    ausentes = int(df.isnull().sum().sum())
    duplicadas = int(df.duplicated().sum())
    cabecalho(
        "Base e seleção de colunas",
        "O que existe no arquivo",
        f"O arquivo Ecommerce Customers contém {len(df)} registros e {df.shape[1]} colunas. A inspeção "
        "inicial separou dados úteis para previsão de identificadores textuais.",
    )
    c1, c2, c3, _ = st.columns([1, 1, 1, 0.6])
    with c1:
        metrica(str(len(df)), "registros", "uma linha por cliente")
    with c2:
        metrica(str(df.shape[1]), "colunas", f"{n_num} numéricas e {n_txt} textuais")
    with c3:
        metrica(str(len(COLUNAS_FEATURES)), "features", "mais 1 variável-alvo")
    html('<hr class="k-rule">')
    c1, _, c2 = st.columns([1, 0.15, 1])
    with c1:
        rotulo_tabela("Colunas que entram no modelo")
        grade([(f, DESCRICAO_FEATURES[f]) for f in COLUNAS_FEATURES])
    with c2:
        rotulo_tabela("Colunas que ficam fora")
        grade([(col, "identificador textual") for col in COLUNAS_EXCLUIDAS])
    if ausentes == 0 and duplicadas == 0:
        leitura("Não havia valores ausentes nem linhas completamente duplicadas. Por isso, a preparação "
                "não precisou imputar ou remover registros nessa etapa.")
    else:
        leitura(f"Foram encontrados {ausentes} valores ausentes e {duplicadas} linhas duplicadas.")
    with st.expander("Papel de cada coluna (tabela completa)"):
        decisoes = pd.DataFrame(
            [
                ("Email", "excluída", "identificador textual de alta cardinalidade"),
                ("Address", "excluída", "texto identificador; categorizar introduziria ruído e memorização"),
                ("Avatar", "excluída", "rótulo textual sem significado preditivo justificado"),
                *[(f, "feature", DESCRICAO_FEATURES[f]) for f in COLUNAS_FEATURES],
                (VARIAVEL_ALVO, "target", "valor gasto anualmente (variável dependente)"),
            ],
            columns=["Coluna", "Papel", "Justificativa"],
        )
        decisoes["Tipo"] = decisoes["Coluna"].map(df.dtypes.astype(str))
        decisoes["Valores distintos"] = decisoes["Coluna"].map(df.nunique())
        st.dataframe(decisoes, width="stretch", hide_index=True)
        st.dataframe(df, width="stretch", height=260)


def slide_04_protocolo():
    cabecalho(
        "Preparação e protocolo",
        "Como evitamos comparar modelos de forma injusta",
        "A base foi dividida antes do treinamento. O mesmo conjunto de treino e o mesmo conjunto de teste "
        "foram usados por todos os modelos.",
    )
    passos = [
        ("Divisão 80% / 20%",
         f"{len(X_train)} registros para treino e {len(X_test)} para teste, com {code('random_state = 42')}."),
        ("Escala aprendida no treino",
         f"O {code('StandardScaler')} aplica {code('fit_transform()')} em {code('X_train')} e apenas "
         f"{code('transform()')} em {code('X_test')}."),
        ("Teste preservado",
         f"O {code('Pipeline')} mantém o scaler dentro de cada dobra. A busca usa o treino; o teste compara "
         "os resultados finais."),
    ]
    for coluna, (i, (titulo, texto)) in zip(st.columns(3, gap="large"), enumerate(passos, start=1)):
        with coluna:
            html(f'<div class="k-step-n">{i}</div><div class="k-step-t">{titulo}</div>'
                 f'<p class="k-muted">{texto}</p>')
    leitura("Esse protocolo evita vazamento de dados e permite atribuir diferenças de desempenho ao modelo, "
            "não a uma divisão diferente da base.")
    with st.expander("Conferir a divisão treino/teste"):
        comp = pd.concat(
            [
                pd.DataFrame({"Conjunto": "Treino", VARIAVEL_ALVO: y_train}),
                pd.DataFrame({"Conjunto": "Teste", VARIAVEL_ALVO: y_test}),
            ]
        )
        fig = px.histogram(comp, x=VARIAVEL_ALVO, color="Conjunto", barmode="overlay",
                           histnorm="probability density", nbins=25, opacity=0.65,
                           color_discrete_map={"Treino": C["accent"], "Teste": C["warm"]},
                           title="Distribuição do target: treino vs. teste")
        grafico(fig, 340)


def slide_05_distribuicao_alvo():
    media = y_train.mean()
    assimetria = y_train.skew()
    cabecalho(
        "Análise exploratória",
        "Distribuição do gasto anual",
        f"O histograma usa os {len(X_train)} registros de treino. Ele mostra como os valores do target se "
        "distribuem antes da modelagem.",
    )
    c1, _, c2 = st.columns([2.6, 0.15, 1])
    with c1:
        fig = px.histogram(dados_eda, x=VARIAVEL_ALVO, nbins=20, color_discrete_sequence=[C["accent"]])
        fig.update_traces(marker_line_color=C["paper"], marker_line_width=1)
        fig.add_vline(media, line_dash="dash", line_color=C["warm"],
                      annotation_text=f"média = {br(media)}", annotation_font_color=C["warm"])
        fig.update_layout(yaxis_title="Frequência", bargap=0.02)
        grafico(fig, 430)
    with c2:
        st.write("")
        metrica(br(media), "média no treino")
        metrica(br(assimetria, 3), "assimetria",
                "próxima de zero" if abs(assimetria) < 0.5 else "assimetria relevante")
    leitura("Os valores se concentram em torno da média e não apresentam assimetria acentuada. A figura "
            "descreve a amostra, sem assumir normalidade ou uma moeda específica.")
    with st.expander("Estatística descritiva do treino"):
        desc = pd.DataFrame(
            {
                "Média": dados_eda.mean(),
                "Mediana": dados_eda.median(),
                "Desvio-padrão": dados_eda.std(),
                "Mínimo": dados_eda.min(),
                "Q1": dados_eda.quantile(0.25),
                "Q3": dados_eda.quantile(0.75),
                "Máximo": dados_eda.max(),
                "Assimetria": dados_eda.skew(),
            }
        )
        tabela_df(desc, casas=3)
        st.caption("Proximidade entre média e mediana não comprova normalidade.")


def slide_06_features():
    cabecalho(
        "Análise exploratória",
        "Escalas e associações das features",
        "As quatro variáveis de entrada têm unidades e amplitudes diferentes. A leitura visual ajuda a "
        "justificar a padronização nos modelos sensíveis à escala.",
    )
    c1, _, c2 = st.columns([2.6, 0.15, 1])
    with c1:
        fig = make_subplots(rows=2, cols=2, subplot_titles=COLUNAS_FEATURES,
                            vertical_spacing=0.16, horizontal_spacing=0.08)
        for i, col in enumerate(COLUNAS_FEATURES):
            fig.add_trace(go.Histogram(x=dados_eda[col], nbinsx=20, marker_color=C["accent"],
                                       marker_line_color=C["paper"], marker_line_width=1,
                                       showlegend=False), row=i // 2 + 1, col=i % 2 + 1)
        fig.update_layout(bargap=0.02)
        grafico(fig, 470)
    with c2:
        st.write("")
        rotulo_tabela("Correlação com o target")
        campos([(NOME_CURTO_FEATURE[f], br(r, 3)) for f, r in corr_alvo.items()])
    mais_forte, mais_fraca = corr_alvo.index[0], corr_alvo.abs().idxmin()
    leitura(f"{mais_forte} é a feature com maior associação linear com o gasto anual. {mais_fraca} tem "
            f"associação praticamente nula nesta amostra (r = {br(corr_alvo[mais_fraca], 3)}).")
    with st.expander("Explorar a relação de cada feature com o target"):
        feat = st.selectbox("Feature (eixo X)", COLUNAS_FEATURES, index=3)
        fig = px.scatter(dados_eda, x=feat, y=VARIAVEL_ALVO, color_discrete_sequence=[C["soft"]],
                         opacity=0.75)
        inclinacao, intercepto = np.polyfit(dados_eda[feat], dados_eda[VARIAVEL_ALVO], 1)
        xs = np.linspace(dados_eda[feat].min(), dados_eda[feat].max(), 50)
        fig.add_trace(go.Scatter(x=xs, y=inclinacao * xs + intercepto, mode="lines",
                                 line=dict(color=C["warm"], width=2.5), name="Reta MQO"))
        fig.update_layout(title=f"{feat} × {VARIAVEL_ALVO} (Pearson r = {br(corr_alvo[feat], 3)})")
        grafico(fig, 420)


def slide_07_correlacoes():
    cabecalho(
        "Análise exploratória",
        "Correlação entre as variáveis",
        "O heatmap usa correlação de Pearson no conjunto de treino. Além do target, verificamos se as "
        "features carregam informação muito parecida entre si.",
    )
    c1, _, c2 = st.columns([2.2, 0.15, 1])
    with c1:
        escala = [[0.0, C["warm"]], [0.5, C["paper"]], [1.0, C["accent"]]]
        fig = px.imshow(corr, text_auto=".2f", color_continuous_scale=escala, zmin=-1, zmax=1,
                        aspect="auto")
        fig.update_layout(coloraxis_colorbar=dict(title="r"))
        grafico(fig, 470)
    with c2:
        st.write("")
        metrica(br(maior_r_features, 3), "maior |r| entre features", "correlação baixa entre os preditores")
        metrica(f"{br(vif.min(), 3)}–{br(vif.max(), 3)}", f"faixa de {acr('VIF')}",
                "mede redundância entre as features")
    leitura("Membership se destaca na relação com o target, mas a análise permanece associativa: esses "
            "números não demonstram causalidade.")
    with st.expander("Tabela de VIF e número de condição"):
        tabela_df(vif.rename("VIF").to_frame(), casas=3)
        st.metric("Nº de condição da matriz de correlação", br(np.linalg.cond(corr_features), 3))
        st.caption("VIFs ≈ 1 → sem multicolinearidade relevante.")


def slide_08_outliers():
    cabecalho(
        "Análise exploratória",
        "Candidatos a outlier",
        "Boxplots apontam observações distantes do centro da distribuição. O método identifica candidatos, "
        "não erros automáticos.",
    )
    c1, _, c2 = st.columns([2.6, 0.15, 1])
    with c1:
        colunas = [*COLUNAS_FEATURES, VARIAVEL_ALVO]
        fig = make_subplots(rows=1, cols=len(colunas), subplot_titles=colunas)
        for i, col in enumerate(colunas, start=1):
            fig.add_trace(go.Box(y=dados_eda[col], name=col, marker_color=C["accent"],
                                 line_color=C["accent"], fillcolor=C["pale"],
                                 boxpoints="outliers", showlegend=False), row=1, col=i)
        fig.update_xaxes(showticklabels=False)
        fig.update_annotations(font_size=11)
        grafico(fig, 450)
    with c2:
        st.write("")
        metrica(str(len(indices_outliers)), "linhas candidatas", "pela regra de 1,5 × IQR")
        metrica("0", "linhas removidas", "não havia evidência de erro de registro")
    leitura("Manter os casos preserva o protocolo e evita que a análise descarte clientes reais apenas por "
            "terem valores pouco frequentes.")
    with st.expander("Limites do IQR por variável"):
        st.dataframe(
            tabela_outliers.style.format("{:.3f}", decimal=",",
                                         subset=tabela_outliers.columns.drop("Candidatos")),
            width="stretch",
        )
        st.caption(f"{len(indices_outliers)} de {len(dados_eda)} linhas do treino têm ao menos um candidato "
                   f"({br(100 * len(indices_outliers) / len(dados_eda))}%).")


def slide_09_modelos():
    cabecalho(
        "Modelagem",
        "Modelos comparados",
        f"Todos os modelos usam as mesmas observações e métricas. {acr('SVR')} significa Support Vector "
        f"Regression. {acr('RBF')} permite uma relação não linear.",
    )
    tabela_html(
        ["Modelo", "Função na comparação", "Configuração"],
        [
            ["Dummy", "baseline", "prevê a média do treino"],
            ["Regressão Linear Múltipla", "referência interpretável",
             f"{code('LinearRegression')} + {code('StandardScaler')}"],
            ["Random Forest", "ensemble de árvores", f"100 árvores · {code('random_state = 42')}"],
            [f"{acr('SVR')} Linear", "margem linear", f"{code('StandardScaler')} + {code(chr(39) + 'linear' + chr(39))}"],
            [f"{acr('SVR')} {acr('RBF')}", "margem não linear",
             f"{code('StandardScaler')} + {code(chr(39) + 'rbf' + chr(39))}"],
        ],
        colunas_mutadas=(1, 2),
    )
    leitura("O Dummy mostra o patamar mínimo. A Regressão Linear Múltipla continua como referência "
            "interpretável.")
    with st.expander("Grades de hiperparâmetros testadas no GridSearchCV"):
        linhas = [
            {"Algoritmo": NOME_CURTO[nome], "Hiperparâmetro": k.replace("regressor__", ""),
             "Valores testados": ", ".join(map(str, v))}
            for nome, grade_hp in GRADES_HIPERPARAMETROS.items() for k, v in grade_hp.items()
        ]
        st.dataframe(pd.DataFrame(linhas), width="stretch", hide_index=True)


def slide_10_validacao():
    n = len(X_train)
    cabecalho(
        "Seleção dentro do treino",
        "Validação cruzada e busca de hiperparâmetros",
        f"Usamos {N_FOLDS} folds nas {n} observações de treino. Em cada dobra, "
        f"{n - n // N_FOLDS} registros treinam e {n // N_FOLDS} validam.",
    )
    c1, _, c2 = st.columns([2.6, 0.2, 1])
    with c1:
        tabela_html(
            ["Modelo", "R² médio", f"{acr('RMSE')} médio", "Gap treino–val."],
            [
                [NOME_CURTO[m], br(tabela_cv.loc[m, "R² Validação"], 4),
                 br(tabela_cv.loc[m, "RMSE Validação"]), br(tabela_cv.loc[m, "Gap Overfit (Treino − Val)"], 4)]
                for m in ORDEM_MODELOS
            ],
        )
    with c2:
        cfg = resultados["configs"]
        rotulo_tabela("Busca no treino")
        html(f'<p class="k-text">{code("GridSearchCV")} testou {cfg["Random Forest Regressor"]} '
             f'configurações do Forest, {cfg["SVR (Kernel Linear)"]} do SVR Linear e '
             f'{cfg["SVR (Kernel RBF)"]} do SVR RBF.</p>')
        if all(resultados["manteve"].values()):
            texto = "A busca manteve as configurações iniciais. O teste continuou reservado."
        else:
            alterados = [NOME_CURTO[k] for k, v in resultados["manteve"].items() if not v]
            texto = f"A busca alterou a configuração de: {', '.join(alterados)}. O teste continuou reservado."
        html(f'<p class="k-muted">{texto}</p>')
    leitura(f"{acr('R²')} indica quanto da variação do gasto o modelo explica. {acr('RMSE')} dá mais peso aos "
            f"erros grandes. A Regressão Linear Múltipla ({acr('RLM')}) e o {acr('SVR')} Linear ficam muito "
            "próximos. Essa etapa ainda não é uma validação externa.")
    with st.expander("Detalhes da validação cruzada e da busca"):
        tabela_df(resultados["tabela_busca"], hide_index=True)
        alg = st.selectbox("Ver todas as configurações de", list(resultados["resultados_grid"]))
        tabela_df(resultados["resultados_grid"][alg], hide_index=True)
        tabela_df(tabela_cv)
        g1, g2 = st.columns(2)
        with g1:
            longo = tabela_cv.loc[MODELOS_REAIS].reset_index().melt(
                id_vars="Modelo", value_vars=["R² Treino", "R² Validação"], var_name="Conjunto", value_name="R²")
            fig = px.bar(longo, x="Modelo", y="R²", color="Conjunto", barmode="group", text_auto=".3f",
                         color_discrete_map={"R² Treino": C["soft"], "R² Validação": C["accent"]},
                         title="Diagnóstico de overfitting: R² treino vs. validação")
            fig.update_yaxes(range=[0.9, 1.0])
            grafico(fig, 400)
        with g2:
            folds = resultados["folds_cv"]
            fig = px.box(folds[folds["Modelo"] != "Dummy (Baseline)"], x="Modelo", y="RMSE Validação",
                         color="Modelo", color_discrete_map=CORES_MODELOS, points="all", title="RMSE por fold")
            fig.update_layout(showlegend=False)
            grafico(fig, 400)
        st.warning("Como a mesma CV participou da seleção, sua pontuação não é uma estimativa perfeitamente "
                   "imparcial de generalização.")


def slide_11_teste():
    cabecalho(
        "Teste reservado",
        f"Resultados nas {len(X_test)} observações de teste",
        "O conjunto de teste ficou fora da busca de hiperparâmetros. Ele oferece uma comparação final única "
        "entre as alternativas treinadas.",
    )
    tabela_html(
        ["Modelo", "R²", acr("MAE"), acr("MAPE"), acr("RMSE")],
        [
            [NOME_CURTO[m], br(tabela_teste.loc[m, "R²"], 4), br(tabela_teste.loc[m, "MAE"]),
             f"{br(tabela_teste.loc[m, 'MAPE (%)'])}%", br(tabela_teste.loc[m, "RMSE"])]
            for m in ORDEM_MODELOS
        ],
        destaque=ORDEM_MODELOS.index(melhor_teste),
    )
    rmse_melhor, rmse_rlm = tabela_teste.loc[melhor_teste, "RMSE"], tabela_teste.loc[RLM, "RMSE"]
    if melhor_teste == RLM:
        comparacao = f"A {acr('RLM')} teve o menor RMSE: {br(rmse_rlm)}."
    else:
        comparacao = (f"O {NOME_CURTO[melhor_teste].replace('SVR', acr('SVR'))} teve {br(rmse_melhor)} e a "
                      f"{acr('RLM')}, {br(rmse_rlm)}.")
    leitura(f"{acr('MAE')} mostra o erro absoluto médio. {acr('MAPE')} mostra o erro percentual médio. "
            f"{acr('RMSE')} dá mais peso aos erros grandes. {comparacao}")
    with st.expander("Comparar modelos por métrica"):
        metrica_sel = st.radio("Métrica", ["RMSE", "MAE", "MAPE (%)", "R²"], horizontal=True)
        incluir_dummy = st.checkbox("Incluir baseline (Dummy)", value=False)
        base = tabela_teste if incluir_dummy else tabela_teste.loc[MODELOS_REAIS]
        base = base.reset_index().sort_values(metrica_sel, ascending=metrica_sel != "R²")
        fig = px.bar(base, x="Modelo", y=metrica_sel, color="Modelo", color_discrete_map=CORES_MODELOS,
                     text_auto=".3f")
        fig.update_layout(showlegend=False)
        grafico(fig, 360)
        tabela_df(tabela_teste[["Tempo Treino (ms)", "Tempo Teste (ms)"]], casas=2)
        st.caption("Unidades monetárias do dataset (moeda não especificada). Tempos medidos nesta execução.")


def slide_12_previsoes():
    cabecalho(
        "Previsões",
        "Valores reais e valores estimados",
        "Cada ponto representa uma observação do teste. Quanto mais próximo da diagonal tracejada, menor o "
        "erro da previsão.",
    )
    preds = resultados["predicoes"]
    lim = [min(y_test.min(), *(preds[m].min() for m in MODELOS_REAIS)) - 10,
           max(y_test.max(), *(preds[m].max() for m in MODELOS_REAIS)) + 10]
    fig = make_subplots(
        rows=1, cols=len(MODELOS_REAIS), shared_yaxes=True, horizontal_spacing=0.03,
        subplot_titles=[f"{NOME_CURTO[m]} · R² = {br(tabela_teste.loc[m, 'R²'], 4)}" for m in MODELOS_REAIS],
    )
    for i, m in enumerate(MODELOS_REAIS, start=1):
        fig.add_trace(go.Scatter(x=y_test, y=preds[m], mode="markers", showlegend=False,
                                 marker=dict(color=CORES_MODELOS[m], size=7, opacity=0.85,
                                             line=dict(color=C["paper"], width=1))), row=1, col=i)
        fig.add_trace(go.Scatter(x=lim, y=lim, mode="lines", showlegend=False,
                                 line=dict(color=C["ink"], dash="dash", width=1.2)), row=1, col=i)
        fig.update_xaxes(range=lim, title_text="Valor real", row=1, col=i)
    fig.update_yaxes(range=lim)
    fig.update_yaxes(title_text="Valor predito", row=1, col=1)
    grafico(fig, 430)
    leitura(f"{acr('RLM')} e {acr('SVR')} Linear se concentram mais perto da diagonal. O gráfico reforça a "
            "tabela de métricas, mas não substitui nova validação em outra base.")


def slide_13_diagnostico():
    cabecalho(
        "Diagnóstico",
        "Resíduos da previsão",
        "Resíduo é a diferença entre o valor real e o valor previsto. Os gráficos ajudam a procurar padrões "
        "de erro que as métricas resumidas não mostram.",
    )
    preds = resultados["predicoes"]
    c1, _, c2 = st.columns([1.9, 0.1, 1])
    with c1:
        fig = make_subplots(rows=2, cols=2, subplot_titles=[NOME_CURTO[m] for m in MODELOS_REAIS],
                            shared_yaxes=True, vertical_spacing=0.16, horizontal_spacing=0.05)
        for i, m in enumerate(MODELOS_REAIS):
            residuos = y_test.to_numpy() - preds[m]
            linha, coluna = i // 2 + 1, i % 2 + 1
            fig.add_trace(go.Scatter(x=preds[m], y=residuos, mode="markers", showlegend=False,
                                     marker=dict(color=CORES_MODELOS[m], size=6, opacity=0.85,
                                                 line=dict(color=C["paper"], width=1))),
                          row=linha, col=coluna)
            fig.add_hline(0, line_dash="dash", line_color=C["ink"], line_width=1, row=linha, col=coluna)
        fig.update_xaxes(title_text="Valor predito", row=2)
        fig.update_yaxes(title_text="Resíduo", col=1)
        grafico(fig, 470)
    with c2:
        modelo = st.selectbox("Distribuição dos resíduos de", MODELOS_REAIS, index=0,
                              format_func=lambda m: NOME_CURTO[m])
        residuos = y_test.to_numpy() - preds[modelo]
        mu, sigma = residuos.mean(), residuos.std(ddof=1)
        xs = np.linspace(residuos.min(), residuos.max(), 150)
        fig = go.Figure()
        fig.add_trace(go.Histogram(x=residuos, histnorm="probability density", nbinsx=16,
                                   marker_color=CORES_MODELOS[modelo], opacity=0.8, name="Resíduos",
                                   marker_line_color=C["paper"], marker_line_width=1))
        fig.add_trace(go.Scatter(x=xs, y=np.exp(-0.5 * ((xs - mu) / sigma) ** 2) / (sigma * np.sqrt(2 * np.pi)),
                                 mode="lines", line=dict(color=C["warm"], width=2.5),
                                 name="Referência gaussiana"))
        fig.add_vline(0, line_dash="dash", line_color=C["ink"], line_width=1)
        fig.update_layout(xaxis_title="Resíduo", yaxis_title="Densidade", showlegend=True,
                          legend=dict(orientation="h", y=-0.3))
        grafico(fig, 380)
        st.caption(f"μ = {br(mu)} · σ = {br(sigma)} — curva de referência, não é teste de normalidade.")
    leitura(f"Na Regressão Linear Múltipla ({acr('RLM')}), os resíduos aparecem dos dois lados de zero e não "
            "formam um funil evidente. Isso não prova normalidade nem homocedasticidade.")


def slide_14_interpretacao():
    cabecalho(
        "Interpretação",
        "Quais variáveis carregam mais sinal",
        f"A Regressão Linear Múltipla ({acr('RLM')}) e o Random Forest apontam a mesma ordem geral: "
        "Length of Membership e Time on App aparecem primeiro.",
    )
    c1, _, c2 = st.columns([2.6, 0.15, 1])
    with c1:
        coef = coeficientes["Coeficiente padronizado"].sort_values()
        imp = importancias_rf.sort_values()
        fig = make_subplots(rows=1, cols=2, horizontal_spacing=0.22,
                            subplot_titles=["RLM · impacto de +1 desvio-padrão", "Random Forest · importância MDI"])
        fig.add_trace(go.Bar(x=coef.values, y=coef.index, orientation="h", marker_color=C["accent"],
                             text=[br(v) for v in coef.values], textposition="auto", showlegend=False),
                      row=1, col=1)
        fig.add_trace(go.Bar(x=imp.values, y=imp.index, orientation="h", marker_color=CORES_MODELOS[
            "Random Forest Regressor"], text=[br(v, 3) for v in imp.values], textposition="auto",
            showlegend=False), row=1, col=2)
        grafico(fig, 420)
    with c2:
        unidade = coeficientes.loc["Length of Membership", "Variação por unidade observada"]
        st.write("")
        rotulo_tabela(f"Leitura da {acr('RLM')}")
        html(f'<p class="k-text">Uma unidade adicional de Membership se associa a {"+" if unidade >= 0 else ""}'
             f'{br(unidade)} unidades no target, condicionada às demais features.</p>'
             '<hr class="k-rule">'
             '<p class="k-muted">Importância e coeficientes descrevem associação no modelo; eles não '
             'demonstram causa e efeito.</p>')
    leitura("Os dois métodos convergem na prioridade das variáveis. Essa concordância torna a interpretação "
            "mais consistente dentro desta base, mas não elimina as limitações do experimento.")
    with st.expander("Coeficientes completos da RLM"):
        st.metric("Intercepto (gasto estimado com features na média)", br(reg_rlm.intercept_))
        tabela_df(coeficientes.sort_values("Coeficiente padronizado", ascending=False))


def slide_15_conclusao():
    rmse_rlm = tabela_teste.loc[RLM, "RMSE"]
    if melhor_teste == RLM:
        lead = (f"A Regressão Linear Múltipla teve o menor {acr('RMSE')} no teste e ainda explica a previsão "
                "de forma direta.")
    else:
        diferenca = rmse_rlm - tabela_teste.loc[melhor_teste, "RMSE"]
        lead = (f"O {NOME_CURTO[melhor_teste].replace('SVR', acr('SVR'))} venceu por {br(diferenca)} de "
                f"{acr('RMSE')}. Recomendamos a Regressão Linear Múltipla porque praticamente empata em "
                "desempenho e explica a previsão de forma mais direta.")
    cabecalho("Conclusão", "Recomendação para este experimento", lead)
    c1, _, c2 = st.columns([1, 0.25, 1])
    with c1:
        rotulo_tabela("Modelo recomendado")
        html(f'<div class="k-big">Regressão Linear Múltipla</div>'
             f'<p class="k-text">RMSE {br(rmse_rlm)} no teste. Coeficientes legíveis para explicar a '
             'contribuição de cada feature.</p>')
    with c2:
        rotulo_tabela("Limites da conclusão")
        campos([
            (f"{len(df)} registros e uma única divisão treino–teste", ""),
            ("Busca de hiperparâmetros pequena", ""),
            ("Sem validação externa", ""),
            ("Não aprova uso em produção real", ""),
        ])
    leitura("A decisão favorece simplicidade e interpretação diante de uma diferença mínima nas métricas. "
            "O repositório reúne notebook, código e figuras para consulta.")


def extra_simulador():
    cabecalho(
        "Extra · Demonstração",
        "Simulador de previsão",
        f"Ajuste o perfil de um cliente hipotético e compare as previsões de cada modelo, treinados nos "
        f"{len(X_train)} registros de treino.",
    )
    c1, _, c2 = st.columns([1, 0.1, 2])
    with c1:
        valores = {}
        for col in COLUNAS_FEATURES:
            mn, mx = float(df[col].min()), float(df[col].max())
            valores[col] = st.slider(col, mn, mx, float(X_train[col].median()), step=0.01, key=f"sim_{col}")
        entrada = pd.DataFrame([valores])
    with c2:
        prev = pd.DataFrame(
            [{"Modelo": m, "Previsão": float(pipelines[m].predict(entrada)[0])} for m in ORDEM_MODELOS]
        )
        rlm_prev = prev.set_index("Modelo").loc[RLM, "Previsão"]
        metrica(br(rlm_prev), "gasto anual previsto", "Regressão Linear Múltipla — modelo recomendado")
        prev["Rótulo"] = prev["Modelo"].map(NOME_CURTO)
        fig = px.bar(prev, x="Previsão", y="Rótulo", orientation="h", color="Modelo",
                     color_discrete_map=CORES_MODELOS, text_auto=".2f")
        fig.add_vline(y_train.mean(), line_dash="dot", line_color=C["ink"], annotation_text="média do treino")
        fig.update_layout(showlegend=False, yaxis_title=None)
        grafico(fig, 340)
    fora = [c for c in COLUNAS_FEATURES if not (X_train[c].min() <= valores[c] <= X_train[c].max())]
    if fora:
        st.warning(f"Valores fora da faixa do treino em: {', '.join(fora)} — extrapolação.")
    leitura("Previsões ilustrativas para fins acadêmicos; não representam aprovação para uso em produção.")


PAGINAS = {
    "1 · Capa": slide_01_capa,
    "2 · Pergunta do experimento": slide_02_pergunta,
    "3 · Base e seleção de colunas": slide_03_base,
    "4 · Preparação e protocolo": slide_04_protocolo,
    "5 · EDA — distribuição do gasto": slide_05_distribuicao_alvo,
    "6 · EDA — escalas das features": slide_06_features,
    "7 · EDA — correlações": slide_07_correlacoes,
    "8 · EDA — outliers": slide_08_outliers,
    "9 · Modelos comparados": slide_09_modelos,
    "10 · Validação cruzada": slide_10_validacao,
    "11 · Teste reservado": slide_11_teste,
    "12 · Previsões": slide_12_previsoes,
    "13 · Diagnóstico dos resíduos": slide_13_diagnostico,
    "14 · Interpretação": slide_14_interpretacao,
    "15 · Conclusão": slide_15_conclusao,
    "Extra · Simulador de previsão": extra_simulador,
}
ROTULOS = list(PAGINAS)
TOTAL_SLIDES = 15


def mover(delta: int) -> None:
    indice = ROTULOS.index(st.session_state.pagina)
    st.session_state.pagina = ROTULOS[min(max(indice + delta, 0), len(ROTULOS) - 1)]


# --------------------------------------------------------------------------- #
# Sidebar e navegação
# --------------------------------------------------------------------------- #
st.sidebar.title("🔮 Oráculo Preditivo")
st.sidebar.caption("Ecommerce Customers · Grupo 01")
st.sidebar.radio("Slides da apresentação", ROTULOS, key="pagina")
st.sidebar.divider()
st.sidebar.markdown(
    f"""
**Protocolo**
- Target: `{VARIAVEL_ALVO}`
- Split: {int((1 - TEST_SIZE) * 100)}/{int(TEST_SIZE * 100)} · `random_state={RANDOM_STATE}`
- Treino: **{len(X_train)}** · Teste: **{len(X_test)}**
- CV: K-Fold (K={N_FOLDS}) só no treino
"""
)
st.sidebar.caption("Integrantes: Apolo Bastos, Nicolas Gabriel, Caio Simonassi, Gabriel Nito, Jônatas")

PAGINAS[st.session_state.pagina]()

# Rodapé com navegação sequencial, como na apresentação
indice_atual = ROTULOS.index(st.session_state.pagina)
st.write("")
n1, n2, n3 = st.columns([1, 4, 1])
n1.button("← Anterior", on_click=mover, args=(-1,), disabled=indice_atual == 0, width="stretch")
posicao = f"{indice_atual + 1} / {TOTAL_SLIDES}" if indice_atual < TOTAL_SLIDES else "extra"
n2.markdown(f'<div class="k-footer">Desafio do Oráculo Preditivo · Ecommerce Customers · {posicao}</div>',
            unsafe_allow_html=True)
n3.button("Próximo →", on_click=mover, args=(1,), disabled=indice_atual == len(ROTULOS) - 1, width="stretch")
