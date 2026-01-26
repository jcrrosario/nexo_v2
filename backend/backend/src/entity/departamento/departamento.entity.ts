import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('tb_departamentos')
export class DepartamentoEntity {
  @PrimaryGeneratedColumn()
  dpto_id: number

  @PrimaryColumn()
  idtb_empresas: number

  @Column()
  nome: string

  @Column()
  responsavel: string

  @Column({ default: 'Não' })
  excluido: 'Sim' | 'Não'

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column({ nullable: true })
  user_id_log: string
}
