import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { EntityAuthService } from './entity-auth.service'
import { EntityJwtGuard } from './entity-jwt.guard'

@Controller('entity/auth')
export class EntityAuthController {
  constructor(private readonly authService: EntityAuthService) {}

  @Post('login')
  login(
    @Body()
    body: { user_id: string; idtb_empresas: number; senha: string },
  ) {
    return this.authService.login(
      body.user_id,
      body.idtb_empresas,
      body.senha,
    )
  }

  @UseGuards(EntityJwtGuard)
  @Get('me')
  me(@Req() req) {
    return req.user
  }
}
