import { Injectable, BadRequestException } from '@nestjs/common'
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

  /* ======================================================
   * LOGIN
   * ====================================================== */
  async findByLogin(user_id: string, idtb_empresas: number) {
    return this.repo.findOne({
      where: {
        user_id,
        idtb_empresas,
        ativo: 'Sim',
      },
    })
  }

  /* ======================================================
   * LISTAGEM (com paginação + busca)
   * ====================================================== */
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

  /* ======================================================
   * CRIAÇÃO
   * ====================================================== */
  async criar(idtb_empresas: number, payload: any) {
    if (!payload.senha || payload.senha.trim() === '') {
      throw new BadRequestException('Senha é obrigatória')
    }

    const senhaHash = await bcrypt.hash(payload.senha, 10)

    const usuario = this.repo.create({
      user_id: payload.user_id,
      nome: payload.nome,
      email: payload.email,
      senha: senhaHash,
      perfil: payload.perfil || 'Usuario',
      ativo: payload.ativo || 'Sim',
      foto: payload.foto || null,
      idtb_empresas,
    })

    return this.repo.save(usuario)
  }

  /* ======================================================
   * ATUALIZAÇÃO
   * ====================================================== */
  async atualizar(
    idtb_empresas: number,
    user_id: string,
    payload: any,
  ) {
    const dados: any = {
      nome: payload.nome,
      email: payload.email,
      perfil: payload.perfil,
      ativo: payload.ativo,
      foto: payload.foto,
    }

    // senha é OPCIONAL no update
    if (payload.senha && payload.senha.trim() !== '') {
      dados.senha = await bcrypt.hash(payload.senha, 10)
    }

    await this.repo.update(
      { user_id, idtb_empresas },
      dados,
    )

    return { success: true }
  }

  /* ======================================================
   * REMOÇÃO LÓGICA
   * ====================================================== */
  async remover(idtb_empresas: number, user_id: string) {
    await this.repo.update(
      { user_id, idtb_empresas },
      { ativo: 'Não' },
    )

    return { success: true }
  }
}
