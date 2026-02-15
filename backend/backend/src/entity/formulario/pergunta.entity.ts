import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Formulario } from './formulario.entity'

@Entity('tb_pergunta')
export class Pergunta {
  @PrimaryGeneratedColumn({ name: 'pergunta_id' })
  pergunta_id: number

  @Column()
  form_id: number

  @Column()
  categ_id: number

  @Column({ length: 1000 })
  texto: string

  @Column({ length: 50, default: 'TEXTO' })
  tipo_resposta: string

  @Column({ length: 3, default: 'NAO' })
  obrigatoria: string

  @Column({ default: 0 })
  ordem: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date

  @Column({ length: 50, nullable: true })
  user_id_log: string

  @Column({ length: 3, default: 'NAO' })
  excluido: string

  @ManyToOne(() => Formulario, (f) => f.perguntas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'form_id' })
  formulario: Formulario
}
