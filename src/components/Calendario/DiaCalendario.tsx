import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface DiaCalendarioProps {
  data: Date;
  ehDiaAtual: boolean;
  ehDiaDisponivel: boolean;
  ehDiaPassado: boolean;
  ehFimDeSemana: boolean;
  vagasRestantes: number;
  totalVagas: number;
  estaSelecionado: boolean;
  aoClicar: (data: Date) => void;
}

export const DiaCalendario: React.FC<DiaCalendarioProps> = ({
  data,
  ehDiaAtual,
  ehDiaDisponivel,
  ehDiaPassado,
  ehFimDeSemana,
  vagasRestantes,
  totalVagas,
  estaSelecionado,
  aoClicar
}) => {
  const diaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (diaRef.current) {
      diaRef.current.addEventListener('mouseenter', () => {
        gsap.to(diaRef.current, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
      });
      
      diaRef.current.addEventListener('mouseleave', () => {
        gsap.to(diaRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });
      });
    }
  }, []);

  const obterClasseDia = (): string => {
    let classes = 'w-14 h-14 rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all duration-200 ';
    
    // Dias passados ou fins de semana (exceto se for um dia disponível, ex: Sábado permitido)
    if (ehDiaPassado || (ehFimDeSemana && !ehDiaDisponivel)) {
      classes += 'bg-gray-100 text-gray-400 cursor-not-allowed ';
    } else if (estaSelecionado) {
      classes += 'bg-green-600 text-white shadow-lg ';
    } else if (ehDiaDisponivel && vagasRestantes > 0) {
      classes += 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer ';
    } else if (ehDiaDisponivel && vagasRestantes <= 0) {
      classes += 'bg-red-100 text-red-800 cursor-not-allowed ';
    } else {
      // Dias úteis não disponíveis (ou fins de semana não disponíveis que caíram aqui por algum motivo)
      classes += 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer ';
    }
    
    if (ehDiaAtual && !estaSelecionado) {
      classes += 'ring-2 ring-blue-400 ';
    }
    
    return classes;
  };

  const obterIndicadorVagas = () => {
    // Mostra indicador se estiver disponível e não for passado
    // Removemos a restrição de fim de semana para permitir sábados
    if (!ehDiaDisponivel || ehDiaPassado) return null;
    
    if (vagasRestantes <= 0) {
      return <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>;
    } else if (vagasRestantes <= 10) {
      return <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1"></div>;
    } else {
      return <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>;
    }
  };

  const aoClicarDia = () => {
    // Permite clicar se não for passado, estiver disponível e tiver vagas
    // Removemos a restrição de !ehFimDeSemana para permitir sábados
    if (!ehDiaPassado && ehDiaDisponivel && vagasRestantes > 0) {
      aoClicar(data);
    }
  };

  return (
    <button
      ref={diaRef}
      onClick={aoClicarDia}
      disabled={ehDiaPassado || !ehDiaDisponivel || vagasRestantes <= 0}
      className={obterClasseDia()}
    >
      <span>{data.getDate()}</span>
      {obterIndicadorVagas()}
    </button>
  );
};
