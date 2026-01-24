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

@Controller('entity/usuarios')
@UseGuards(EntityJwtGuard)
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

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
}
