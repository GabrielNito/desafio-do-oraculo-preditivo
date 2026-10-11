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

A Etapa 02 foi implementada no notebook. O target é `Yearly Amount Spent`; as features são `Avg. Session Length`, `Time on App`, `Time on Website` e `Length of Membership`. `Email`, `Address` e `Avatar` foram excluídas com justificativa. A divisão única usa 80% para treino, 20% para teste e `random_state=42`, com `StandardScaler` ajustado somente em `X_train`.

Os candidatos a outliers foram preservados: a união dos índices contém 18 de 400 linhas de treino, sem evidência concreta de erro de registro. Ainda não foram treinados os três regressores, calculadas métricas, executada validação cruzada ou realizada análise de resíduos e overfitting.

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
