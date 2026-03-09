import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Pesquisa } from './pesquisa.entity'
import { PesquisaLancamento } from './pesquisa-lancamento.entity'
import { PesquisaResposta } from './pesquisa-resposta.entity'
import { Formulario } from '../formulario/formulario.entity'

import { PesquisaService } from './pesquisa.service'
import { PesquisaController } from './pesquisa.controller'

import { PesquisaRelatorioService } from './pesquisa-relatorio.service'
import { PesquisaRelatorioController } from './pesquisa-relatorio.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pesquisa,
      PesquisaLancamento,
      PesquisaResposta,
      Formulario,
    ]),
  ],
  controllers: [
    PesquisaController,
    PesquisaRelatorioController
  ],
  providers: [
    PesquisaService,
    PesquisaRelatorioService
  ],
})
export class PesquisaModule {}