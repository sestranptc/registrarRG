export const CONFIG = {
  LIMITE_VAGAS_POR_DIA: 60,
  SENHA_MINIMA: 1,
  SENHA_MAXIMA: 100,
  DIAS_ANTECEDENCIA_MINIMA: 1,
  DIAS_ANTECEDENCIA_MAXIMA: 30,
  HORARIOS_ATENDIMENTO: [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30'
  ],
  INFORMACOES_PREFEITURA: {
    nome: 'Prefeitura Municipal de Patrocínio-MG',
    endereco: 'Praça Barão do Patrocínio, 100 - Centro, Patrocínio - MG, 38740-000',
    telefone: '(34) 3831-8600',
    horarioFuncionamento: 'Segunda a Sexta, 08:00 às 17:00'
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
  }
} as const;