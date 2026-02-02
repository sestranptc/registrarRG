import React, { useState } from 'react';
import type { Agendamento } from '../../types';
import { CampoCPF } from './CampoCPF';
import { validarCPF, validarEmail, validarTelefone, formatarTelefone } from '../../utils/validation';
import { CONFIG } from '../../config/config';
import { useConfig } from '../../hooks/useConfig';
import { User, AlertCircle } from 'lucide-react';

interface FormularioAgendamentoProps {
  dataSelecionada: string;
  aoConfirmar: (dados: Omit<Agendamento, 'id' | 'senha' | 'horario'>) => void;
}

export const FormularioAgendamento: React.FC<FormularioAgendamentoProps> = ({ 
  dataSelecionada, 
  aoConfirmar 
}) => {
  const { config } = useConfig();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    telefone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificar se existe regra para a data selecionada
  const regraData = config.regrasDatas?.[dataSelecionada];
  const categoriaData = regraData ? config.categorias?.find(c => c.id === regraData.categoriaId) : null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTelefoneChange = (value: string) => {
    const telefoneFormatado = formatarTelefone(value);
    handleInputChange('telefone', telefoneFormatado);
  };

  const calcularIdade = (dataNascimento: string): number => {
    const hoje = new Date();
    const nasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
      idade--;
    }
    return idade;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validarCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      const idade = calcularIdade(formData.dataNascimento);
      
      // Validação de categoria específica se houver regra para a data
      if (categoriaData) {
        if (idade < categoriaData.idadeMin || idade > categoriaData.idadeMax) {
          newErrors.dataNascimento = `Esta data é exclusiva para ${categoriaData.nome} (${categoriaData.idadeMin} a ${categoriaData.idadeMax} anos)`;
        }
      } else {
        // Validação padrão apenas se não houver regra específica
        if (idade < 16) {
          newErrors.dataNascimento = 'É necessário ter pelo menos 16 anos';
        }
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validarEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!validarTelefone(formData.telefone)) {
      newErrors.telefone = 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      aoConfirmar({
        ...formData,
        dataAgendamento: dataSelecionada
      });
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirme seu Agendamento</h2>
        <p className="text-gray-600">
          Data selecionada: <span className="font-medium">{new Date(dataSelecionada).toLocaleDateString('pt-BR')}</span>
        </p>
      </div>

      {categoriaData && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900">Atendimento Exclusivo: {categoriaData.nome}</h3>
              <p className="text-sm text-indigo-700">
                Esta data é reservada para pessoas entre {categoriaData.idadeMin} e {categoriaData.idadeMax} anos.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
              errors.nome 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-green-500'
            }`}
            placeholder="Digite seu nome completo"
          />
          {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CampoCPF
            value={formData.cpf}
            onChange={(value) => handleInputChange('cpf', value)}
            error={errors.cpf}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento *
            </label>
            <input
              type="date"
              value={formData.dataNascimento}
              onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                errors.dataNascimento 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-green-500'
              }`}
            />
            {errors.dataNascimento && <p className="mt-1 text-sm text-red-600">{errors.dataNascimento}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
              errors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-green-500'
            }`}
            placeholder="seu@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone *
          </label>
          <input
            type="tel"
            value={formData.telefone}
            onChange={(e) => handleTelefoneChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
              errors.telefone 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-green-500'
            }`}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
          {errors.telefone && <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-medium text-blue-800 mb-2">Documentos necessários:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Certidão de nascimento ou casamento Original</li>
            <li>• Comprovante de residência</li>
            <li>• CPF</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSubmitting ? 'Processando...' : 'Confirmar Agendamento'}
        </button>
      </form>
    </div>
  );
};
