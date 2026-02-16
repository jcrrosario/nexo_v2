import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Pesquisa } from './pesquisa.entity'
import { PesquisaLancamento } from './pesquisa-lancamento.entity'
import { PesquisaResposta } from './pesquisa-resposta.entity'
import { PesquisaService } from './pesquisa.service'
import { PesquisaController } from './pesquisa.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pesquisa,
      PesquisaLancamento,
      PesquisaResposta,
    ]),
  ],
  controllers: [PesquisaController],
  providers: [PesquisaService],
})
export class PesquisaModule {}
