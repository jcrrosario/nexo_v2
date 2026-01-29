import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('tb_vinculacao')
export class Vinculacao {
  @PrimaryGeneratedColumn()
  vinculacao_id: number

  @Column()
  empresa_id: number

  @Column()
  dpto_id: number

  @Column()
  func_id: number

  @Column()
  user_id: string

  @Column('numeric')
  percentual_alocacao: number

  @Column('numeric', { nullable: true })
  custo_mensal: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn({ nullable: true })
  updated_at: Date

  @Column({ nullable: true })
  user_id_log: string

  @Column({ default: 'Nao' })
  excluido: string
}
