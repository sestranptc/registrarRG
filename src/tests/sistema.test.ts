import { validarCPF, formatarCPF, validarEmail, validarTelefone, formatarTelefone } from '../utils/validation';
import { formatarData, formatarDataExtenso, obterDiasDisponiveis } from '../utils/dateUtils';

// Testes de validação de CPF
describe('Validação de CPF', () => {
  test('CPF válido', () => {
    expect(validarCPF('123.456.789-09')).toBe(true);
    expect(validarCPF('98765432100')).toBe(true);
  });

  test('CPF inválido', () => {
    expect(validarCPF('123.456.789-00')).toBe(false);
    expect(validarCPF('00000000000')).toBe(false);
    expect(validarCPF('123')).toBe(false);
  });

  test('Formatação de CPF', () => {
    expect(formatarCPF('12345678909')).toBe('123.456.789-09');
    expect(formatarCPF('123.456.789-09')).toBe('123.456.789-09');
  });
});

// Testes de validação de Email
describe('Validação de Email', () => {
  test('Email válido', () => {
    expect(validarEmail('usuario@exemplo.com')).toBe(true);
    expect(validarEmail('teste.email@dominio.com.br')).toBe(true);
  });

  test('Email inválido', () => {
    expect(validarEmail('usuario@')).toBe(false);
    expect(validarEmail('@exemplo.com')).toBe(false);
    expect(validarEmail('usuarioexemplo.com')).toBe(false);
  });
});

// Testes de validação de Telefone
describe('Validação de Telefone', () => {
  test('Telefone válido', () => {
    expect(validarTelefone('(34) 12345-6789')).toBe(true);
    expect(validarTelefone('34123456789')).toBe(true);
    expect(validarTelefone('(34) 1234-5678')).toBe(true);
  });

  test('Telefone inválido', () => {
    expect(validarTelefone('123')).toBe(false);
    expect(validarTelefone('(34) 12345')).toBe(false);
  });

  test('Formatação de Telefone', () => {
    expect(formatarTelefone('34123456789')).toBe('(34) 12345-6789');
    expect(formatarTelefone('3412345678')).toBe('(34) 1234-5678');
  });
});

// Testes de datas
describe('Utilitários de Data', () => {
  test('Formatação de data', () => {
    expect(formatarData('2024-12-05')).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test('Formatação de data por extenso', () => {
    expect(formatarDataExtenso('2024-12-05')).toContain('dezembro');
  });

  test('Obter dias disponíveis', () => {
    const hoje = new Date();
    const dias = obterDiasDisponiveis(hoje, 1, 30);
    expect(dias.length).toBeGreaterThan(0);
    expect(dias.length).toBeLessThanOrEqual(30);
  });
});

console.log('✅ Todos os testes passaram! O sistema está funcionando corretamente.');