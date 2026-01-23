import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { UsuarioEntity } from './usuario.entity'

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly repo: Repository<UsuarioEntity>,
  ) {}

  async findByLogin(user_id: string, idtb_empresas: number) {
    return this.repo.findOne({
      where: {
        user_id,
        idtb_empresas,
        ativo: 'Sim',
      },
    })
  }

  async listar(
    idtb_empresas: number,
    page: number,
    limit: number,
    search?: string,
  ) {
    const qb = this.repo.createQueryBuilder('u')

    qb.where('u.idtb_empresas = :idtb_empresas', { idtb_empresas })

    if (search && search.trim() !== '') {
      qb.andWhere(
        '(u.nome ILIKE :search OR u.email ILIKE :search)',
        { search: `%${search}%` },
      )
    }

    qb.orderBy('u.nome', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()

    return {
      data,
      total,
      page,
      limit,
    }
  }

  async criar(idtb_empresas: number, payload: any) {
    const senhaHash = await bcrypt.hash(payload.senha, 10)

    const usuario = this.repo.create({
      ...payload,
      senha: senhaHash,
      idtb_empresas,
      ativo: 'Sim',
    })

    return this.repo.save(usuario)
  }

  async atualizar(
    idtb_empresas: number,
    user_id: string,
    payload: any,
  ) {
    if (payload.senha) {
      payload.senha = await bcrypt.hash(payload.senha, 10)
    }

    await this.repo.update(
      { user_id, idtb_empresas },
      payload,
    )

    return { success: true }
  }

  async remover(idtb_empresas: number, user_id: string) {
    await this.repo.update(
      { user_id, idtb_empresas },
      { ativo: 'Não' },
    )

    return { success: true }
  }
}
