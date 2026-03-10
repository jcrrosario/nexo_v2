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
   * LISTAGEM
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
   * LOGIN
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

    // 🔒 valida e-mail duplicado na mesma empresa
    const emailExistente = await this.repo.findOne({
      where: {
        email: data.email,
        idtb_empresas: data.idtb_empresas,
        excluido: 'Não',
      },
    })

    if (emailExistente) {
      throw new BadRequestException(
        'Já existe um usuário cadastrado com este e-mail.',
      )
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

    // 🔒 valida e-mail duplicado (ignorando o próprio usuário)
    const emailExistente = await this.repo.findOne({
      where: {
        email: data.email,
        idtb_empresas,
        excluido: 'Não',
      },
    })

    if (emailExistente && emailExistente.user_id !== user_id) {
      throw new BadRequestException(
        'Já existe um usuário cadastrado com este e-mail.',
      )
    }

    delete data.senha

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

  /* =====================================================
   * LISTAR PERMISSÕES
   * ===================================================== */
  async listarPermissoes(user_id: string, idtb_empresas: number) {

    const rotinas = await this.repo.manager.query(`
      SELECT
        r.rotina_id,
        r.nome,
        COALESCE(p.pode_incluir,false)  as pode_incluir,
        COALESCE(p.pode_alterar,false)  as pode_alterar,
        COALESCE(p.pode_excluir,false)  as pode_excluir,
        COALESCE(p.pode_relatorio,false) as pode_relatorio
      FROM tb_rotina r
      LEFT JOIN tb_usuario_permissao p
        ON p.rotina_id = r.rotina_id
        AND p.user_id = $1
        AND p.idtb_empresas = $2
      ORDER BY r.nome
    `,[user_id,idtb_empresas])

    return rotinas

  }

  /* =====================================================
   * SALVAR PERMISSÕES
   * ===================================================== */
  async salvarPermissoes(
    user_id: string,
    idtb_empresas: number,
    permissoes: any[],
  ) {

    await this.repo.manager.query(
      `DELETE FROM tb_usuario_permissao
       WHERE user_id = $1
       AND idtb_empresas = $2`,
      [user_id,idtb_empresas]
    )

    for (const p of permissoes) {

      await this.repo.manager.query(`
        INSERT INTO tb_usuario_permissao
        (permissao_id,user_id,idtb_empresas,rotina_id,pode_incluir,pode_alterar,pode_excluir,pode_relatorio)
        VALUES
        (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7)
      `,[
        user_id,
        idtb_empresas,
        p.rotina_id,
        p.pode_incluir,
        p.pode_alterar,
        p.pode_excluir,
        p.pode_relatorio
      ])

    }

    return { message: 'Permissões atualizadas com sucesso.' }

  }

}
