import {
  Controller,
  Get,
  Post,
  Body,
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
  async combos(@Req() req) {
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
}
