import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { VinculacaoController } from './vinculacao.controller'
import { VinculacaoService } from './vinculacao.service'
import { DepartamentoEntity } from '../departamento/departamento.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DepartamentoEntity])],
  controllers: [VinculacaoController],
  providers: [VinculacaoService],
})
export class VinculacaoModule {}