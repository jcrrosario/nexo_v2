import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common'
import { FuncaoFatorRiscoService } from './funcao-fator-risco.service'
import { EntityJwtGuard } from '../auth/entity-jwt.guard'

@UseGuards(EntityJwtGuard)
@Controller('entity/funcao-fator')
export class FuncaoFatorRiscoController {
  constructor(private readonly service: FuncaoFatorRiscoService) {}

  @Get(':func_id')
  findAll(@Req() req, @Param('func_id') func_id: number) {
    return this.service.findAll(func_id, req.user.idtb_empresas)
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