import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('tb_fator')
export class FatorEntity {
  @PrimaryGeneratedColumn()
  fator_id: number

  @Column()
  idtb_empresas: number

  @Column({ length: 150 })
  nome: string

  @Column({ type: 'int' })
  severidade: number

  @Column({ length: 400, nullable: true })
  possiveis_consequencias: string

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
