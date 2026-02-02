import { useState, useEffect } from 'react';
import { CONFIG } from '../config/config';

export interface Categoria {
  id: string;
  nome: string;
  idadeMin: number;
  idadeMax: number;
}

export interface RegraData {
  categoriaId: string;
  limiteVagas?: number;
}

export interface SistemaConfig {
  horariosAtendimento: string[];
  feriados: string[];
  limiteVagasPorDia: number;
  categorias: Categoria[];
  regrasDatas: Record<string, RegraData>;
  capacidadePorHorario?: Record<string, number>;
}

const STORAGE_KEY = 'config_sistema_rg';

export const useConfig = () => {
  const [config, setConfig] = useState<SistemaConfig>({
    horariosAtendimento: [...CONFIG.HORARIOS_ATENDIMENTO],
    feriados: [...CONFIG.FERIADOS],
    limiteVagasPorDia: CONFIG.LIMITE_VAGAS_POR_DIA,
    categorias: [],
    regrasDatas: {},
    capacidadePorHorario: {}
  });

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConfig({
          horariosAtendimento: parsed.horariosAtendimento || [...CONFIG.HORARIOS_ATENDIMENTO],
          feriados: parsed.feriados || [...CONFIG.FERIADOS],
          limiteVagasPorDia: parsed.limiteVagasPorDia || CONFIG.LIMITE_VAGAS_POR_DIA,
          categorias: parsed.categorias || [],
          regrasDatas: parsed.regrasDatas || {},
          capacidadePorHorario: parsed.capacidadePorHorario || {}
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const salvarConfiguracoes = (novaConfig: SistemaConfig) => {
    try {
      setConfig(novaConfig);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novaConfig));
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return false;
    }
  };

  const adicionarHorario = (horario: string) => {
    const novosHorarios = [...config.horariosAtendimento, horario].sort();
    const capacidadeDefault = 10;
    const novasCapacidades = { ...(config.capacidadePorHorario || {}) };
    if (!(horario in novasCapacidades)) {
      novasCapacidades[horario] = capacidadeDefault;
    }
    salvarConfiguracoes({ ...config, horariosAtendimento: novosHorarios, capacidadePorHorario: novasCapacidades });
  };

  const removerHorario = (horario: string) => {
    const novosHorarios = config.horariosAtendimento.filter(h => h !== horario);
    const novasCapacidades = { ...(config.capacidadePorHorario || {}) };
    if (horario in novasCapacidades) {
      delete novasCapacidades[horario];
    }
    salvarConfiguracoes({ ...config, horariosAtendimento: novosHorarios, capacidadePorHorario: novasCapacidades });
  };

  const adicionarFeriado = (data: string) => {
    if (!config.feriados.includes(data)) {
      const novosFeriados = [...config.feriados, data].sort();
      salvarConfiguracoes({ ...config, feriados: novosFeriados });
    }
  };

  const removerFeriado = (data: string) => {
    const novosFeriados = config.feriados.filter(f => f !== data);
    salvarConfiguracoes({ ...config, feriados: novosFeriados });
  };

  const atualizarLimiteVagas = (limite: number) => {
    salvarConfiguracoes({ ...config, limiteVagasPorDia: limite });
  };

  const atualizarCapacidadeHorario = (horario: string, capacidade: number) => {
    const novasCapacidades = { ...(config.capacidadePorHorario || {}) };
    novasCapacidades[horario] = Math.max(0, Math.floor(capacidade));
    salvarConfiguracoes({ ...config, capacidadePorHorario: novasCapacidades });
  };

  const salvarCategoria = (categoria: Categoria) => {
    const novasCategorias = [...config.categorias];
    const index = novasCategorias.findIndex(c => c.id === categoria.id);
    if (index >= 0) {
      novasCategorias[index] = categoria;
    } else {
      novasCategorias.push(categoria);
    }
    salvarConfiguracoes({ ...config, categorias: novasCategorias });
  };

  const removerCategoria = (id: string) => {
    const novasCategorias = config.categorias.filter(c => c.id !== id);
    // Remove rules associated with this category
    const novasRegras = { ...config.regrasDatas };
    Object.keys(novasRegras).forEach(data => {
      if (novasRegras[data].categoriaId === id) {
        delete novasRegras[data];
      }
    });
    salvarConfiguracoes({ ...config, categorias: novasCategorias, regrasDatas: novasRegras });
  };

  const salvarRegraData = (data: string, regra: RegraData) => {
    const novasRegras = { ...config.regrasDatas, [data]: regra };
    salvarConfiguracoes({ ...config, regrasDatas: novasRegras });
  };

  const removerRegraData = (data: string) => {
    const novasRegras = { ...config.regrasDatas };
    delete novasRegras[data];
    salvarConfiguracoes({ ...config, regrasDatas: novasRegras });
  };

  return {
    config,
    adicionarHorario,
    removerHorario,
    adicionarFeriado,
    removerFeriado,
    atualizarLimiteVagas,
    atualizarCapacidadeHorario,
    salvarCategoria,
    removerCategoria,
    salvarRegraData,
    removerRegraData
  };
};
