# Agendamento RG - Prefeitura de Patrocínio/MG

Sistema de agendamento online para emissão de RG, desenvolvido para a Secretaria Municipal de Segurança Pública, Trânsito e Transportes (SESTRAN).

## Funcionalidades

- **Calendário Interativo**: Visualização de vagas disponíveis e agendamento por data.
- **Validação de CPF**: Restrição de múltiplos agendamentos por pessoa.
- **Comprovante em PDF**: Geração automática de comprovante com senha e instruções.
- **Notificações por E-mail**:
  - **Produção (GitHub Pages)**: Envio via EmailJS (Client-side).
  - **Desenvolvimento (Local)**: Envio via Nodemailer (Servidor Local).
- **Design Responsivo**: Interface moderna e adaptável a dispositivos móveis.

## Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- NPM

### Instalação
1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```

### Desenvolvimento Local
Para rodar o frontend e o backend de email simultaneamente:

1. Inicie o servidor de email (necessário para testar envio localmente):
   ```bash
   npm run server
   ```
   *Nota: Configure o arquivo `.env` com suas credenciais SMTP (Gmail App Password) para envio real, ou use o Ethereal (padrão) para testes.*

2. Em outro terminal, inicie o frontend:
   ```bash
   npm run dev
   ```

### Build e Deploy
O projeto está configurado para deploy automático no GitHub Pages via GitHub Actions.

Para gerar o build manualmente:
```bash
npm run build
```

## Configuração de Email

### Produção (EmailJS)
As configurações do EmailJS estão definidas em `src/config/config.ts`. Não é necessário backend para envio em produção.

### Desenvolvimento (Nodemailer)
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
```

## Tecnologias
- React + Vite
- TypeScript
- Tailwind CSS
- GSAP (Animações)
- Zustand (Gerenciamento de Estado)
- EmailJS / Nodemailer

## Licença
Este projeto é de uso exclusivo da Prefeitura Municipal de Patrocínio-MG.
