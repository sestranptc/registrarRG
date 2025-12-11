import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class usuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nome: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  cpf: string;

  @Column({ name: 'data_nascimento', type: 'varchar' })
  dataNascimento: string;

  @Column({ type: 'varchar' })
  telefone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  criado_em: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  atualizado_em: Date;
   

}