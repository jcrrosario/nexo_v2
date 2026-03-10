import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsuarioPermissaoEntity } from './usuario-permissao.entity'
import { RotinaEntity } from './rotina.entity'
import { PermissoesService } from './permissoes.service'
import { PermissoesController } from './permissoes.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsuarioPermissaoEntity,
      RotinaEntity,
    ]),
  ],
  providers: [PermissoesService],
  controllers: [PermissoesController],
  exports: [TypeOrmModule],
})
export class PermissaoModule {}