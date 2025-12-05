# Sistema de Agendamento de RG - Prefeitura de Patrocínio-MG

Sistema web para agendamento de emissão de RG com controle de vagas por dia e geração automática de senhas.

## 🚀 Funcionalidades

- **Calendário Interativo**: Visualização de dias disponíveis com limite de 60 vagas por dia
- **Sistema de Senhas**: Geração automática de senhas de 1 a 100
- **Validação de Dados**: Validação de CPF, email e campos obrigatórios
- **Envio de Email**: Template de confirmação com todos os detalhes do agendamento
- **Animações GSAP**: Transições suaves e efeitos visuais
- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **Armazenamento Local**: Persistência de dados no navegador via LocalStorage

## 📋 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilização**: TailwindCSS 3
- **Animações**: GSAP 3
- **Roteamento**: React Router DOM
- **Build**: Vite

## 🎯 Fluxo de Uso

1. **Página Inicial**: Usuário seleciona data disponível no calendário
2. **Confirmação**: Preenche formulário com dados pessoais
3. **Sucesso**: Recebe senha e confirmação do agendamento
4. **Email**: Pode enviar detalhes por email

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Calendario/    # Componentes do calendário
│   ├── Formulario/    # Componentes do formulário
│   ├── Animacoes/     # Animações GSAP
│   └── Layout/        # Header, Footer, Container
├── pages/              # Páginas principais
│   ├── Home.tsx       # Página inicial
│   ├── Confirmacao.tsx # Página de confirmação
│   └── Sucesso.tsx    # Página de sucesso
├── hooks/              # Custom hooks
│   ├── useAgendamentos.ts
│   └── useCalendario.ts
├── utils/               # Utilitários
│   ├── validation.ts   # Validações
│   ├── dateUtils.ts   # Utilitários de data
│   └── emailTemplate.ts # Template de email
├── types/              # Tipos TypeScript
│   └── agendamento.ts
└── config/             # Configurações
    └── config.ts
```

## ⚙️ Configurações

O sistema utiliza as seguintes configurações padrão:

- **Limite de vagas por dia**: 60
- **Senhas**: 1 a 100 (cíclico)
- **Antecedência mínima**: 1 dia
- **Antecedência máxima**: 30 dias
- **Horários**: 08:00 às 16:30 (com intervalo ao meio-dia)

## 🎨 Design

- **Cores primárias**: Verde municipal (#2E7D32)
- **Cores secundárias**: Azul claro (#E3F2FD)
- **Tipografia**: Fonte sans-serif moderna
- **Breakpoints**: Desktop (1200px+), Tablet (768-1199px), Mobile (<768px)

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## 🔒 Segurança

- Validação de dados no frontend
- Sanitização de inputs
- Armazenamento seguro via LocalStorage
- Sem exposição de dados sensíveis

## 📞 Suporte

Para dúvidas ou suporte técnico:
- Telefone: (34) 3831-8600
- Horário: Segunda a Sexta, 08:00 às 17:00
- Endereço: Praça Barão do Patrocínio, 100 - Centro, Patrocínio - MG

## 📝 Licença

Este projeto é de uso exclusivo da Prefeitura Municipal de Patrocínio-MG.