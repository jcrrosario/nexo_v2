import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common'
import { FuncaoService } from './funcao.service'
import { EntityJwtGuard } from '../auth/entity-jwt.guard'

@UseGuards(EntityJwtGuard)
@Controller('entity/funcao')
export class FuncaoController {
  constructor(private readonly service: FuncaoService) {}

  @Get()
  findAll(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.service.findAll(
      req.user.idtb_empresas,
      Number(page),
      Number(limit),
      search,
    )
  }

  @Post()
  create(@Req() req, @Body() body) {
    return this.service.create(
      body,
      req.user.idtb_empresas,
      String(req.user.user_id),
    )
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: number, @Body() body) {
    return this.service.update(
      id,
      body,
      req.user.idtb_empresas,
      String(req.user.user_id),
    )
  }

  @Put(':id/excluir')
  excluir(@Req() req, @Param('id') id: number) {
    return this.service.remove(
      id,
      req.user.idtb_empresas,
      String(req.user.user_id),
    )
  }

  @Get(':id/log')
  log(@Req() req, @Param('id') id: number) {
    return this.service.findLog(id, req.user.idtb_empresas)
  }
}
