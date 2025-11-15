# 🌐 IncluiVagas Web  
### Interface para Gestão de Vagas, Candidatos e Empresas  
**“Inclusão inteligente, simples e acessível.”**

---

## 📋 Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Pasta do Projeto](#pasta-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Arquitetura do Front](#arquitetura-do-front)
- [Ambiente (.env)](#ambiente)

---

## 📌 Sobre o Projeto

O **IncluiVagas Web** é o front-end oficial da plataforma IncluiVagas.

Ele foi criado para oferecer uma interface:

- moderna  
- responsiva  
- intuitiva  
- acessível  
- eficiente para navegação de empresas e candidatos PCD  

Todo o fluxo está alinhado com boas práticas de UX e totalmente integrado ao backend IncluiVagas API.

---

## 🛠 Tecnologias

- **React + TypeScript**
- **Vite**
- **TailwindCSS**
- **React Router DOM**
- **Fetch API**
- **Componentização inteligente**

---

## ⚙ Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar o projeto
```bash
npm run dev
```

A aplicação abre em:  
`http://localhost:5173/`

---

## 📁 Estrutura do Projeto

```
frontend/
 ├── src/
 │    ├── pages/
 │    │     ├── home/
 │    │     ├── admin/
 │    │     ├── candidato/
 │    │     ├── empresa/
 │    │
 │    ├── components/
 │    ├── lib/api.ts
 │    ├── assets/
 │    ├── App.tsx
 │    ├── main.tsx
 │
 ├── index.html
 ├── tailwind.config.js
 ├── package.json
 ├── README.md
```

---

## ⭐ Funcionalidades

### **🔐 Autenticação**
- Login único para Empresa, Candidato e Admin

---

### **👤 Candidato**
- Painel geral com vagas compatíveis  
- Subtipos configurados  
- Barreiras selecionadas  
- Candidaturas realizadas  
- Perfil completo  

---

### **🏢 Empresa**
- Dashboard  
- Minhas vagas  
- Criar vaga  
- Candidatos que deram match  
- Acompanhamento de candidaturas  

---

### **🛠 Admin**
- CRUD completo:
  - Tipos
  - Subtipos
  - Barreiras
  - Acessibilidades
- Painel de visão geral

---

## 🧭 Arquitetura do Front

Componentização por responsabilidade:

- `components/empresa/*`
- `components/candidato/*`
- `pages/empresa/*`
- `pages/candidato/*`
- `pages/admin/*`
- `lib/api.ts` centraliza chamadas

---

## 🔧 Ambiente (.env)

Criar arquivo:

```
VITE_API_URL=http://localhost:3000
```

---

# 🎯 Conclusão

O front-end IncluiVagas Web entrega uma UI limpa, moderna, acessível e alinhada ao propósito do projeto: **facilitar a inclusão real de pessoas com deficiência no mercado de trabalho**.

---

