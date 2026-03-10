import { Controller, Get, Param } from '@nestjs/common'
import { PermissoesService } from './permissoes.service'

@Controller('entity/permissoes')
export class PermissoesController {

  constructor(private readonly permissoesService: PermissoesService) {}

  @Get(':user_id')
  async getPermissoes(@Param('user_id') user_id: string) {
    return this.permissoesService.getPermissoesUsuario(user_id)
  }
}