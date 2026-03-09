import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class PesquisaRelatorioService {

  constructor(private dataSource: DataSource) {}

  async obterDados(pesqId:number){

    const dados = await this.dataSource.query(`

      SELECT
        d.nome as departamento,
        f.nome as funcao,
        p.texto as pergunta,
        AVG(r.resposta_numero) as media

      FROM tb_pesquisa_resposta r
      JOIN tb_pesquisa_lancamento l ON l.lanc_id = r.lanc_id
      JOIN tb_pergunta p ON p.pergunta_id = r.pergunta_id
      JOIN tb_departamentos d ON d.dpto_id = l.dpto_id
      JOIN tb_funcao f ON f.func_id = l.func_id

      WHERE l.pesq_id = $1

      GROUP BY
        d.nome,
        f.nome,
        p.pergunta_id,
        p.texto

      ORDER BY
        d.nome,
        f.nome,
        p.pergunta_id

    `,[pesqId])

    return dados
  }

}