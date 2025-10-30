# 🚀 Async Report Generator

Um sistema completo de geração de relatórios assíncronos com arquitetura microservices, desenvolvido com a stack moderna: Node.js, React, MongoDB, Redis, RabbitMQ e Docker.

## 📋 Sobre o Projeto

O Async Report Generator permite que usuários solicitem relatórios complexos que são processados em background, proporcionando uma experiência não-bloqueante e eficiente. O sistema utiliza filas de mensagens para orquestrar o processamento e cache para otimizar o desempenho.

## ✨ Funcionalidades

✅ Solicitação assíncrona de relatórios

✅ Processamento em background com workers

✅ Cache inteligente com Redis

✅ Filas de mensagens com RabbitMQ

✅ Dashboard em tempo real

✅ Interface moderna e responsiva

## 🏗️ Arquitetura do Sistema

<img width="744" height="566" alt="image" src="https://github.com/user-attachments/assets/01694c20-3c7f-478c-aec5-320e5b97ae0b" />



## 🛠️ Tecnologias Utilizadas

### Backend

Node.js - Runtime JavaScript

Express - Framework web

MongoDB - Banco de dados principal

Mongoose - ODM para MongoDB

Redis - Cache e sessões

RabbitMQ - Message broker

JWT - Autenticação


### Frontend


React 18 - Biblioteca UI

Vite - Build tool

Tailwind CSS - Framework CSS

React Query - Gerenciamento de estado

Axios - Cliente HTTP


### Infraestrutura


Docker - Containerização

Docker Compose - Orquestração

Alpine Linux - Imagens otimizadas

✅ Containerização com Docker

✅ API RESTful completa

## 🚀 Como Executar

### Pré-requisitos

Docker

Docker Compose

## Execução Rápida

### Clone o repositório:

git clone https://github.com/seu-usuario/async-report-generator.git

cd async-report-generator

### Execute o sistema:

docker-compose up -d --build

### Acesse as aplicações:

Frontend: http://localhost: {que vc definiu - ^_^}

API: http://localhost: {que vc definiu - ^_^}

RabbitMQ Management: http://localhost: {que vc definiu - ^_^}

MongoDB: localhost: {que vc definiu - ^_^}

Redis: localhost: {que vc definiu - ^_^}

## 📡 Endpoints da API

Relatórios
POST /api/reports - Solicitar novo relatório

GET /api/reports - Listar relatórios

GET /api/reports/:id - Buscar relatório específico

DELETE /api/reports/:id - Deletar relatório

## 🎯 Como Usar

Acesse o frontend em http://localhost: {que vc definiu - ^_^}

Selecione o tipo de relatório desejado

Configure os parâmetros (período, filtros)

Clique em "Gerar Relatório"

Acompanhe o processamento em tempo real

Visualize o relatório quando estiver pronto

GET /api/reports/stats/summary - Estatísticas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

@Tiagoribeirorp
