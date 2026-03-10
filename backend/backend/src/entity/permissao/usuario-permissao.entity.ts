import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('tb_usuario_permissao')
export class UsuarioPermissaoEntity {

  @PrimaryColumn({ length: 50 })
  permissao_id: string

  @Column({ length: 50 })
  user_id: string

  @Column()
  idtb_empresas: number

  @Column({ length: 50 })
  rotina_id: string

  @Column({ default: false })
  pode_incluir: boolean

  @Column({ default: false })
  pode_alterar: boolean

  @Column({ default: false })
  pode_excluir: boolean

  @Column({ default: false })
  pode_relatorio: boolean

}