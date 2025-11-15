# 🚀 IncluiVagas API  
### Sistema de Gestão de Vagas Inclusivas e Matching Inteligente entre Empresas e Candidatos PCD  
**“Tecnologia a serviço da inclusão profissional.”**

---

## 📋 Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pasta do Projeto](#pasta-do-projeto)
- [Rotas Principais](#rotas-principais)
- [Processo de Instalação](#processo-de-instalação)
- [Banco de Dados](#banco-de-dados)
- [Seed](#seed)
- [Scripts](#scripts)
- [Soft Delete](#soft-delete)
- [Logs](#logs)

---

## 📌 Sobre o Projeto

**IncluiVagas API** é uma API RESTful desenvolvida para gerenciar:
- Candidatos e seus subtipos
- Barreiras e acessibilidades
- Empresas e vagas
- Matching inteligente entre candidato e vaga
- Candidaturas e filtros avançados de inclusão

O objetivo é oferecer uma base sólida, escalável e auditável para um portal de inclusão profissional focado em PCD.

---

## 🛠 Tecnologias

- **Node.js**
- **TypeScript**
- **Express**
- **Prisma ORM**
- **PostgreSQL**
- **CORS**
- **TSX**
- **Dotenv**
- **Crypto (hash de senha)**
- **Arquitetura em camadas (Controller, Service, Repository)**

---

## 🏗 Arquitetura

```
┌──────────────────────┐
│   SERVER / ROUTES    │  → Entrada de requisições HTTP
├──────────────────────┤
│     CONTROLLERS      │  → Validação e orquestração
├──────────────────────┤
│      SERVICES        │  → Regras de negócio
├──────────────────────┤
│     REPOSITORIES     │  → Prisma / Acesso ao banco
├──────────────────────┤
│    PostgreSQL (DB)   │
└──────────────────────┘
```

---

## 📁 Pasta do Projeto

```
backend/
 ├── prisma/
 │    ├── schema.prisma
 │    └── seed.ts
 │
 ├── src/
 │    ├── controllers/
 │    ├── services/
 │    ├── repositories/
 │    ├── routes/
 │    ├── match/
 │    ├── auth/
 │    ├── server.ts
 │
 ├── package.json
 ├── tsconfig.json
 ├── .env
 └── README.md
```

---

## 🔗 Rotas Principais

### **Autenticação**
`POST /auth/login`  
Login unificado p/ candidatos, empresas e admin.

---

### **Candidatos**
- `POST /candidatos`
- `GET /candidatos`
- `GET /candidatos/:id`
- `DELETE /candidatos/:id` (soft delete)

**Vinculações:**
- `POST /candidato/subtipos`
- `POST /candidato/barreiras`

**Compatibilidade:**
- `GET /candidatos/:id/vagas-compativeis`
- `GET /candidatos/:id/candidaturas`

---

### **Empresas**
- `POST /empresas`
- `GET /empresas/:id`
- `GET /vagas/empresa/:id`

---

### **Vagas**
- `POST /vagas`
- `GET /vagas`
- `GET /vagas/:id`
- `DELETE /vagas/:id`

**Vinculações:**
- Subtipos
- Acessibilidades

**Candidaturas:**
- `POST /vagas/candidatar`

---

### **Tipos / Subtipos**
CRUD completo.

---

### **Barreiras / Acessibilidades**
CRUD + vínculo via tabelas intermediárias.

---

## ⚙ Processo de Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Criar o banco via Prisma
```bash
npx prisma migrate dev --name init
```

### 3. Gerar client Prisma
```bash
npx prisma generate
```

### 4. Rodar o seed (opcional)
```bash
npm run seed
```

### 5. Iniciar o servidor
```bash
npm run dev
```

API disponível normalmente na porta configurada no `.env`.

---

## 🗄 Banco de Dados

O schema inclui tabelas para:

- `candidatos`
- `empresas`
- `vagas`
- `subtipos`
- `barreiras`
- `acessibilidades`
- tabelas pivot (N:N)
- `vaga_candidatos`
- `match` automático
- `autenticação`

---

## 🌱 Seed

O arquivo `prisma/seed.ts` popula:

- Tipos de deficiência
- Subtipos
- Barreiras
- Acessibilidades

---

## 📦 Scripts

```bash
npm run dev    # Desenvolvimento
npm run build  # Transpila o TS
npm start      # Produção
npm run seed   # Popula tabelas
```

---

## 🛡 Soft Delete

As seguintes entidades utilizam soft delete:

- Candidatos
- Empresas
- Vagas

Sempre marcando `fg_ativo = false` em vez de excluir.

---

## 📝 Logs

Logs padrões de servidor e debug em cada camada:

- `[CONTROLLER] START/END`
- `[SERVICE] START/END`
- `[REPOSITORY] START/END`

---

# 🎯 Conclusão

A API IncluiVagas entrega um backend limpo, tipado, modular e escalável para aplicações inclusivas, com forte foco em acessibilidade, classificação correta de PCD e matching inteligente baseado em dados.

---

