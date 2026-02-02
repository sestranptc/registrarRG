import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Carrega variáveis de ambiente do arquivo .env na raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT || 3001;

// Função getTransport copiada e adaptada do projeto Sestran
const getTransport = async () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log('Configurando transporte de email...');
  console.log('Host:', host);
  console.log('Port:', port);
  console.log('User:', user);
  console.log('Pass configurado:', pass ? 'SIM (****)' : 'NÃO (Vazio!)');

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true para 465, false para outras portas
      auth: { user, pass },
    });
  }

  console.log('AVISO: Credenciais de email incompletas. Usando conta de teste Ethereal.');
  const test = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: test.user, pass: test.pass },
  });
};

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  console.log('Recebendo solicitação de envio para:', to);

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando (to, subject, html)' });
  }

  try {
    const transporter = await getTransport();
    
    const from = process.env.SMTP_FROM || 'SESTRAN <no-reply@sestran.gov.br>';
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log('Email enviado com sucesso: %s', info.messageId);
    
    // Se for Ethereal, mostra o link de preview no console
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log('Preview e-mail (Teste):', preview);
    }

    res.status(200).json({ success: true, messageId: info.messageId, preview });
  } catch (error: any) {
    console.error('Erro CRÍTICO ao enviar email:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao enviar email',
      details: error
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de email rodando na porta ${PORT}`);
  console.log(`Verificando .env...`);
  if (!process.env.SMTP_PASS) {
    console.error('⚠️ ATENÇÃO: A variável SMTP_PASS está vazia no arquivo .env! O envio de e-mail via Gmail IRÁ FALHAR.');
    console.error('⚠️ Por favor, edite o arquivo .env e adicione a Senha de App do Gmail.');
  } else {
    console.log('✅ SMTP_PASS encontrada.');
  }
});
