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
import { FuncionarioCatService } from './funcionario-cat.service'
import { EntityJwtGuard } from '../auth/entity-jwt.guard'

@UseGuards(EntityJwtGuard)
@Controller('entity/funcionario-cat')
export class FuncionarioCatController {
  constructor(private readonly service: FuncionarioCatService) {}

  @Get(':funcionario_id')
  findAll(@Req() req, @Param('funcionario_id') funcionario_id: number) {
    return this.service.findAll(funcionario_id, req.user.idtb_empresas)
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