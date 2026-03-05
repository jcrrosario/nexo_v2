import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { PesquisaLancamento } from './pesquisa-lancamento.entity'
import { Formulario } from '../formulario/formulario.entity'

@Entity('tb_pesquisa')
export class Pesquisa {
  @PrimaryGeneratedColumn({ name: 'pesq_id' })
  pesq_id: number

  @Column()
  idtb_empresas: number

  @Column()
  form_id: number

  @Column({ type: 'date' })
  data_inicial: Date

  @Column({ type: 'date' })
  data_final: Date

  @Column({ length: 500, nullable: true })
  observacoes: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date

  @Column({ length: 50, nullable: true })
  user_id_log: string

  @Column({ length: 3, default: 'NAO' })
  excluido: string

  @ManyToOne(() => Formulario)
  @JoinColumn({ name: 'form_id' })
  formulario: Formulario

  @OneToMany(() => PesquisaLancamento, (l) => l.pesquisa)
  lancamentos: PesquisaLancamento[]
}