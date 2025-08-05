# IFSports Frontend

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</div>

<div align="center">
  <h3>Interface frontend moderna para o sistema IFSports</h3>
  <p>Uma aplicação web responsiva e intuitiva para gerenciamento de atividades esportivas educacionais</p>
</div>

---

## 📋 Sobre o Projeto

O **IFSports Frontend** é a interface de usuário do sistema IFSports, desenvolvido para proporcionar uma experiência moderna e responsiva no gerenciamento de atividades esportivas em instituições educacionais. O projeto utiliza as mais recentes tecnologias web para garantir performance, acessibilidade e uma excelente experiência do usuário.

## 🚀 Tecnologias Utilizadas

### Core
- **[Next.js](https://nextjs.org/)** - Framework React para produção
- **[React](https://reactjs.org/)** - Biblioteca para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática

### Estilização
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Shadcn/ui](https://ui.shadcn.com/)** - Componentes reutilizáveis e acessíveis
- **[PostCSS](https://postcss.org/)** - Processador CSS

### Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linter para qualidade de código
- **Node.js** - Ambiente de execução JavaScript

## 📁 Estrutura do Projeto

```
frontend-ifsports/
├── src/                    # Código fonte principal
├── public/                 # Arquivos estáticos
├── components.json         # Configuração do Shadcn/ui
├── next.config.ts         # Configuração do Next.js
├── tailwind.config.ts     # Configuração do Tailwind CSS
├── tsconfig.json          # Configuração do TypeScript
├── eslint.config.mjs      # Configuração do ESLint
├── postcss.config.mjs     # Configuração do PostCSS
└── package.json           # Dependências e scripts
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- **Node.js** (versão 18+ recomendada)
- **npm** ou **yarn**

### Passos para instalação

1. **Clone o repositório**
```bash
git clone https://github.com/ifsports/frontend-ifsports.git
cd frontend-ifsports
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Execute o projeto em modo de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse a aplicação**
```
http://localhost:3000
```

## 📜 Iniciar aplicação

```bash
npm run dev        # Inicia o servidor de desenvolvimento
```

## 🏗️ Build e Deploy

### Build de Produção
```bash
npm run build
npm run start
```

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_AUTH_KEY=
SUAP_CLIENT_ID=
SUAP_CLIENT_SECRET=

NEXTAUTH_URL=
NEXTAUTH_SECRET=

```

## 🎨 Componentes e Design System

O projeto utiliza o **Shadcn/ui** como base para o design system, garantindo:
- ✅ Componentes acessíveis (WCAG)
- ✅ Tema customizável
- ✅ Responsividade nativa
- ✅ Consistência visual

### Personalização de Tema
As configurações de tema podem ser encontradas em:
- `tailwind.config.ts` - Configurações do Tailwind
- `components.json` - Configurações do Shadcn/ui

## 📱 Funcionalidades

- 🏃‍♂️ **Gestão de campeonatos esportivos**
- 👥 **Sistema de Usuários**
- 📊 **Dashboard Administrativo**
- 📱 **Interface Responsiva**
- 🎯 **Experiência de Usuário Otimizada**

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork o projeto**
2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Commit suas mudanças**
   ```bash
   git commit -m 'feat: adiciona nova funcionalidade'
   ```
4. **Push para a branch**
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. **Abra um Pull Request**

### Padrões de Commit
Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes

## 👥 Equipe

Desenvolvido pela equipe **IFSports**

---

<div align="center">
  <strong>🏆 IFSports - Transformando a gestão esportiva educacional</strong>
</div>
