export const CONFIG = {
  // Configuração do EmailJS (Produção)
  // Última verificação de deploy: 03/02/2026
  LIMITE_VAGAS_POR_DIA: 16,
  SENHA_MINIMA: 1,
  SENHA_MAXIMA: 100,
  DIAS_ANTECEDENCIA_MINIMA: 0,
  DIAS_ANTECEDENCIA_MAXIMA: 60,
  HORARIOS_ATENDIMENTO: [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
    '15:30',  
  ],
  INFORMACOES_PREFEITURA: {
    nome: 'Prefeitura Municipal de Patrocínio-MG',
    endereco: 'Avenida Altino Guimarães, 455 - Bairro Santo Antônio, Patrocínio - MG, 38.740-210',
    telefone: '(34) 3839-1800',
    horarioFuncionamento: 'Segunda a Sábado, 08:00 às 15:30'
  },
  STORAGE_KEYS: {
    AGENDAMENTOS: 'agendamentos_rg_patrocinio',
    SENHA_ATUAL: 'senha_atual_rg',
    CONFIGURACOES: 'config_sistema_rg'
  },
  EMAILJS: {
    SERVICE_ID: 'service_dv3f7x5',
    TEMPLATE_ID: 'template_d2hrdce',
    PUBLIC_KEY: 'ZtzB38HrEaUBs7cCt'
  },
  FERIADOS: [
    '2025-01-01', // Confraternização Universal
    '2025-04-21', // Tiradentes
    '2025-05-01', // Dia do Trabalho
    '2025-09-07', // Independência do Brasil
    '2025-10-12', // Nossa Senhora Aparecida
    '2025-11-02', // Finados
    '2025-11-15', // Proclamação da República
    '2025-12-25', // Natal
    // Adicione outros feriados municipais ou estaduais aqui
  ]
} as const;