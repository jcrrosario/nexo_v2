import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UsuarioPermissaoEntity } from '../permissao/usuario-permissao.entity'
import { PERMISSION_KEY } from './permission.decorator'

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private reflector: Reflector,

    @InjectRepository(UsuarioPermissaoEntity)
    private repo: Repository<UsuarioPermissaoEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const permission = this.reflector.get(
      PERMISSION_KEY,
      context.getHandler(),
    )

    if (!permission) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user

    /* ===============================
       ADMINISTRADOR TEM ACESSO TOTAL
    =============================== */

    if (user.perfil === 'Administrador') {
      return true
    }

    const registro = await this.repo.findOne({
      where: {
        user_id: user.user_id,
        idtb_empresas: user.idtb_empresas,
        rotina_id: permission.rotina,
      },
    })

    if (!registro) {
      throw new ForbiddenException(
        `${user.user_id}, você não possui acesso a esta rotina.`,
      )
    }

    const acao = permission.acao

    if (acao === 'incluir' && !registro.pode_incluir) {
      throw new ForbiddenException(
        `${user.user_id}, você não possui permissão para incluir registros.`,
      )
    }

    if (acao === 'alterar' && !registro.pode_alterar) {
      throw new ForbiddenException(
        `${user.user_id}, você não possui permissão para alterar registros.`,
      )
    }

    if (acao === 'excluir' && !registro.pode_excluir) {
      throw new ForbiddenException(
        `${user.user_id}, você não possui permissão para excluir registros.`,
      )
    }

    if (acao === 'relatorio' && !registro.pode_relatorio) {
      throw new ForbiddenException(
        `${user.user_id}, você não possui permissão para emitir relatórios.`,
      )
    }

    return true
  }
}