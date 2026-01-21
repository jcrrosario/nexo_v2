import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('tb_usuario')
export class UsuarioEntity {
  @PrimaryColumn({ length: 20 })
  user_id: string

  @PrimaryColumn()
  idtb_empresas: number

  @Column({ length: 150 })
  nome: string

  @Column({ length: 150, unique: true })
  email: string

  @Column()
  senha: string

  @Column({ nullable: true })
  foto: string
}
