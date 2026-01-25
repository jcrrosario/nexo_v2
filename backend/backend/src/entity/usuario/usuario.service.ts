import { Injectable, NotFoundException } from '@nestjs/common'
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

  async listar(
    idtb_empresas: number,
    page: number,
    limit: number,
    search?: string,
  ) {
    const qb = this.repo.createQueryBuilder('u')

    qb.where('u.idtb_empresas = :empresa', { empresa: idtb_empresas })
    qb.andWhere('u.excluido = :excluido', { excluido: 'Não' })

    if (search) {
      qb.andWhere(
        '(u.nome ILIKE :search OR u.email ILIKE :search)',
        { search: `%${search}%` },
      )
    }

    qb.skip((page - 1) * limit)
    qb.take(limit)
    qb.orderBy('u.nome', 'ASC')

    const [data, total] = await qb.getManyAndCount()

    return { data, total }
  }

  async findByLogin(user_id: string, idtb_empresas: number) {
    return this.repo.findOne({
      where: {
        user_id,
        idtb_empresas,
        ativo: 'Sim',
        excluido: 'Não',
      },
    })
  }

  async criar(data: any) {
    // 🔐 criptografa a senha SEMPRE
    if (data.senha) {
      const salt = await bcrypt.genSalt(10)
      data.senha = await bcrypt.hash(data.senha, salt)
    }

    const usuario = this.repo.create(data)
    return this.repo.save(usuario)
  }

  async atualizar(
    user_id: string,
    idtb_empresas: number,
    data: any,
  ) {
    const usuario = await this.repo.findOne({
      where: { user_id, idtb_empresas },
    })

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado')
    }

    // ⚠️ senha não é alterada aqui
    delete data.senha

    Object.assign(usuario, data)
    return this.repo.save(usuario)
  }

  async excluir(
    user_id: string,
    idtb_empresas: number,
    userLog: string,
  ) {
    const usuario = await this.repo.findOne({
      where: { user_id, idtb_empresas },
    })

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado')
    }

    usuario.ativo = 'Não'
    usuario.excluido = 'Sim'
    usuario.user_id_log = userLog

    return this.repo.save(usuario)
  }
}
