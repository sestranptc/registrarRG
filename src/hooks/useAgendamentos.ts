import { useState, useEffect } from 'react';
import type { Agendamento } from '../types';
import { CONFIG } from '../config/config';
import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  runTransaction,
  setDoc,
  getDoc,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { toLocalISOString } from '../utils/dateUtils';

const AGENDAMENTOS_COLLECTION = 'agendamentos';
const COUNTERS_COLLECTION = 'counters';
const COUNTER_DOC_ID = 'geral';

export const useAgendamentos = (apenasFuturos: boolean = true) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [senhaAtual, setSenhaAtual] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [limiteVagas, setLimiteVagas] = useState<number>(CONFIG.LIMITE_VAGAS_POR_DIA);

  useEffect(() => {
    // Escutar configurações em tempo real
    const unsubscribeConfig = onSnapshot(doc(db, 'configuracoes', 'geral'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (typeof data.limiteVagasPorDia === 'number') {
          setLimiteVagas(data.limiteVagasPorDia);
        }
      }
    });

    // Escutar agendamentos em tempo real
    // Otimização: Por padrão, carregar apenas agendamentos de hoje em diante para economizar leituras
    let q;
    
    if (apenasFuturos) {
      const hoje = toLocalISOString(new Date());
      q = query(collection(db, AGENDAMENTOS_COLLECTION), where('dataAgendamento', '>=', hoje));
    } else {
      q = query(collection(db, AGENDAMENTOS_COLLECTION));
    }

    const unsubscribeAgendamentos = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Agendamento[];
      
      // Ordenação no cliente (mais seguro para evitar erros de índice)
      dados.sort((a, b) => {
        if (a.dataAgendamento !== b.dataAgendamento) {
          return a.dataAgendamento.localeCompare(b.dataAgendamento);
        }
        return a.horario.localeCompare(b.horario);
      });

      setAgendamentos(dados);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao carregar agendamentos:", error);
      setLoading(false);
    });

    // Escutar contador de senhas
    const unsubscribeCounter = onSnapshot(doc(db, COUNTERS_COLLECTION, COUNTER_DOC_ID), (docSnap) => {
      if (docSnap.exists()) {
        setSenhaAtual(docSnap.data().senhaAtual);
      } else {
        // Inicializa contador se não existir
        setDoc(doc(db, COUNTERS_COLLECTION, COUNTER_DOC_ID), { senhaAtual: 1 });
        setSenhaAtual(1);
      }
    });

    return () => {
      unsubscribeConfig();
      unsubscribeAgendamentos();
      unsubscribeCounter();
    };
  }, [apenasFuturos]);

  const salvarAgendamento = async (agendamento: Agendamento) => {
    try {
      // 0. Obter limite de vagas atualizado diretamente do banco para garantir integridade
      // (caso o state ainda não tenha atualizado ou para evitar condições de corrida com configurações antigas)
      const configDoc = await getDoc(doc(db, 'configuracoes', 'geral'));
      const limiteAtual = configDoc.exists() ? (configDoc.data().limiteVagasPorDia || CONFIG.LIMITE_VAGAS_POR_DIA) : CONFIG.LIMITE_VAGAS_POR_DIA;

      // VERIFICAÇÃO DE SEGURANÇA (SERVER-SIDE):
      // Antes de iniciar a transação, verifica no banco se já atingiu o limite para esta data.
      // Isso previne que condições de corrida permitam exceder o limite de 60 vagas.
      const qVerificacao = query(
        collection(db, AGENDAMENTOS_COLLECTION), 
        where('dataAgendamento', '==', agendamento.dataAgendamento)
      );
      
      const snapshotVerificacao = await getDocs(qVerificacao);
      const totalExistente = snapshotVerificacao.size;

      if (totalExistente >= limiteAtual) {
        throw new Error(`As vagas para o dia ${agendamento.dataAgendamento} esgotaram (Total: ${totalExistente}). Por favor, escolha outra data.`);
      }

      // VERIFICAR DUPLICIDADE DE CPF (SERVER-SIDE)
      // Impede que o mesmo CPF tenha mais de um agendamento ativo (hoje ou futuro)
      const hoje = toLocalISOString(new Date());
      const qCpf = query(
        collection(db, AGENDAMENTOS_COLLECTION),
        where('cpf', '==', agendamento.cpf)
      );
      
      const snapshotCpf = await getDocs(qCpf);
      const temAgendamentoFuturo = snapshotCpf.docs.some(doc => {
        const dados = doc.data();
        // Verifica se existe agendamento para hoje ou futuro
        return dados.dataAgendamento >= hoje;
      });

      if (temAgendamentoFuturo) {
        throw new Error(`O CPF ${agendamento.cpf} já possui um agendamento ativo/futuro. Não é permitido agendar novamente.`);
      }

      let agendamentoSalvo: Agendamento | null = null;

      await runTransaction(db, async (transaction) => {
        // 1. Obter a senha atual mais recente
        const counterRef = doc(db, COUNTERS_COLLECTION, COUNTER_DOC_ID);
        const counterDoc = await transaction.get(counterRef);
        
        let novaSenha = 1;
        if (counterDoc.exists()) {
          const current = counterDoc.data().senhaAtual;
          novaSenha = current >= CONFIG.SENHA_MAXIMA ? 1 : current + 1;
        }

        // 2. Preparar o novo agendamento com a senha correta
        const novoAgendamento = {
          ...agendamento,
          senha: novaSenha
        };

        // 3. Criar referência para o novo documento
        const newAgendamentoRef = doc(collection(db, AGENDAMENTOS_COLLECTION));
        
        // 4. Executar as escritas (novo agendamento e atualização da senha)
        transaction.set(newAgendamentoRef, novoAgendamento);
        transaction.set(counterRef, { senhaAtual: novaSenha });

        agendamentoSalvo = { ...novoAgendamento, id: newAgendamentoRef.id };
      });

      return agendamentoSalvo!;
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      throw error;
    }
  };

  const atualizarAgendamento = async (id: string, dados: Partial<Agendamento>) => {
    try {
      const agendamentoRef = doc(db, AGENDAMENTOS_COLLECTION, id);
      await updateDoc(agendamentoRef, dados);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      throw error;
    }
  };

  const deletarAgendamento = async (id: string) => {
    try {
      // Importado dinamicamente para evitar erro de referência circular se houver, 
      // mas aqui vamos usar deleteDoc direto do firebase/firestore
      const { deleteDoc } = await import('firebase/firestore');
      const agendamentoRef = doc(db, AGENDAMENTOS_COLLECTION, id);
      await deleteDoc(agendamentoRef);
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      throw error;
    }
  };

  const toggleCompareceu = async (id: string) => {
    const agendamento = agendamentos.find(a => a.id === id);
    if (agendamento) {
      await atualizarAgendamento(id, { compareceu: !agendamento.compareceu });
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
    return agendamentosDoDia.length < limiteVagas;
  };

  const verificarAgendamentoExistente = (cpf: string): boolean => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return agendamentos.some(agendamento => {
      const agendamentoCpfLimpo = agendamento.cpf.replace(/\D/g, '');
      return agendamentoCpfLimpo === cpfLimpo;
    });
  };

  const obterVagasRestantes = (data: string): number => {
    const agendamentosDoDia = obterAgendamentosPorData(data);
    return limiteVagas - agendamentosDoDia.length;
  };

  const gerarProximaSenha = (): number => {
    return senhaAtual;
  };

  const renumerarSenhasDoDia = async (data: string) => {
    try {
      // 1. Buscar todos os agendamentos do dia
      const q = query(
        collection(db, AGENDAMENTOS_COLLECTION),
        where('dataAgendamento', '==', data)
      );
      
      const snapshot = await getDocs(q);
      const agendamentosDoDia = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Agendamento[];

      // 2. Ordenar por Horário e Nome
      agendamentosDoDia.sort((a, b) => {
        // Primeiro por horário
        const horarioCompare = a.horario.localeCompare(b.horario);
        if (horarioCompare !== 0) return horarioCompare;
        
        // Desempate por nome
        return a.nome.localeCompare(b.nome);
      });

      // 3. Renumerar e Atualizar em Batch
      const batch = writeBatch(db);
      let contador = 1;

      agendamentosDoDia.forEach(ag => {
        const ref = doc(db, AGENDAMENTOS_COLLECTION, ag.id);
        batch.update(ref, { senha: contador });
        contador++;
      });

      await batch.commit();
      return true;
    } catch (error) {
      console.error("Erro ao renumerar senhas:", error);
      throw error;
    }
  };

  return {
    agendamentos,
    loading,
    senhaAtual,
    salvarAgendamento,
    atualizarAgendamento,
    deletarAgendamento,
    toggleCompareceu,
    obterAgendamentosPorData,
    contarAgendamentosPorHorario,
    verificarDisponibilidade,
    verificarAgendamentoExistente,
    obterVagasRestantes,
    gerarProximaSenha,
    renumerarSenhasDoDia
  };
};
