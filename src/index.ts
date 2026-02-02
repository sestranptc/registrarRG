import { AppDataSource } from './data-source';
import { usuarios } from './entities/User';

async function main() {
  try {
    // Inicializar conexão
    await AppDataSource.initialize();
    console.log('Database connected!');

    // Exemplo: Criar um usuário
    const userRepository = AppDataSource.getRepository(usuarios);
    
    const user = new usuarios();
    user.nome = 'Teste Nome';
    user.email = 'teste@email.com';    
    user.cpf = '12345678900';
    user.dataNascimento = '1990-01-01';
    user.telefone = '34999999999';
    
    await userRepository.save(user);
    console.log('User saved:', user);

    // Exemplo: Buscar todos os usuários
    const users = await userRepository.find();
    console.log('All users:', users);

  } catch (error) {
    console.error('Database connection error:', error);
  }
}

main();