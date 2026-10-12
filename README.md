# Desafio do Oráculo Preditivo — Ecommerce Customers

## Contexto acadêmico

Projeto do Grupo 01 para a disciplina de Aprendizagem de Máquina, desenvolvido em Python e Jupyter Notebook.

## Integrantes

- Apolo
- Nicolas
- Caio
- Gabriel
- Jônatas

## Dataset utilizado

O projeto utiliza o dataset [Ecommerce Customer Device Usage](https://www.kaggle.com/datasets/iyadavvaibhav/ecommerce-customer-device-usage), disponibilizado pelo Kaggle.

O arquivo real disponibilizado no pacote do dataset chama-se `Ecommerce Customers` e é um arquivo CSV sem extensão. Ele está localizado em `data/Ecommerce Customers`.

## Objetivo geral

Estudar um problema de regressão relacionado ao comportamento de clientes de um e-commerce e, posteriormente, comparar diferentes abordagens de regressão para prever uma variável contínua.

## Estado atual do projeto

A Etapa 01 foi concluída no notebook sobre os 400 registros de treinamento: estatística descritiva, distribuição do target e das features, correlações de Pearson, heatmap, VIF, candidatos a outliers pela regra de 1,5 × IQR e decisão de manutenção foram documentados. O dataset original possui 500 registros e 8 colunas, sem valores ausentes e sem linhas completamente duplicadas.

A Etapa 02 foi implementada no notebook. O target é `Yearly Amount Spent`; as features são `Avg. Session Length`, `Time on App`, `Time on Website` e `Length of Membership`. `Email`, `Address` e `Avatar` foram excluídas com justificativa. A divisão única usa 80% para treino, 20% para teste e `random_state=42`, com `StandardScaler` ajustado somente em `X_train`. Os candidatos a outliers foram preservados: a união dos índices contém 18 de 400 linhas de treino, sem evidência concreta de erro de registro.

A Etapa 03 foi implementada no notebook. Foram construídos os regressores supervisionados com pipelines scikit-learn: `DummyRegressor(strategy='mean')` como baseline, `LinearRegression`, `RandomForestRegressor(n_estimators=100, random_state=42)` e `SVR` avaliando kernels Linear e RBF. Os coeficientes da Regressão Linear Múltipla foram extraídos e interpretados no contexto de negócio, destacando `Length of Membership` como a variável de maior peso.

A Etapa 04 foi implementada no notebook. A validação cruzada com K-Fold ($K=5$) foi executada exclusivamente sobre as 400 amostras de treino via `Pipeline` para evitar vazamento de dados (*data leakage*). O diagnóstico de viés versus variância indicou ausência de overfitting nos modelos lineares ($R^2 \approx 0,985$) e sobreajuste moderado no Random Forest e no SVR RBF ao tentar mapear um fenômeno estritamente linear.

A Etapa 05 foi concluída no notebook sobre as 100 observações de teste. Foram calculadas as métricas oficiais ($R^2$, MAE, MAPE % e RMSE) e medidos os tempos de treinamento e inferência. Foram gerados quatro painéis visuais estilizados: valores reais versus preditos com reta de 45°, dispersão de resíduos, histograma normal dos erros e importância relativa das variáveis.

A Etapa 06 foi documentada no notebook. As respostas conceituais aos quatro eixos do roteiro de arguição técnica foram registradas com fundamentação teórica (Gauss-Markov, sensibilidade a escala no SVR, robustez a outliers, viés-variância, interpretação de MAE versus RMSE, uso gerencial do MAPE e recomendação da Regressão Linear Múltipla para produção baseada na Navalha de Ockham).

Ainda não foram atualizados os slides da apresentação no diretório `presentation/` (Etapa 07) nem gerado o relatório final consolidado em PDF (Etapa 08).

## Execução mínima

Com Python instalado, execute:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd notebooks
jupyter notebook ecommerce_customers.ipynb
```

O notebook deve ser executado com a pasta `notebooks/` como diretório de trabalho, pois utiliza o caminho relativo `../data/Ecommerce Customers` para carregar o dataset. Para executar integralmente sem abrir a interface, use `jupyter nbconvert --to notebook --execute --inplace ecommerce_customers.ipynb` dentro de `notebooks/`.

As dependências Python usam faixas de compatibilidade registradas em `requirements.txt`; elas foram verificadas no ambiente local com Python 3.14.7.
