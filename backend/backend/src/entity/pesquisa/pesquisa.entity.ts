import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm'
import { PesquisaLancamento } from './pesquisa-lancamento.entity'

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

  @OneToMany(() => PesquisaLancamento, (l) => l.pesquisa)
  lancamentos: PesquisaLancamento[]
}
