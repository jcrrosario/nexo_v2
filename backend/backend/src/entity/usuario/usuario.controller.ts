import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { UsuarioService } from './usuario.service'
import { EntityJwtGuard } from '../auth/entity-jwt.guard'

@UseGuards(EntityJwtGuard)
@Controller('entity/usuarios')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  @Get()
  listar(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.service.listar(
      req.user.idtb_empresas,
      Number(page),
      Number(limit),
      search,
    )
  }

  @Post()
  criar(@Req() req, @Body() body) {
    return this.service.criar(req.user.idtb_empresas, body)
  }

  @Put(':user_id')
  atualizar(
    @Req() req,
    @Param('user_id') user_id: string,
    @Body() body,
  ) {
    return this.service.atualizar(
      req.user.idtb_empresas,
      user_id,
      body,
    )
  }

  @Delete(':user_id')
  remover(@Req() req, @Param('user_id') user_id: string) {
    return this.service.remover(req.user.idtb_empresas, user_id)
  }
}
