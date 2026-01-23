import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Express } from 'express'

import { UsuarioService } from './usuario.service'
import { EntityJwtGuard } from '../auth/entity-jwt.guard'
import { usuarioUploadConfig } from './usuario-upload.config'

@UseGuards(EntityJwtGuard)
@Controller('entity/usuarios')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}

  /* ======================================================
   * LISTAGEM
   * ====================================================== */
  @Get()
  listar(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    return this.service.listar(
      req.user.idtb_empresas,
      Number(page),
      Number(limit),
      search,
    )
  }

  /* ======================================================
   * CRIAÇÃO
   * ====================================================== */
  @Post()
  criar(@Req() req, @Body() body) {
    return this.service.criar(req.user.idtb_empresas, body)
  }

  /* ======================================================
   * UPLOAD DE FOTO
   * ====================================================== */
  @Post('upload-foto')
  @UseInterceptors(
    FileInterceptor('file', usuarioUploadConfig),
  )
  uploadFoto(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      url: `/uploads/empresas/${req.user.idtb_empresas}/usuarios/${file.filename}`,
    }
  }

  /* ======================================================
   * ATUALIZAÇÃO
   * ====================================================== */
  @Put(':user_id')
  atualizar(
    @Req() req,
    @Param('user_id') user_id: string,
    @Body() body,
  ) {
    return this.service.atualizar(
      req.user.idtb_empresas,
      user_id,
      body,
    )
  }

  /* ======================================================
   * REMOÇÃO LÓGICA
   * ====================================================== */
  @Delete(':user_id')
  remover(@Req() req, @Param('user_id') user_id: string) {
    return this.service.remover(req.user.idtb_empresas, user_id)
  }
}
