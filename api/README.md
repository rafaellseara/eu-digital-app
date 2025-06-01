# Eu Digital App API

Este repositório contém a **API RESTful** do projeto “Eu Digital App”, responsável pela ingestão de pacotes SIP e pelo CRUD completo de diversos tipos de itens (fotos, textos, resultados académicos, resultados desportivos, ficheiros e eventos).

---

## 🚀 Project Overview

* **Objetivo**: Gerir o “eu digital” do utilizador, permitindo:

  * Ingestão de *Submission Information Packages* (SIP) via upload de ZIP.
  * Armazenamento de metadados em MongoDB e ficheiros binários no filesystem.
  * Endpoints CRUD para todos os tipos de item.
  * Documentação automática com Swagger UI.
  * Testes automatizados de integração (Jest + Supertest).
  * Paginação e filtragem integradas nos endpoints de listagem (através de `page`, `limit` e filtros de consulta).

---

## 📋 Prerequisites

* **Docker & Docker Compose** (para MongoDB e Mongo Express):
  * Docker v20+ e Docker Compose (ou `docker compose` CLI v2).
* **Node.js** v16+ e npm v8+.

---

## ⚙️ Setup

1. **Configurar o MongoDB via Docker** (na raiz do projeto):

   ```bash
   cd ../docker
   docker compose up -d
   ```

   * MongoDB ficará acessível em `localhost:27017`.
   * Mongo Express UI em `http://localhost:8081` (usuário/password conforme `docker-compose.yml`).

2. **Instalar dependências**:

   ```bash
   cd api
   npm install
   ```

---

## ▶️ Running the API

Na pasta `api/`:

```bash
npm start
```

* Inicia o serviço em `http://localhost:3000`.
* As rotas principais são prefixadas por `/api`.

---

## ✅ Running Tests

Testes de integração com Jest + Supertest + MongoDB in-memory:

```bash
npm test
```

* Cobre todos os endpoints CRUD e a ingestão de pacotes.

---

## 📖 API Documentation

A especificação OpenAPI (Swagger) está em `api/docs/openapi.yaml`. Para aceder ao UI:

```
http://localhost:3000/api/docs 
```

---

## 📂 Project Structure

```
eu-digital-app/
├── api/
│   ├── app.js             # Configura Express e rotas
│   ├── server.js          # Inicializa o listener
│   ├── routes/            # Routers CRUD (photos, texts, …)
│   ├── services/          # IngestService (unzip, valida, store)
│   ├── models/            # Schemas Mongoose
│   ├── schemas/           # JSON Schema para manifesto-SIP
│   ├── tests/             # Jest + Supertest suites
│   ├── tmp/               # Pasta temporária de unzip (limpa-se)
│   └── storage/           # Ficheiros copiados organizados por data
│
├── docker/
│   └── docker-compose.yml # MongoDB + Mongo Express
│
├── docs/                  # Documentação do domínio e modelagem
└── README.md              
```

---

## 🔧 Componentes Criados

1. **Ingest Service** (`services/ingestService.js`)

   * Recebe ZIP, descompacta, valida manifesto JSON, copia ficheiros e insere documentos no Mongo.
   * Limpeza automática de ZIP e pasta temporária.

2. **Data Models** (`models/*.js`)

   * Schemas Mongoose para cada tipo de item.
   * Índices otimizados (`createdAt`, `tags`, etc.).

3. **Routers CRUD** (`routes/*.js`)

   * Endpoints `GET|POST|PUT|DELETE` para todos os recursos.
   * Paginação, filtros por query params.

4. **Documentação** (`docs/openapi.yaml`)

   * Especificação completa OpenAPI 3.0.
   * Swagger UI integrado via `swagger-ui-express`.

5. **Testes Automatizados** (`tests/*.test.js`)

   * Suites Jest + Supertest cobrindo todos os endpoints.
   * MongoDB in-memory para isolamento total.

6. **Docker Setup** (`docker/docker-compose.yml`)

   * MongoDB 6.0 e Mongo Express para administração via UI.

---

## 🧐 Completeness & Next Steps

**Status atual**: A API fornece todas as funcionalidades centrais pedidas no enunciado:

* Ingestão de pacotes SIP.
* CRUD completo para fotos, textos, resultados académicos, resultados desportivos, ficheiros e eventos.
* Documentação e testes.

**Possíveis acréscimos futuros**:

* **Autenticação & Autorização** (ex: JWT, OAuth) para proteger endpoints.
* **Gestão de utilizadores** e roles (produtor, administrador, consumidor).
* **Paginação avançada** (metadata, total de páginas, links HATEOAS).
* **Versionamento de itens** ou *rollback* de metadados.
* **Monitorização** (logs estruturados, métricas, healthchecks).
* **Cache** e *rate limiting* para performance e segurança.

Em suma, a **base** da API está **completa** para o projecto, mas há múltiplas melhorias e features que podem ser implementadas.

