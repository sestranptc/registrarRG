import { Agendamento } from '../types';
import { CONFIG } from '../config/config';
import emailjs from '@emailjs/browser';

export const enviarEmailConfirmacao = async (agendamento: Agendamento, dataFormatada: string, validationLink?: string): Promise<boolean> => {
  try {
    const isProduction = import.meta.env.PROD;

    if (isProduction) {
      // Modo Produção: Usa EmailJS (Client-side)
      console.log('Enviando email via EmailJS (Produção)...');
      
      const templateParams = {
        to_email: agendamento.email,
        to_name: agendamento.nome,
        senha: agendamento.senha.toString().padStart(3, '0'),
        data: dataFormatada,
        horario: agendamento.horario,
        cpf: agendamento.cpf,
        telefone: agendamento.telefone,
        local: CONFIG.INFORMACOES_PREFEITURA.endereco,
        link_validacao: validationLink || ''
      };

      const response = await emailjs.send(
        CONFIG.EMAILJS.SERVICE_ID.trim(),
        CONFIG.EMAILJS.TEMPLATE_ID.trim(),
        templateParams,
        CONFIG.EMAILJS.PUBLIC_KEY.trim()
      );

      if (response.status === 200) {
        console.log('Email enviado com sucesso via EmailJS!');
        return true;
      } else {
        throw new Error(`Erro EmailJS: ${response.text}`);
      }
    } else {
      // Modo Desenvolvimento: Usa Nodemailer (Local Server)
      console.log('Enviando email via Nodemailer (Localhost)...');
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #16a34a; margin: 0;">Agendamento Confirmado!</h1>
            <p style="color: #666;">Prefeitura Municipal de Patrocínio-MG</p>
          </div>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <p style="color: #16a34a; font-weight: bold; margin: 0 0 10px 0;">Sua senha é</p>
            <div style="font-size: 48px; font-weight: bold; color: #16a34a; margin: 0;">
              ${agendamento.senha.toString().padStart(3, '0')}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <h3 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px;">Dados Pessoais</h3>
              <p><strong>Nome:</strong> ${agendamento.nome}</p>
              <p><strong>CPF:</strong> ${agendamento.cpf}</p>
              <p><strong>Telefone:</strong> ${agendamento.telefone}</p>
            </div>
            <div>
              <h3 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px;">Agendamento</h3>
              <p><strong>Data:</strong> ${dataFormatada}</p>
              <p><strong>Horário:</strong> ${agendamento.horario}</p>
              <p><strong>Local:</strong> ${CONFIG.INFORMACOES_PREFEITURA.endereco}</p>
            </div>
          </div>

          ${validationLink ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${validationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Validar Agendamento
            </a>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              Clique no botão acima para confirmar a autenticidade deste documento.
            </p>
          </div>
          ` : ''}

          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin-top: 20px;">
            <h3 style="color: #1e40af; margin-top: 0;">Documentos Necessários:</h3>
            <ul style="color: #1e3a8a; padding-left: 20px;">
              <li>Documento de identidade original</li>
              <li>Certidão de nascimento ou casamento Original</li>
              <li>Comprovante de residência</li>
              <li>CPF</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">
            <p>Este é um e-mail automático, por favor não responda.</p>
            <p>${CONFIG.INFORMACOES_PREFEITURA.telefone}</p>
          </div>
        </div>
      `;

      const response = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: agendamento.email,
          subject: '✅ Agendamento Confirmado - RG Patrocínio/MG',
          html: htmlContent
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao enviar email pelo servidor');
      }

      return true;
    }
  } catch (error: any) {
    console.error('Erro detalhado ao enviar email:', error);
    
    // Tratamento específico para erros do EmailJS
    if (error && typeof error === 'object' && 'text' in error) {
      throw new Error(`Erro EmailJS: ${error.text}`);
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(String(error) || 'Erro desconhecido ao enviar email');
  }
};
