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
import { FormularioService } from './formulario.service'

@UseGuards(EntityJwtGuard)
@Controller('entity/formularios')
export class FormularioController {
  constructor(private readonly service: FormularioService) {}

  @Get()
  async listar(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.service.listar(
      req.user.idtb_empresas,
      Number(page),
      Number(limit),
      search,
    )
  }

  // 🔥 NOVO - buscar formulário por id
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

  @Put(':id')
  async atualizar(@Req() req, @Param('id') id: number, @Body() body) {
    return this.service.atualizar(
      req.user,
      Number(id),
      body,
    )
  }

  @Put(':id/excluir')
  async excluir(@Req() req, @Param('id') id: number) {
    return this.service.excluir(
      req.user,
      Number(id),
    )
  }

  @Get(':id/perguntas')
  async listarPerguntas(@Req() req, @Param('id') id: number) {
    return this.service.listarPerguntas(
      req.user.idtb_empresas,
      Number(id),
    )
  }

  @Post(':id/perguntas')
  async criarPergunta(
    @Req() req,
    @Param('id') id: number,
    @Body() body,
  ) {
    return this.service.criarPergunta(
      req.user,
      Number(id),
      body,
    )
  }

  @Put('perguntas/:perguntaId')
  async atualizarPergunta(
    @Req() req,
    @Param('perguntaId') perguntaId: number,
    @Body() body,
  ) {
    return this.service.atualizarPergunta(
      req.user,
      Number(perguntaId),
      body,
    )
  }

  @Put('perguntas/:perguntaId/excluir')
  async excluirPergunta(
    @Req() req,
    @Param('perguntaId') perguntaId: number,
  ) {
    return this.service.excluirPergunta(
      req.user,
      Number(perguntaId),
    )
  }
}
