import { useState, useEffect } from 'react';
import { CONFIG } from '../config/config';
import { obterDiasDisponiveis } from '../utils/dateUtils';

export const useCalendario = () => {
  const [mesAtual, setMesAtual] = useState<Date>(new Date());
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    atualizarDiasDisponiveis();
  }, [mesAtual]);

  const atualizarDiasDisponiveis = () => {
    const dias = obterDiasDisponiveis(
      mesAtual,
      CONFIG.DIAS_ANTECEDENCIA_MINIMA,
      CONFIG.DIAS_ANTECEDENCIA_MAXIMA
    );
    setDiasDisponiveis(dias);
  };

  const mudarMes = (direcao: 'anterior' | 'proximo') => {
    const novoMes = new Date(mesAtual);
    if (direcao === 'anterior') {
      novoMes.setMonth(mesAtual.getMonth() - 1);
    } else {
      novoMes.setMonth(mesAtual.getMonth() + 1);
    }
    setMesAtual(novoMes);
  };

  const obterDiasDoMes = (): Date[] => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    
    const dias: Date[] = [];
    
    // Adicionar dias do mês anterior para preencher a semana
    const diaDaSemana = primeiroDia.getDay();
    for (let i = diaDaSemana; i > 0; i--) {
      const dia = new Date(primeiroDia);
      dia.setDate(dia.getDate() - i);
      dias.push(dia);
    }
    
    // Adicionar dias do mês atual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(ano, mes, dia));
    }
    
    // Adicionar dias do próximo mês para completar a grade
    const diasRestantes = 42 - dias.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      dias.push(new Date(ano, mes + 1, dia));
    }
    
    return dias;
  };

  const ehDiaDisponivel = (data: Date): boolean => {
    const dataString = data.toISOString().split('T')[0];
    return diasDisponiveis.includes(dataString);
  };

  const ehDiaPassado = (data: Date): boolean => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return data < hoje;
  };

  const ehFimDeSemana = (data: Date): boolean => {
    return data.getDay() === 0 || data.getDay() === 6;
  };

  return {
    mesAtual,
    diasDisponiveis,
    mudarMes,
    obterDiasDoMes,
    ehDiaDisponivel,
    ehDiaPassado,
    ehFimDeSemana
  };
};