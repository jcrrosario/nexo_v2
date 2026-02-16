import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Pesquisa } from './pesquisa.entity'
import { PesquisaLancamento } from './pesquisa-lancamento.entity'
import { PesquisaResposta } from './pesquisa-resposta.entity'

@Injectable()
export class PesquisaService {
  constructor(
    @InjectRepository(Pesquisa)
    private pesquisaRepo: Repository<Pesquisa>,

    @InjectRepository(PesquisaLancamento)
    private lancRepo: Repository<PesquisaLancamento>,

    @InjectRepository(PesquisaResposta)
    private respRepo: Repository<PesquisaResposta>,
  ) {}

  /* =========================
     LISTAR PESQUISAS
  ==========================*/

  async listar(
    empresaId: number,
    page: number,
    limit: number,
  ) {
    const [data, total] = await this.pesquisaRepo.findAndCount({
      where: {
        idtb_empresas: empresaId,
        excluido: 'NAO',
      },
      take: limit,
      skip: (page - 1) * limit,
      order: { pesq_id: 'DESC' },
    })

    return { data, total }
  }

  /* =========================
     BUSCAR PESQUISA POR ID
  ==========================*/

  async buscarPorId(
    empresaId: number,
    id: number,
  ) {
    return this.pesquisaRepo.findOne({
      where: {
        pesq_id: id,
        idtb_empresas: empresaId,
        excluido: 'NAO',
      },
    })
  }

  /* =========================
     CRIAR PESQUISA
  ==========================*/

  async criar(user: any, body: any) {
    const nova = this.pesquisaRepo.create({
      idtb_empresas: user.idtb_empresas,
      form_id: body.form_id,
      data_inicial: body.data_inicial,
      data_final: body.data_final,
      observacoes: body.observacoes,
      user_id_log: user.user_id,
      excluido: 'NAO',
    })

    return this.pesquisaRepo.save(nova)
  }

  /* =========================
     EXCLUIR PESQUISA (LÓGICA)
  ==========================*/

  async excluir(user: any, id: number) {
    await this.pesquisaRepo.update(
      { pesq_id: id, idtb_empresas: user.idtb_empresas },
      {
        excluido: 'SIM',
        user_id_log: user.user_id,
        updated_at: new Date(),
      },
    )

    return { message: 'OK' }
  }

  /* =========================
     CRIAR LANÇAMENTO
  ==========================*/

  async criarLancamento(user: any, body: any) {
    const lanc = await this.lancRepo.save({
      pesq_id: body.pesq_id,
      dpto_id: body.dpto_id,
      func_id: body.func_id,
      user_id: user.user_id,
    })

    for (const r of body.respostas) {
      await this.respRepo.save({
        lanc_id: lanc.lanc_id,
        pergunta_id: r.pergunta_id,
        resposta_numero: r.resposta_numero,
        user_id: user.user_id,
      })
    }

    return { message: 'OK' }
  }

  /* =========================
     LISTAR LANÇAMENTOS DA PESQUISA
  ==========================*/

  async listarLancamentos(pesqId: number) {
    const lancamentos = await this.lancRepo.find({
      where: { pesq_id: pesqId },
      order: { lanc_id: 'ASC' },
    })

    const resultado: any[] = []

    for (const lanc of lancamentos) {
      const respostas = await this.respRepo.find({
        where: { lanc_id: lanc.lanc_id },
      })

      resultado.push({
        ...lanc,
        respostas,
      })
    }

    return resultado
  }

  /* =========================
     EXCLUIR LANÇAMENTO (FÍSICO)
  ==========================*/

  async excluirLancamento(id: number) {
    await this.lancRepo.delete({ lanc_id: id })
    return { message: 'OK' }
  }
}
