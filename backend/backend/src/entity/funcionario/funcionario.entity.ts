import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string | null) => (value ? Number(value) : 0),
}

@Entity('tb_funcionarios')
export class FuncionarioEntity {
  @PrimaryGeneratedColumn()
  funcionario_id: number

  @PrimaryColumn()
  idtb_empresas: number

  @Column()
  nome_completo: string

  @Column({ nullable: true })
  cpf: string

  @Column({ nullable: true })
  rg: string

  @Column({ nullable: true })
  pis_pasep: string

  @Column({ type: 'date', nullable: true })
  data_nascimento: string

  @Column({ nullable: true })
  endereco: string

  @Column({ nullable: true })
  cep: string

  @Column({ nullable: true })
  bairro: string

  @Column({ nullable: true })
  municipio: string

  @Column({ nullable: true })
  sexo: string

  @Column({ nullable: true })
  estado_civil: string

  @Column({ nullable: true })
  grau_instrucao: string

  @Column({ nullable: true })
  carteira_trabalho: string

  @Column({ nullable: true })
  serie: string

  @Column({ nullable: true, length: 2 })
  uf: string

  @Column({ type: 'date', nullable: true })
  data_carteira_trabalho: string

  @Column({ type: 'date', nullable: true })
  data_admissao: string

  @Column({ type: 'date', nullable: true })
  data_demissao: string

  @Column({ nullable: true })
  funcao_id: number

  @Column({ nullable: true })
  dpto_id: number

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  salario_bruto: number

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  encargos: number

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  provisoes: number

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  beneficios: number

  @Column({ default: 'Não' })
  excluido: 'Sim' | 'Não'

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column({ nullable: true })
  user_id_log: string
}