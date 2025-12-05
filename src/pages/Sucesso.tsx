import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { enviarEmailConfirmacao } from '../services/emailService';
import type { Agendamento } from '../types';
import { CONFIG } from '../config/config';
import { TransicaoPagina } from '../components/Animacoes/TransicaoPagina';

export const Sucesso: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  const state = (location.state || {}) as {
    agendamento: Agendamento;
    dataFormatada: string;
  };
  const { agendamento, dataFormatada } = state;

  if (!agendamento) {
    navigate('/');
    return null;
  }

  const handleImprimir = () => {
    window.print();
  };

  const [emailEnviado, setEmailEnviado] = useState(false);

  useEffect(() => {
    if (agendamento && !emailEnviado && !isSendingEmail) {
      handleEnviarEmail();
    }
  }, [agendamento]);

  const handleEnviarEmail = async () => {
    if (isSendingEmail || emailEnviado) return;

    setIsSendingEmail(true);
    try {
      const sucesso = await enviarEmailConfirmacao(agendamento, dataFormatada);
      if (sucesso) {
        setEmailEnviado(true);
        // Removido alert para evitar bloqueio da interface
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      alert(`Erro ao enviar email: ${error}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TransicaoPagina>
          <div className="text-center mb-8 no-print">
            <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Agendamento Confirmado!</h1>
            <p className="text-blue-100">Seu agendamento foi realizado com sucesso</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 print-content">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Comprovante de Agendamento</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium mb-2">Sua senha é</p>
                  <div className="text-6xl font-bold text-green-600 mb-2">
                    {agendamento.senha.toString().padStart(3, '0')}
                  </div>
                  <p className="text-sm text-green-600">Guarde este número!</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Dados Pessoais</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <p><span className="font-medium">Nome:</span> {agendamento.nome}</p>
                    <p><span className="font-medium">CPF:</span> {agendamento.cpf}</p>
                    <p><span className="font-medium">Email:</span> {agendamento.email}</p>
                    <p><span className="font-medium">Telefone:</span> {agendamento.telefone}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Agendamento</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <p><span className="font-medium">Data:</span> {dataFormatada}</p>
                    <p><span className="font-medium">Horário:</span> {agendamento.horario}</p>
                    <p><span className="font-medium">Senha:</span> {agendamento.senha.toString().padStart(3, '0')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-blue-800 mb-3">Local do Atendimento</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p className="font-medium">{CONFIG.INFORMACOES_PREFEITURA.nome}</p>
                <p>{CONFIG.INFORMACOES_PREFEITURA.endereco}</p>
                <p>Telefone: {CONFIG.INFORMACOES_PREFEITURA.telefone}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-yellow-800 mb-3">Documentos Necessários</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Documento de identidade original</li>
                <li>• Certidão de nascimento ou casamento</li>
                <li>• Comprovante de residência</li>
                <li>• CPF</li>
              </ul>
              <p className="text-xs text-yellow-600 mt-3 font-medium">
                ⏰ Por favor, chegue 15 minutos antes do horário agendado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 no-print">
              <button
                onClick={handleEnviarEmail}
                disabled={isSendingEmail || emailEnviado}
                className={`flex-1 ${emailEnviado ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center ${isSendingEmail || emailEnviado ? 'opacity-75 cursor-default' : ''}`}
              >
                {emailEnviado ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Email Enviado com Sucesso!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {isSendingEmail ? 'Enviando...' : 'Enviar por Email'}
                  </>
                )}
              </button>
              
              <button
                onClick={handleImprimir}
                className="flex-1 bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir / Salvar PDF
              </button>
            </div>
          </div>
        </TransicaoPagina>
      </main>
      
      <Footer />
    </div>
  );
};
