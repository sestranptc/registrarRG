import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { CONFIG } from '../config/config';
import type { Agendamento } from '../types';
import { formatarDataExtenso } from '../utils/dateUtils';

export const Verificacao: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id); // Carrega apenas se tiver ID na URL
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [inputCodigo, setInputCodigo] = useState('');

  useEffect(() => {
    if (id) {
      // Simula um tempo de verificação para "efeito" de segurança
      const timer = setTimeout(() => {
        verificarAgendamento(id);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [id]);

  const verificarAgendamento = (codigoId: string) => {
    try {
      const storageKey = CONFIG.STORAGE_KEYS.AGENDAMENTOS;
      const agendamentosSalvos = localStorage.getItem(storageKey);
      
      if (agendamentosSalvos) {
        const listaAgendamentos: Agendamento[] = JSON.parse(agendamentosSalvos);
        const encontrado = listaAgendamentos.find(a => a.id === codigoId);
        
        if (encontrado) {
          setAgendamento(encontrado);
          setErro(null);
        } else {
          setAgendamento(null);
          setErro('Agendamento não encontrado na base de dados.');
        }
      } else {
        setErro('Nenhum agendamento registrado no sistema.');
      }
    } catch (error) {
      setErro('Erro ao verificar autenticidade do agendamento.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCodigo.trim()) return;
    setLoading(true);
    // Navega para a URL com ID para manter o fluxo consistente
    navigate(`/verificacao/${inputCodigo.trim()}`);
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Verificar Agendamento</h2>
              <p className="text-gray-600 mt-2">Digite o código de autenticação presente no comprovante.</p>
            </div>

            <form onSubmit={handleBuscarManual} className="space-y-4">
              <div>
                <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Autenticação
                </label>
                <input
                  type="text"
                  id="codigo"
                  value={inputCodigo}
                  onChange={(e) => setInputCodigo(e.target.value)}
                  placeholder="Ex: agd_123456789"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-center uppercase"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!inputCodigo.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verificar Código
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Voltar para a página inicial
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Verificando autenticidade...</h2>
            <p className="text-gray-500 text-sm mt-2">Consultando base de dados oficial</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cabeçalho do Card */}
          <div className={`p-6 text-center ${agendamento ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
              {agendamento ? (
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {agendamento ? 'AGENDAMENTO VÁLIDO' : 'AGENDAMENTO INVÁLIDO'}
            </h1>
            <p className="text-white text-opacity-90 mt-1">
              {agendamento 
                ? 'A autenticidade deste documento foi confirmada.' 
                : 'Não foi possível verificar a autenticidade deste documento.'}
            </p>
          </div>

          {/* Corpo do Card */}
          <div className="p-6 sm:p-8">
            {agendamento ? (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Identificador Único</p>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded border border-gray-200 break-all">
                    {agendamento.id}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Dados do Cidadão
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Nome Completo</p>
                        <p className="font-medium text-gray-900">{agendamento.nome}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CPF (Parcial)</p>
                        <p className="font-medium text-gray-900">
                          {agendamento.cpf.slice(0, 3)}.***.***-{agendamento.cpf.slice(-2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Detalhes do Agendamento
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="font-medium text-gray-900 text-lg">
                          {formatarDataExtenso(agendamento.dataAgendamento)}
                        </p>
                      </div>
                      <div className="flex space-x-6">
                        <div>
                          <p className="text-sm text-gray-500">Horário</p>
                          <p className="font-medium text-gray-900">{agendamento.horario}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Senha</p>
                          <p className="font-bold text-green-600 text-xl">
                            {agendamento.senha.toString().padStart(3, '0')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800">Status Oficial</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Este agendamento consta na base de dados da Prefeitura Municipal e está ativo. O portador deve apresentar documento original com foto no momento do atendimento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-6">
                  O código verificador informado não corresponde a nenhum agendamento ativo em nosso sistema.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-left mx-auto max-w-md">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">Possíveis motivos:</h4>
                  <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                    <li>O agendamento foi cancelado</li>
                    <li>O código foi digitado incorretamente</li>
                    <li>O agendamento é de uma data muito antiga</li>
                    <li>Tentativa de fraude</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar ao Início
              </button>
            </div>
          </div>
          
          {/* Rodapé do Card */}
          <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Sistema de Verificação Digital - {CONFIG.INFORMACOES_PREFEITURA.nome}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date().getFullYear()} © Todos os direitos reservados
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
