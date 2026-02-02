import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { FormularioAgendamento } from '../components/Formulario/FormularioAgendamento';
import { useAgendamentos } from '../hooks/useAgendamentos';
import type { Agendamento } from '../types';
import { TransicaoPagina } from '../components/Animacoes/TransicaoPagina';
import { useConfig } from '../hooks/useConfig';

export const Confirmacao: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { salvarAgendamento, gerarProximaSenha, verificarAgendamentoExistente, contarAgendamentosPorHorario } = useAgendamentos();
  const { config } = useConfig();
  
  // Tenta pegar do state (legado) ou do query param (novo)
  const dataSelecionada = location.state?.dataSelecionada || searchParams.get('data');
  const horarioSelecionado = location.state?.horarioSelecionado || searchParams.get('horario');

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

      if (!horarioSelecionado) {
        alert('Horário não selecionado. Por favor, inicie o agendamento novamente.');
        navigate('/');
        return;
      }
      
      const capacidade = config.capacidadePorHorario?.[horarioSelecionado];
      if (capacidade !== undefined) {
        const ocupacao = contarAgendamentosPorHorario(dataSelecionada, horarioSelecionado);
        if (ocupacao >= capacidade) {
          alert('Este horário está lotado. Por favor, escolha outro horário disponível.');
          navigate('/');
          return;
        }
      }

      const senha = gerarProximaSenha();
      
      const agendamento: Agendamento = {
        ...dados,
        id: `agendamento_${Date.now()}`,
        senha,
        horario: horarioSelecionado,
        dataAgendamento: dataSelecionada
      };

      // Enviar para o backend (PostgreSQL)
      try {
        const response = await fetch('http://localhost:3001/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: dados.nome,
            email: dados.email,
            cpf: dados.cpf,
            dataNascimento: dados.dataNascimento,
            telefone: dados.telefone
          }),
        });

        if (!response.ok) {
          console.error('Erro ao salvar no banco de dados:', await response.text());
          // Não vamos bloquear o fluxo se o banco falhar, pois o LocalStorage ainda funciona
          // Mas em produção idealmente deveríamos tratar isso
        } else {
          console.log('Usuário salvo no banco com sucesso!');
        }
      } catch (dbError) {
        console.error('Erro de conexão com o backend:', dbError);
      }

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
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-white">
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Data Selecionada</h2>
                <p className="text-2xl font-bold">{new Date(dataSelecionada).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
              
              {horarioSelecionado && (
                <>
                  <div className="hidden md:block w-px h-16 bg-white/30"></div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Horário</h2>
                    <p className="text-2xl font-bold">{horarioSelecionado}</p>
                  </div>
                </>
              )}
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
