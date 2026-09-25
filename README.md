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

Esta versão está na fase de carregamento e inspeção inicial dos dados. O notebook apresenta as primeiras linhas, as dimensões, a estrutura, os tipos das colunas, os valores ausentes e os registros duplicados.

Ainda não foram implementados a Análise Exploratória de Dados completa, o pré-processamento, a divisão entre treino e teste ou qualquer modelo de Machine Learning.

## Execução mínima

Com Python instalado, execute:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd notebooks
jupyter notebook ecommerce_customers.ipynb
```

O notebook deve ser executado com a pasta `notebooks/` como diretório de trabalho, pois utiliza o caminho relativo `../data/Ecommerce Customers` para carregar o dataset.
