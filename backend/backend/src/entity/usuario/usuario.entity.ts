import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('tb_usuario')
export class UsuarioEntity {
  @PrimaryColumn({ length: 20 })
  user_id: string

  @Column()
  nome: string

  @Column()
  email: string

  @Column()
  senha: string

  @Column({ nullable: true })
  foto?: string

  @Column()
  idtb_empresas: number

  @Column({ default: 'Sim' })
  ativo: 'Sim' | 'Não'

  @Column()
  perfil: 'Administrador' | 'Usuario'

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column({ nullable: true })
  user_id_log?: string
}
