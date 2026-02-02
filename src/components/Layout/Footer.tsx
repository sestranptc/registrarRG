import React from 'react';
import { CONFIG } from '../../config/config';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Prefeitura Municipal</h3>
            <p className="text-gray-300 text-sm mb-2">{CONFIG.INFORMACOES_PREFEITURA.nome}</p>
            <p className="text-gray-300 text-sm">{CONFIG.INFORMACOES_PREFEITURA.endereco}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {CONFIG.INFORMACOES_PREFEITURA.telefone}
              </p>
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {CONFIG.INFORMACOES_PREFEITURA.horarioFuncionamento}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações Importantes</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Compareça 15 minutos antes</li>
              <li>• Traga todos os documentos</li>
              <li>• Use máscara se estiver gripado</li>
              <li>• Sistema de senhas automático</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Prefeitura Municipal de Patrocínio-MG. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};