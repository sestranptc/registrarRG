import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCalendario } from '../../hooks/useCalendario';
import { useAgendamentos } from '../../hooks/useAgendamentos';
import { DiaCalendario } from './DiaCalendario';
import { ContadorVagas } from './ContadorVagas';

interface CalendarioProps {
  aoSelecionarData: (data: string) => void;
}

export const Calendario: React.FC<CalendarioProps> = ({ aoSelecionarData }) => {
  const { mesAtual, mudarMes, obterDiasDoMes, ehDiaDisponivel, ehDiaPassado, ehFimDeSemana } = useCalendario();
  const { obterVagasRestantes } = useAgendamentos();
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  const calendarioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calendarioRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(calendarioRef.current, 
          {
            scale: 0.8,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'back.out(1.7)'
          }
        );
      }, calendarioRef);

      return () => ctx.revert();
    }
  }, []);

  const handleSelecionarData = (data: Date) => {
    const dataString = data.toISOString().split('T')[0];
    setDataSelecionada(dataString);
    aoSelecionarData(dataString);
  };

  const mesAnoFormatado = mesAtual.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const diasDoMes = obterDiasDoMes();
  const hoje = new Date();

  return (
    <div ref={calendarioRef} className="relative z-10 bg-white rounded-xl shadow-lg p-6 min-h-96">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Selecione uma data</h3>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => mudarMes('anterior')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-bold text-gray-800">
          {mesAnoFormatado.charAt(0).toUpperCase() + mesAnoFormatado.slice(1)}
        </h2>
        
        <button
          onClick={() => mudarMes('proximo')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {diasDaSemana.map(dia => (
          <div key={dia} className="text-center text-sm font-medium text-gray-600 py-2">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {diasDoMes.length === 0 && (
          <div className="col-span-7 text-center text-gray-500">Sem dias para exibir</div>
        )}
        {diasDoMes.map((data, index) => {
          const dataString = data.toISOString().split('T')[0];
          const ehDiaAtual = data.toDateString() === hoje.toDateString();
          const vagasRestantes = obterVagasRestantes(dataString);
          
          return (
            <DiaCalendario
              key={index}
              data={data}
              ehDiaAtual={ehDiaAtual}
              ehDiaDisponivel={ehDiaDisponivel(data)}
              ehDiaPassado={ehDiaPassado(data)}
              ehFimDeSemana={ehFimDeSemana(data)}
              vagasRestantes={vagasRestantes}
              totalVagas={60}
              estaSelecionado={dataSelecionada === dataString}
              aoClicar={handleSelecionarData}
            />
          );
        })}
      </div>

      <ContadorVagas
        dataSelecionada={dataSelecionada}
        vagasRestantes={dataSelecionada ? obterVagasRestantes(dataSelecionada) : 0}
        totalVagas={60}
      />

      <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Disponível</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">Últimas vagas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Esgotado</span>
        </div>
      </div>
    </div>
  );
};
