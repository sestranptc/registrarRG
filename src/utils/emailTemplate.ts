import { Agendamento } from '../types/agendamento';
import { CONFIG } from '../config/config';
import { formatarDataExtenso } from './dateUtils';

export const criarEmailAgendamento = (agendamento: Agendamento): string => {
  const assunto = `Confirmação de Agendamento RG - Patrocínio-MG`;
  const corpo = `
Olá ${agendamento.nome},

Seu agendamento foi confirmado!

📅 Data: ${formatarDataExtenso(agendamento.dataAgendamento)}
🕐 Horário: ${agendamento.horario}
🎫 Senha: ${agendamento.senha}

📍 Local: ${CONFIG.INFORMACOES_PREFEITURA.nome}
${CONFIG.INFORMACOES_PREFEITURA.endereco}

📋 Documentos necessários:
- Documento de identidade original
- Certidão de nascimento ou casamento
- Comprovante de residência
- CPF

⏰ Por favor, chegar 15 minutos antes do horário agendado.

Horário de funcionamento: ${CONFIG.INFORMACOES_PREFEITURA.horarioFuncionamento}
Telefone: ${CONFIG.INFORMACOES_PREFEITURA.telefone}

Atenciosamente,
${CONFIG.INFORMACOES_PREFEITURA.nome}
  `;
  
  return `mailto:${agendamento.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
};

export const enviarEmailConfirmacao = (agendamento: Agendamento): void => {
  const mailtoLink = criarEmailAgendamento(agendamento);
  window.open(mailtoLink, '_blank');
};