import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('tb_funcionario_cat')
export class FuncionarioCatEntity {
  @PrimaryGeneratedColumn()
  func_cat_id: number

  @Column()
  funcionario_id: number

  @Column({ length: 100 })
  numero_controle: string

  @Column({ type: 'date' })
  data_abertura: string

  @Column({ length: 5 })
  hora_abertura: string

  @Column()
  emitente: number

  @Column()
  tipo_cat: number

  @Column({ type: 'date' })
  data_ocorrido: string

  @Column({ length: 5 })
  hora_ocorrido: string

  @Column({ length: 20, nullable: true })
  apos_quantas_horas_trabalho: string

  @Column()
  tipo_ocorrido: number

  @Column({ length: 3, default: 'Nao' })
  houve_afastamento: string

  @Column({ type: 'date', nullable: true })
  ultimo_dia_trabalhado: string

  @Column({ length: 255, nullable: true })
  local_ocorrido: string

  @Column({ length: 255, nullable: true })
  especificacao_local: string

  @Column({ length: 150, nullable: true })
  municipio_ocorrido: string

  @Column({ length: 2, nullable: true })
  uf_ocorrido: string

  @Column({ length: 255, nullable: true })
  parte_corpo_atingida: string

  @Column({ length: 255, nullable: true })
  agente_causador: string

  @Column({ type: 'text', nullable: true })
  descricao_situacao: string

  @Column({ type: 'timestamp without time zone', nullable: true })
  data_hora_atestado: Date

  @Column({ length: 20, nullable: true })
  codigo_cid: string

  @Column({ length: 255, nullable: true })
  nome_medico: string

  @Column({ length: 50, nullable: true })
  crm: string

  @Column({ nullable: true })
  tempo_estimado_afastamento_dias: number

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