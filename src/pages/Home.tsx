import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroAnimation } from '../components/Animacoes/HeroAnimation';
import { Calendario } from '../components/Calendario/Calendario';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { CONFIG } from '../config/config';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleSelecionarData = (data: string) => {
    setDataSelecionada(data);
  };

  const handleAgendar = () => {
    if (dataSelecionada) {
      // Usar query param para maior robustez na navegação
      navigate(`/confirmacao?data=${dataSelecionada}`);
    }
  };

  const scrollToCalendar = () => {
    if (calendarRef.current) {
      calendarRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (dataSelecionada && ctaRef.current) {
      import('gsap').then(({ default: gsap }) => {
        gsap.fromTo(
          ctaRef.current,
          { scale: 0.96, boxShadow: '0 0 0 rgba(0,0,0,0)' },
          { scale: 1, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', duration: 0.4, ease: 'power2.out' }
        );
      });
      ctaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [dataSelecionada]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <HeroAnimation 
            titulo="Agendamento de RG - Prefeitura de Patrocínio-MG"
            subtitulo="Agende sua emissão de RG de forma rápida e prática. Sistema com limite de 60 atendimentos por dia."
          />
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
            {/* Aviso de Mutirão */}
            <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md text-left">
              <p className="font-bold text-lg mb-1">⚠️ Agendamento Temporariamente Suspenso</p>
              <p>
                Aguarde o <strong>Mutirão</strong> ser liberado para realizar o seu agendamento. 
                Fique atento às redes sociais da Prefeitura para mais informações sobre as novas datas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white opacity-50 pointer-events-none grayscale">
              <div className="text-center">
                <div className="text-2xl font-bold">60</div>
                <div className="text-sm opacity-90">Vagas por dia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1-100</div>
                <div className="text-sm opacity-90">Senhas disponíveis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">30 dias</div>
                <div className="text-sm opacity-90">Antecedência máxima</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={scrollToCalendar}
              className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors duration-200"
            >
              Ver Calendário de Agendamento
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="mt-6">
            <div ref={calendarRef} className="calendar-container">
              <Calendario aoSelecionarData={handleSelecionarData} />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Informações Importantes</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Horário de Funcionamento</h4>
                  <p>{CONFIG.INFORMACOES_PREFEITURA.horarioFuncionamento}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Endereço</h4>
                  <p>{CONFIG.INFORMACOES_PREFEITURA.endereco}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Telefone</h4>
                  <p>{CONFIG.INFORMACOES_PREFEITURA.telefone}</p>
                </div>
              </div>
            </div>
            <div ref={ctaRef} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Próximo Passo</h3>
              {!dataSelecionada && (
                <div className="text-gray-600">
                  <p className="mb-2">1. Selecione um dia disponível no calendário</p>
                  <p className="mb-4">2. Clique em <span className="font-medium">Agendar para este dia</span></p>
                  <div className="text-xs text-gray-500">Dias esgotados ou fora do período aparecem desabilitados</div>
                </div>
              )}
              {dataSelecionada && (
                <p className="text-gray-600 mb-4">
                  Você selecionou: <span className="font-medium">{new Date(dataSelecionada).toLocaleDateString('pt-BR')}</span>
                </p>
              )}
              <button
                onClick={handleAgendar}
                disabled={!dataSelecionada}
                className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                  dataSelecionada
                    ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Agendar para este dia
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
