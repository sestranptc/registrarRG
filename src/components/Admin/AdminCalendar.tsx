import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import { SistemaConfig } from '../../hooks/useConfig';
import { toLocalISOString } from '../../utils/dateUtils';

interface AdminCalendarProps {
  config: SistemaConfig;
  onToggleDate: (data: string, categoriaId: string) => void;
  onCreateDefaultCategory?: () => void;
}

export const AdminCalendar: React.FC<AdminCalendarProps> = ({ config, onToggleDate, onCreateDefaultCategory }) => {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>(
    config.categorias?.[0]?.id || ''
  );

  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const mudarMes = (direcao: 'anterior' | 'proximo') => {
    const novoMes = new Date(mesAtual);
    if (direcao === 'anterior') {
      novoMes.setMonth(mesAtual.getMonth() - 1);
    } else {
      novoMes.setMonth(mesAtual.getMonth() + 1);
    }
    setMesAtual(novoMes);
  };

  const obterDiasDoMes = (): Date[] => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    
    const dias: Date[] = [];
    
    // Padding inicial
    const diaDaSemana = primeiroDia.getDay();
    for (let i = diaDaSemana; i > 0; i--) {
      const dia = new Date(primeiroDia);
      dia.setDate(dia.getDate() - i);
      dias.push(dia);
    }
    
    // Dias do mês
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(ano, mes, dia));
    }
    
    // Padding final (para completar 6 linhas = 42 dias, padrão visual)
    const diasRestantes = 42 - dias.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      dias.push(new Date(ano, mes + 1, dia));
    }
    
    return dias;
  };

  const handleDayClick = (data: Date) => {
    // Evitar datas passadas? Talvez não, admin pode querer ver histórico.
    // Mas para configurar disponibilidade futura, sim.
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    
    if (data < hoje) return;

    if (!categoriaSelecionada && config.categorias?.length > 0) {
        // Tenta selecionar a primeira se não tiver
        setCategoriaSelecionada(config.categorias[0].id);
        const dataString = toLocalISOString(data);
        onToggleDate(dataString, config.categorias[0].id);
    } else if (categoriaSelecionada) {
        const dataString = toLocalISOString(data);
        onToggleDate(dataString, categoriaSelecionada);
    } else if (onCreateDefaultCategory) {
        // Se não tem categoria mas tem função de criar
        if (confirm("É necessário criar uma categoria primeiro. Deseja criar 'Público Geral' automaticamente?")) {
            onCreateDefaultCategory();
        }
    } else {
        alert("Crie uma Categoria de Público antes de selecionar datas.");
    }
  };

  const dias = obterDiasDoMes();
  const regrasAtivas = config.regrasDatas || {};
  const temRegras = Object.keys(regrasAtivas).length > 0;

  // Atualiza categoria selecionada se a atual for removida
  React.useEffect(() => {
    if (config.categorias?.length > 0 && !config.categorias.find(c => c.id === categoriaSelecionada)) {
        setCategoriaSelecionada(config.categorias[0].id);
    }
  }, [config.categorias, categoriaSelecionada]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-100 rounded-xl text-teal-600">
                <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800">Datas de Atendimento</h3>
                <p className="text-sm text-slate-400">Clique nas datas para liberar o agendamento</p>
            </div>
        </div>

        {config.categorias?.length > 0 ? (
            <select
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
            >
                {config.categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
            </select>
        ) : (
            onCreateDefaultCategory ? (
                <button 
                    onClick={onCreateDefaultCategory}
                    className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors font-medium shadow-sm"
                >
                    Criar Categoria Padrão
                </button>
            ) : (
                <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                    Necessário criar categoria primeiro
                </div>
            )
        )}
      </div>

      {!temRegras && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-xl flex items-start gap-2">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p>
                Atualmente o sistema está operando no modo <strong>Automático</strong> (Seg-Sáb). 
                Ao selecionar uma data abaixo, o sistema mudará para modo <strong>Manual</strong> e apenas as datas selecionadas ficarão disponíveis.
            </p>
        </div>
      )}

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 bg-slate-50 p-2 rounded-xl">
        <button onClick={() => mudarMes('anterior')} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600">
            <ChevronLeft className="w-5 h-5" />
        </button>
        <h4 className="text-lg font-bold text-slate-700">
            {meses[mesAtual.getMonth()]} <span className="text-slate-400">{mesAtual.getFullYear()}</span>
        </h4>
        <button onClick={() => mudarMes('proximo')} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600">
            <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {diasDaSemana.map(d => (
            <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase py-2">
                {d}
            </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {dias.map((dia, idx) => {
            const dataString = toLocalISOString(dia);
            const estaNoMes = dia.getMonth() === mesAtual.getMonth();
            const regra = regrasAtivas[dataString];
            const selecionado = !!regra;
            const passado = dia < new Date(new Date().setHours(0,0,0,0));
            const categoriaNome = regra ? config.categorias?.find(c => c.id === regra.categoriaId)?.nome : '';

            return (
                <button
                    key={idx}
                    onClick={() => handleDayClick(dia)}
                    disabled={!estaNoMes || passado}
                    className={`
                        relative h-14 rounded-lg flex flex-col items-center justify-center transition-all border
                        ${!estaNoMes ? 'opacity-20 bg-slate-50 border-transparent cursor-default' : ''}
                        ${passado && estaNoMes ? 'opacity-40 bg-slate-50 cursor-not-allowed border-slate-100' : ''}
                        ${estaNoMes && !passado ? 'hover:shadow-md cursor-pointer' : ''}
                        ${selecionado && estaNoMes ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-500 shadow-sm' : 'bg-white border-slate-100'}
                        ${!selecionado && estaNoMes && !passado ? 'hover:border-emerald-200 hover:bg-emerald-50' : ''}
                    `}
                    title={selecionado ? `Disponível para: ${categoriaNome}` : 'Clique para liberar'}
                >
                    <span className={`text-sm font-bold ${selecionado ? 'text-emerald-800' : 'text-slate-600'}`}>
                        {dia.getDate()}
                    </span>
                    {selecionado && (
                        <span className="text-[10px] text-emerald-700 truncate w-full px-1 text-center font-bold">
                            {categoriaNome || 'Ativo'}
                        </span>
                    )}
                </button>
            );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 justify-center">
        <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-white border border-slate-200 shadow-sm"></div>
            <span>Indisponível</span>
        </div>
        <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-400 ring-2 ring-emerald-500 shadow-sm"></div>
            <span className="font-bold text-emerald-800">Disponível (Selecionado)</span>
        </div>
      </div>
    </div>
  );
};
