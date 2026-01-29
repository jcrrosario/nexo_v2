import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { VinculacaoController } from './vinculacao.controller'
import { VinculacaoService } from './vinculacao.service'

import { Vinculacao } from './vinculacao.entity'
import { FuncaoEntity } from '../funcao/funcao.entity'
import { DepartamentoEntity } from '../departamento/departamento.entity'
import { UsuarioEntity } from '../usuario/usuario.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vinculacao,
      FuncaoEntity,
      DepartamentoEntity,
      UsuarioEntity,
    ]),
  ],
  controllers: [VinculacaoController],
  providers: [VinculacaoService],
})
export class VinculacaoModule {}
