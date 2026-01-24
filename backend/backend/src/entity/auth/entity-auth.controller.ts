import { Controller, Post, Body } from '@nestjs/common'
import { EntityAuthService } from './entity-auth.service'

@Controller('entity/auth')
export class EntityAuthController {
  constructor(private readonly service: EntityAuthService) {}

  @Post('login')
  login(
    @Body('user_id') user_id: string,
    @Body('idtb_empresas') idtb_empresas: number,
    @Body('senha') senha: string,
  ) {
    return this.service.login(
      user_id,
      Number(idtb_empresas),
      senha,
    )
  }
}
