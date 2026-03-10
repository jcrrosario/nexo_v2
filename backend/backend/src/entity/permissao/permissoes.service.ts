import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsuarioPermissaoEntity } from './usuario-permissao.entity'

@Injectable()
export class PermissoesService {

  constructor(
    @InjectRepository(UsuarioPermissaoEntity)
    private readonly permissaoRepository: Repository<UsuarioPermissaoEntity>,
  ) {}

  async getPermissoesUsuario(user_id: string) {

    const permissoes = await this.permissaoRepository.find({
      where: { user_id }
    })

    return permissoes.map(p => ({
      routine: p.rotina_id,

      // no seu sistema view = acesso à rotina
      canView: true,

      canCreate: p.pode_incluir,
      canEdit: p.pode_alterar,
      canDelete: p.pode_excluir
    }))
  }
}