import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src={`${import.meta.env.BASE_URL}BRASAO.png`} 
              alt="Brasão Prefeitura" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Prefeitura de Patrocínio-MG</h1>
              <p className="text-sm text-gray-600">Agendamento de RG</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Segunda a Sexta, 08:00 às 17:00</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};