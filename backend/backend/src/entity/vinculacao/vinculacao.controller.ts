import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common'
import { VinculacaoService } from './vinculacao.service'
import { EntityJwtGuard } from '../auth/entity-jwt.guard'

@Controller('entity/vinculacao')
@UseGuards(EntityJwtGuard)
export class VinculacaoController {
  constructor(private readonly service: VinculacaoService) {}

  @Get()
  listar(@Req() req) {
    return this.service.getHierarquia(req.user.idtb_empresas)
  }

  @Get('combos')
  combos(@Req() req) {
    return this.service.getCombos(req.user.idtb_empresas)
  }

  @Post()
  criar(@Req() req, @Body() body) {
    return this.service.criar(
      body,
      req.user.idtb_empresas,
      String(req.user.user_id),
    )
  }

  @Put(':id')
  atualizar(@Param('id') id: number, @Body() body, @Req() req) {
    return this.service.atualizar(
      Number(id),
      body,
      req.user.idtb_empresas,
      String(req.user.user_id),
    )
  }

  @Delete(':id')
  excluir(@Param('id') id: number, @Req() req) {
    return this.service.excluir(
      Number(id),
      req.user.idtb_empresas,
      String(req.user.user_id),
    )
  }
}
