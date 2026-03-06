import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FuncaoFatorRiscoEntity } from './funcao-fator-risco.entity'
import { FuncaoFatorRiscoService } from './funcao-fator-risco.service'
import { FuncaoFatorRiscoController } from './funcao-fator-risco.controller'

@Module({
  imports: [TypeOrmModule.forFeature([FuncaoFatorRiscoEntity])],
  controllers: [FuncaoFatorRiscoController],
  providers: [FuncaoFatorRiscoService],
})
export class FuncaoFatorRiscoModule {}