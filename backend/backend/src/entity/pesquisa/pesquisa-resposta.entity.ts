import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { PesquisaLancamento } from './pesquisa-lancamento.entity'

@Entity('tb_pesquisa_resposta')
export class PesquisaResposta {
  @PrimaryGeneratedColumn({ name: 'resp_id' })
  resp_id: number

  @Column()
  lanc_id: number

  @Column()
  pergunta_id: number

  @Column()
  resposta_numero: number

  @Column({ length: 50 })
  user_id: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @ManyToOne(() => PesquisaLancamento, (l) => l.respostas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lanc_id' })
  lancamento: PesquisaLancamento
}
