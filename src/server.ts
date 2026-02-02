import express, { Request, Response } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { AppDataSource } from './data-source';
import { usuarios } from './entities/User';

const app = express();
const port = process.env.SERVER_PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Inicializar conexão com banco
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection error:', err);
    console.log('Iniciando servidor mesmo sem banco de dados (Modo Offline)...');
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();

// Rota para enviar e-mail
app.post('/api/send-email', async (req: Request, res: Response) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando (to, subject, html)' });
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    console.log('Email enviado: %s', info.messageId);
    return res.status(200).json({ message: 'Email enviado com sucesso', messageId: info.messageId });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({ error: 'Falha ao enviar email', details: error });
  }
});

// Rota POST para criar usuário
app.post('/usuarios', async (req: Request, res: Response) => {
  try {
    const { nome, email, cpf, dataNascimento, telefone } = req.body;

    // Validação básica
    if (!nome || !email || !cpf) {
      return res.status(400).json({
        error: 'Nome, email e CPF são obrigatórios'
      });
    }

    // Criar usuário
    const userRepository = AppDataSource.getRepository(usuarios);
    const novoUsuario = userRepository.create({ 
      nome, 
      email, 
      cpf, 
      dataNascimento, 
      telefone 
    });
    
    // Salvar no banco
    const savedUser = await userRepository.save(novoUsuario);
    
    // Responder com o usuário criado
    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: savedUser
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: error
    });
  }
});