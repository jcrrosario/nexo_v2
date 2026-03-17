import { Controller, Get, Req, UseGuards } from '@nestjs/common'
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
}