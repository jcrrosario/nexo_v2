import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
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

  /* =====================================================
   * LISTAGEM (CRUD + GRID)
   * ===================================================== */
  async listar(
    idtb_empresas: number,
    page = 1,
    limit = 10,
    search = '',
  ) {
    const qb = this.repo.createQueryBuilder('u')

    qb.where('u.idtb_empresas = :idtb_empresas', { idtb_empresas })
      .andWhere('u.excluido = :excluido', { excluido: 'Não' })

    if (search) {
      qb.andWhere(
        '(LOWER(u.nome) LIKE :search OR LOWER(u.email) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      )
    }

    qb.orderBy('u.nome', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, total }
  }

  /* =====================================================
   * LOGIN (ENTITY AUTH)
   * ===================================================== */
  async findByLogin(user_id: string, idtb_empresas: number) {
    return this.repo.findOne({
      where: {
        user_id,
        idtb_empresas,
        excluido: 'Não',
      },
    })
  }

  /* =====================================================
   * CRIAÇÃO
   * ===================================================== */
  async criar(data: Partial<UsuarioEntity>) {
    if (!data.email || data.email.trim() === '') {
      throw new BadRequestException('O campo e-mail é obrigatório.')
    }

    if (!data.senha || data.senha.trim() === '') {
      throw new BadRequestException('O campo senha é obrigatório.')
    }

    data.senha = await bcrypt.hash(data.senha, 10)

    return this.repo.save(this.repo.create(data))
  }

  /* =====================================================
   * ATUALIZAÇÃO
   * ===================================================== */
  async atualizar(
    user_id: string,
    idtb_empresas: number,
    data: Partial<UsuarioEntity>,
  ) {
    if (!data.email || data.email.trim() === '') {
      throw new BadRequestException('O campo e-mail é obrigatório.')
    }

    const usuario = await this.repo.findOne({
      where: { user_id, idtb_empresas },
    })

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado')
    }

    delete data.senha // nunca atualiza senha aqui

    Object.assign(usuario, data)
    return this.repo.save(usuario)
  }

  /* =====================================================
   * EXCLUSÃO LÓGICA
   * ===================================================== */
  async excluir(
    user_id: string,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    const usuario = await this.repo.findOne({
      where: { user_id, idtb_empresas },
    })

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado')
    }

    usuario.excluido = 'Sim'
    usuario.ativo = 'Não'
    usuario.user_id_log = user_id_log

    return this.repo.save(usuario)
  }
}
