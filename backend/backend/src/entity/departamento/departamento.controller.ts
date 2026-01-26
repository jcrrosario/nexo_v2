import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common'
import { DepartamentoService } from './departamento.service'
import { EntityJwtGuard } from '../auth/entity-jwt.guard'

@Controller('entity/departamentos')
@UseGuards(EntityJwtGuard)
export class DepartamentoController {
  constructor(private readonly service: DepartamentoService) {}

  @Get()
  listar(
    @Req() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ) {
    return this.service.listar(
      req.user.idtb_empresas,
      Number(page),
      Number(limit),
      search,
    )
  }

  @Post()
  criar(@Req() req: any, @Body() body: any) {
    return this.service.criar({
      ...body,
      idtb_empresas: req.user.idtb_empresas,
      user_id_log: req.user.user_id,
    })
  }

  @Put(':id')
  atualizar(
    @Req() req: any,
    @Param('id') id: number,
    @Body() body: any,
  ) {
    return this.service.atualizar(id, req.user.idtb_empresas, {
      ...body,
      user_id_log: req.user.user_id,
    })
  }

  @Put(':id/excluir')
  excluir(@Req() req: any, @Param('id') id: number) {
    return this.service.excluir(
      id,
      req.user.idtb_empresas,
      req.user.user_id,
    )
  }
}
