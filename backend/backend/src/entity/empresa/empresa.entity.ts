import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('tb_empresas')
export class EmpresaEntity {
  @PrimaryColumn()
  empresa_id: number

  @Column()
  razao_social: string

  @Column({ nullable: true })
  nome_fantasia: string

  @Column({ nullable: true })
  cnpj: string

  @Column({ nullable: true })
  inscricao_estadual: string

  @Column({ nullable: true })
  endereco: string

  @Column({ nullable: true })
  cidade: string

  @Column({ length: 2, nullable: true })
  uf: string

  @Column({ nullable: true })
  cep: string

  @Column({ nullable: true })
  telefone: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  contato: string

  @Column({ nullable: true })
  cnae: string

  @Column({ length: 3 })
  ativa: 'Sim' | 'Não'
}
