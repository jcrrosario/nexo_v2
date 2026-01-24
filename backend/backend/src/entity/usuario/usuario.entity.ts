import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('tb_usuario')
export class UsuarioEntity {
  @PrimaryColumn({ length: 50 })
  user_id: string

  @PrimaryColumn()
  idtb_empresas: number

  @Column({ length: 150 })
  nome: string

  @Column({ length: 150 })
  email: string

  @Column({ length: 255 })
  senha: string

  @Column({ length: 255, nullable: true })
  foto: string

  @Column({ length: 20 })
  perfil: 'Administrador' | 'Usuario'

  @Column({ length: 3, default: 'Sim' })
  ativo: 'Sim' | 'Não'

  @Column({ length: 3, default: 'Não' })
  excluido: 'Sim' | 'Não'

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date

  @Column({ length: 50, nullable: true })
  user_id_log: string
}
