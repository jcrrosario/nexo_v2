import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'

import { UsuarioService } from './usuario.service'
import { EntityJwtGuard } from '../auth/entity-jwt.guard'
import { PermissionGuard } from '../auth/permission.guard'
import { Permissao } from '../auth/permission.decorator'

@Controller('entity/usuarios')
@UseGuards(EntityJwtGuard, PermissionGuard)
export class UsuarioController {

  constructor(private readonly service: UsuarioService) {}

  @Permissao('CAD_USUARIO','consultar')
  @Get()
  listar(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {

    const { idtb_empresas } = req.user

    return this.service.listar(
      Number(idtb_empresas),
      +page,
      +limit,
      search,
    )
  }

  @Permissao('CAD_USUARIO','incluir')
  @Post()
  criar(
    @Req() req: any,
    @Body() body: any,
  ) {

    const { idtb_empresas, user_id } = req.user

    return this.service.criar({
      ...body,
      idtb_empresas,
      user_id_log: user_id,
    })
  }

  @Permissao('CAD_USUARIO','alterar')
  @Put(':user_id')
  atualizar(
    @Req() req: any,
    @Param('user_id') user_id: string,
    @Body() body: any,
  ) {

    const { idtb_empresas, user_id: userLog } = req.user

    return this.service.atualizar(
      user_id,
      Number(idtb_empresas),
      {
        ...body,
        user_id_log: userLog,
      },
    )
  }

  @Permissao('CAD_USUARIO','excluir')
  @Put(':user_id/excluir')
  excluir(
    @Req() req: any,
    @Param('user_id') user_id: string,
  ) {

    const { idtb_empresas, user_id: userLog } = req.user

    return this.service.excluir(
      user_id,
      Number(idtb_empresas),
      userLog,
    )
  }

  /* =====================================================
   * LISTAR PERMISSÕES DO USUÁRIO
   * ===================================================== */

  @Permissao('CAD_USUARIO','alterar')
  @Get(':user_id/permissoes')
  listarPermissoes(
    @Req() req: any,
    @Param('user_id') user_id: string,
  ) {

    const { idtb_empresas } = req.user

    return this.service.listarPermissoes(
      user_id,
      Number(idtb_empresas),
    )
  }

  /* =====================================================
   * SALVAR PERMISSÕES DO USUÁRIO
   * ===================================================== */

  @Permissao('CAD_USUARIO','alterar')
  @Post(':user_id/permissoes')
  salvarPermissoes(
    @Req() req: any,
    @Param('user_id') user_id: string,
    @Body() permissoes: any[],
  ) {

    const { idtb_empresas } = req.user

    return this.service.salvarPermissoes(
      user_id,
      Number(idtb_empresas),
      permissoes,
    )
  }

}