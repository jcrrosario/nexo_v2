import { Controller, Get, Param } from '@nestjs/common'
import { PesquisaRelatorioService } from './pesquisa-relatorio.service'

@Controller('entity/pesquisas')
export class PesquisaRelatorioController {

  constructor(private service:PesquisaRelatorioService){}

  @Get(':id/relatorio')
  async relatorio(@Param('id') id:number){

    return this.service.obterDados(Number(id))

  }

}