import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common'
import { EntityAuthService } from './entity-auth.service'
import { EntityJwtGuard } from './entity-jwt.guard'
import { EmpresaService } from '../empresa/empresa.service'

@Controller('entity/auth')
export class EntityAuthController {
  constructor(
    private readonly service: EntityAuthService,
    private readonly empresaService: EmpresaService,
  ) {}

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

  @UseGuards(EntityJwtGuard)
  @Get('me')
  async me(@Req() req) {
    const empresa = await this.empresaService.findById(
      req.user.idtb_empresas,
    )

    return {
      idtb_empresas: req.user.idtb_empresas,
      nome: empresa?.razao_social || null,
    }
  }
}
