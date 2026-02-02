import React from 'react';

interface ContadorVagasProps {
  dataSelecionada: string | null;
  vagasRestantes: number;
  totalVagas: number;
}

export const ContadorVagas: React.FC<ContadorVagasProps> = ({ 
  dataSelecionada, 
  vagasRestantes, 
  totalVagas 
}) => {
  if (!dataSelecionada) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-600 font-medium">Selecione uma data para verificar a disponibilidade</p>
      </div>
    );
  }

  const vagasOcupadas = totalVagas - vagasRestantes;
  const porcentagemOcupada = (vagasOcupadas / totalVagas) * 100;

  return (
    <div className={`border rounded-lg p-4 text-center ${
      vagasRestantes === 0 
        ? 'bg-red-50 border-red-200' 
        : vagasRestantes <= 10 
        ? 'bg-yellow-50 border-yellow-200' 
        : 'bg-green-50 border-green-200'
    }`}>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Vagas Disponíveis
      </h3>
      <div className="text-3xl font-bold mb-2">
        <span className={
          vagasRestantes === 0 
            ? 'text-red-600' 
            : vagasRestantes <= 10 
            ? 'text-yellow-600' 
            : 'text-green-600'
        }>
          {vagasRestantes}
        </span>
        <span className="text-gray-600 text-lg"> / {totalVagas}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full ${
            vagasRestantes === 0 
              ? 'bg-red-500' 
              : vagasRestantes <= 10 
              ? 'bg-yellow-500' 
              : 'bg-green-500'
          }`}
          style={{ width: `${porcentagemOcupada}%` }}
        />
      </div>
      <p className={`text-sm font-medium ${
        vagasRestantes === 0 
          ? 'text-red-600' 
          : vagasRestantes <= 10 
          ? 'text-yellow-600' 
          : 'text-green-600'
      }`}>
        {vagasRestantes === 0 
          ? 'Data esgotada' 
          : vagasRestantes <= 10 
          ? 'Últimas vagas!' 
          : 'Vagas disponíveis'
        }
      </p>
    </div>
  );
};