import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('tb_rotina')
export class RotinaEntity {

  @PrimaryColumn({ length: 50 })
  rotina_id: string

  @Column({ length: 100 })
  codigo: string

  @Column({ length: 150 })
  nome: string

}