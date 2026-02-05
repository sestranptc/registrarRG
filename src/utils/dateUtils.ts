import { CONFIG } from '../config/config';

export const formatarData = (dataString: string): string => {
  const data = parseLocalDate(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const toLocalISOString = (data: Date): string => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

export const parseLocalDate = (dataString: string): Date => {
  if (!dataString) return new Date();
  const [ano, mes, dia] = dataString.split('-').map(Number);
  return new Date(ano, mes - 1, dia, 12, 0, 0);
};

export const formatarDataExtenso = (dataString: string): string => {
  const data = parseLocalDate(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export const obterDiasDisponiveis = (
  mesAtual: Date, 
  diasAntecedenciaMinima: number, 
  diasAntecedenciaMaxima: number,
  feriados: string[] = [...CONFIG.FERIADOS],
  horariosAtendimento?: string[]
): string[] => {
  // Se horários de atendimento forem passados e estiverem vazios, nenhum dia está disponível
  if (horariosAtendimento !== undefined && horariosAtendimento.length === 0) {
    return [];
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const dataInicial = new Date(hoje);
  dataInicial.setDate(hoje.getDate() + diasAntecedenciaMinima);
  
  const dataFinal = new Date(hoje);
  dataFinal.setDate(hoje.getDate() + diasAntecedenciaMaxima);
  
  const diasDisponiveis: string[] = [];
  let dataAtual = new Date(dataInicial);
  
  while (dataAtual <= dataFinal) {
    // Usar toLocalISOString para evitar problemas de fuso horário
    const dataString = toLocalISOString(dataAtual);
    
    // Regra: Dias úteis (Segunda a Sábado) - Domingo (0) bloqueado
    // E a data não pode estar na lista de feriados
    const diaSemana = dataAtual.getDay();
    if (diaSemana !== 0 && !feriados.includes(dataString)) {
      diasDisponiveis.push(dataString);
    }
    
    dataAtual.setDate(dataAtual.getDate() + 1);
  }
  
  return diasDisponiveis;
};

export const obterHorariosDisponiveis = (data: string, agendamentosExistentes: number, limiteVagas: number): string[] => {
  if (agendamentosExistentes >= limiteVagas) {
    return [];
  }
  
  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30'
  ];
  
  const vagasRestantes = limiteVagas - agendamentosExistentes;
  return horarios.slice(0, Math.min(vagasRestantes, horarios.length));
};