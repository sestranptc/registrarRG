import { useState, useEffect } from 'react';
import type { Agendamento, LocalStorageData } from '../types';
import { CONFIG } from '../config/config';

export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [senhaAtual, setSenhaAtual] = useState<number>(1);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    try {
      const dadosArmazenados = localStorage.getItem(CONFIG.STORAGE_KEYS.AGENDAMENTOS);
      const senhaArmazenada = localStorage.getItem(CONFIG.STORAGE_KEYS.SENHA_ATUAL);
      
      if (dadosArmazenados) {
        const dados: Agendamento[] = JSON.parse(dadosArmazenados);
        setAgendamentos(dados);
      }
      
      if (senhaArmazenada) {
        setSenhaAtual(parseInt(senhaArmazenada));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const salvarAgendamento = (agendamento: Agendamento) => {
    try {
      const novosAgendamentos = [...agendamentos, agendamento];
      setAgendamentos(novosAgendamentos);
      localStorage.setItem(CONFIG.STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(novosAgendamentos));
      
      const novaSenha = senhaAtual >= CONFIG.SENHA_MAXIMA ? 1 : senhaAtual + 1;
      setSenhaAtual(novaSenha);
      localStorage.setItem(CONFIG.STORAGE_KEYS.SENHA_ATUAL, novaSenha.toString());
      
      return agendamento;
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      throw error;
    }
  };

  const obterAgendamentosPorData = (data: string): Agendamento[] => {
    return agendamentos.filter(agendamento => agendamento.dataAgendamento === data);
  };

  const contarAgendamentosPorHorario = (data: string, horario: string): number => {
    return agendamentos.filter(a => a.dataAgendamento === data && a.horario === horario).length;
  };

  const verificarDisponibilidade = (data: string): boolean => {
    const agendamentosDoDia = obterAgendamentosPorData(data);
    return agendamentosDoDia.length < CONFIG.LIMITE_VAGAS_POR_DIA;
  };

  const verificarAgendamentoExistente = (cpf: string): boolean => {
    // Normaliza o CPF removendo caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Verifica se existe algum agendamento com este CPF
    // Nota: Em um cenário real, verificaríamos também se a data do agendamento é futura
    // Mas como não temos backend, vamos verificar todos os agendamentos armazenados
    return agendamentos.some(agendamento => {
      const agendamentoCpfLimpo = agendamento.cpf.replace(/\D/g, '');
      return agendamentoCpfLimpo === cpfLimpo;
    });
  };

  const obterVagasRestantes = (data: string): number => {
    const agendamentosDoDia = obterAgendamentosPorData(data);
    return CONFIG.LIMITE_VAGAS_POR_DIA - agendamentosDoDia.length;
  };

  const gerarProximaSenha = (): number => {
    return senhaAtual;
  };

  const toggleCompareceu = (id: string) => {
    const novosAgendamentos = agendamentos.map(ag => {
      if (ag.id === id) {
        return { ...ag, compareceu: !ag.compareceu };
      }
      return ag;
    });
    setAgendamentos(novosAgendamentos);
    localStorage.setItem(CONFIG.STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(novosAgendamentos));
  };

  return {
    agendamentos,
    senhaAtual,
    salvarAgendamento,
    obterAgendamentosPorData,
    contarAgendamentosPorHorario,
    verificarDisponibilidade,
    verificarAgendamentoExistente,
    obterVagasRestantes,
    gerarProximaSenha,
    toggleCompareceu
  };
};
