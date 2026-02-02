export interface Agendamento {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  dataAgendamento: string;
  senha: number;
  horario: string;
  compareceu?: boolean;
}

export interface DiaAgendamento {
  data: string;
  vagasDisponiveis: number;
  agendamentos: Agendamento[];
}

export interface CalendarioState {
  mesAtual: Date;
  diasDisponiveis: string[];
  agendamentosPorDia: Record<string, number>;
}

export interface LocalStorageData {
  agendamentos: Agendamento[];
  senhaAtual: number;
  configuracoes: {
    limiteVagasPorDia: number;
    senhaMaxima: number;
    horariosAtendimento: string[];
  };
}