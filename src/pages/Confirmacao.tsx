import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { FormularioAgendamento } from '../components/Formulario/FormularioAgendamento';
import { useAgendamentos } from '../hooks/useAgendamentos';
import type { Agendamento } from '../types';
import { TransicaoPagina } from '../components/Animacoes/TransicaoPagina';

export const Confirmacao: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { salvarAgendamento, gerarProximaSenha, verificarAgendamentoExistente } = useAgendamentos();
  
  const dataSelecionada = location.state?.dataSelecionada;

  if (!dataSelecionada) {
    navigate('/');
    return null;
  }

  const handleConfirmar = async (dados: Omit<Agendamento, 'id' | 'senha' | 'horario'>) => {
    try {
      // Verifica se já existe agendamento para este CPF
      if (verificarAgendamentoExistente(dados.cpf)) {
        alert('Já existe um agendamento realizado para este CPF.');
        return;
      }

      const senha = gerarProximaSenha();
      const horarios = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
        '15:30', '16:00', '16:30'
      ];
      
      // Simular distribuição de horários baseada na senha
      const indiceHorario = (senha - 1) % horarios.length;
      const horario = horarios[indiceHorario];

      const agendamento: Agendamento = {
        ...dados,
        id: `agendamento_${Date.now()}`,
        senha,
        horario,
        dataAgendamento: dataSelecionada
      };

      salvarAgendamento(agendamento);
      
      navigate('/sucesso', { 
        state: { 
          agendamento,
          dataFormatada: new Date(dataSelecionada).toLocaleDateString('pt-BR')
        } 
      });
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Erro ao processar agendamento. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TransicaoPagina>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Confirmação de Agendamento</h1>
            <p className="text-blue-100">Preencha seus dados para confirmar o agendamento</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="text-center text-white">
              <h2 className="text-xl font-bold mb-2">Data Selecionada</h2>
              <p className="text-2xl font-bold">{new Date(dataSelecionada).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>

          <FormularioAgendamento 
            dataSelecionada={dataSelecionada}
            aoConfirmar={handleConfirmar}
          />
        </TransicaoPagina>
      </main>
      
      <Footer />
    </div>
  );
};
