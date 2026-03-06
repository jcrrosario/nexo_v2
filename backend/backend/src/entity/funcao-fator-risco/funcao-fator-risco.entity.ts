import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('tb_funcao_fator_risco')
export class FuncaoFatorRiscoEntity {
  @PrimaryGeneratedColumn()
  func_fator_id: number

  @Column()
  func_id: number

  @Column({ length: 300 })
  fator_risco: string

  @Column()
  severidade: number

  @Column({ type: 'text', nullable: true })
  possiveis_consequencias: string

  @Column()
  idtb_empresas: number

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
  })
  updated_at: Date

  @Column({ length: 50 })
  user_id_log: string

  @Column({ length: 3, default: 'Nao' })
  excluido: string
}