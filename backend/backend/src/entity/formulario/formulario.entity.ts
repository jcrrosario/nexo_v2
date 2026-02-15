import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm'
import { Pergunta } from './pergunta.entity'

@Entity('tb_formulario_pesquisa')
export class Formulario {
  @PrimaryGeneratedColumn({ name: 'form_id' })
  form_id: number

  @Column()
  idtb_empresas: number

  @Column({ length: 150 })
  nome: string

  @Column({ length: 500, nullable: true })
  descricao: string

  @Column({ length: 50 })
  user_id: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date

  @Column({ length: 50, nullable: true })
  user_id_log: string

  @Column({ length: 3, default: 'NAO' })
  excluido: string

  @OneToMany(() => Pergunta, (p) => p.formulario)
  perguntas: Pergunta[]
}
