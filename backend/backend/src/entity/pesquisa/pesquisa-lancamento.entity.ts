import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm'
import { Pesquisa } from './pesquisa.entity'
import { PesquisaResposta } from './pesquisa-resposta.entity'

@Entity('tb_pesquisa_lancamento')
export class PesquisaLancamento {
  @PrimaryGeneratedColumn({ name: 'lanc_id' })
  lanc_id: number

  @Column()
  pesq_id: number

  @Column()
  dpto_id: number

  @Column()
  func_id: number

  @Column({ length: 50 })
  user_id: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date

  @ManyToOne(() => Pesquisa, (p) => p.lancamentos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pesq_id' })
  pesquisa: Pesquisa

  @OneToMany(() => PesquisaResposta, (r) => r.lancamento)
  respostas: PesquisaResposta[]
}
