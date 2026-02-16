import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { EntityJwtGuard } from '../auth/entity-jwt.guard'
import { PesquisaService } from './pesquisa.service'

@UseGuards(EntityJwtGuard)
@Controller('entity/pesquisas')
export class PesquisaController {
  constructor(private readonly service: PesquisaService) {}

  @Get()
  async listar(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.service.listar(
      req.user.idtb_empresas,
      Number(page),
      Number(limit),
    )
  }

  // 🔥 ROTA ESPECÍFICA PRIMEIRO
  @Get(':id/lancamentos')
  async listarLancamentos(@Param('id') id: number) {
    return this.service.listarLancamentos(Number(id))
  }

  @Get(':id')
  async buscarPorId(@Req() req, @Param('id') id: number) {
    return this.service.buscarPorId(
      req.user.idtb_empresas,
      Number(id),
    )
  }

  @Post()
  async criar(@Req() req, @Body() body) {
    return this.service.criar(req.user, body)
  }

  @Put(':id/excluir')
  async excluir(@Req() req, @Param('id') id: number) {
    return this.service.excluir(
      req.user,
      Number(id),
    )
  }

  @Post('lancamento')
  async criarLancamento(@Req() req, @Body() body) {
    return this.service.criarLancamento(
      req.user,
      body,
    )
  }

  @Put('lancamento/:id/excluir')
  async excluirLancamento(@Param('id') id: number) {
    return this.service.excluirLancamento(
      Number(id),
    )
  }
}
