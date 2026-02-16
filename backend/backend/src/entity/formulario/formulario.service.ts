import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Formulario } from './formulario.entity'
import { Pergunta } from './pergunta.entity'
import { CategoriaEntity } from '../categoria/categoria.entity'

@Injectable()
export class FormularioService {
  constructor(
    @InjectRepository(Formulario)
    private repo: Repository<Formulario>,

    @InjectRepository(Pergunta)
    private perguntaRepo: Repository<Pergunta>,

    @InjectRepository(CategoriaEntity)
    private categoriaRepo: Repository<CategoriaEntity>,
  ) {}

  /* =========================
     FORMULÁRIOS
  ==========================*/

  async listar(
    empresaId: number,
    page: number,
    limit: number,
    search: string,
  ) {
    const [data, total] = await this.repo.findAndCount({
      where: {
        idtb_empresas: empresaId,
        excluido: 'NAO',
      },
      take: limit,
      skip: (page - 1) * limit,
      order: { form_id: 'DESC' },
    })

    return { data, total }
  }

  async buscarPorId(empresaId: number, id: number) {
    return this.repo.findOne({
      where: {
        form_id: id,
        idtb_empresas: empresaId,
        excluido: 'NAO',
      },
    })
  }

  async criar(user: any, body: any) {
    const novo = this.repo.create({
      nome: body.nome,
      descricao: body.descricao,
      idtb_empresas: user.idtb_empresas,
      user_id: user.user_id,
      user_id_log: user.user_id,
      excluido: 'NAO',
    })

    return this.repo.save(novo)
  }

  async atualizar(user: any, id: number, body: any) {
    await this.repo.update(
      { form_id: id, idtb_empresas: user.idtb_empresas },
      {
        nome: body.nome,
        descricao: body.descricao,
        user_id_log: user.user_id,
        updated_at: new Date(),
      },
    )

    return { message: 'OK' }
  }

  async excluir(user: any, id: number) {
    await this.repo.manager.transaction(async manager => {
      await manager.update(
        Formulario,
        { form_id: id, idtb_empresas: user.idtb_empresas },
        {
          excluido: 'SIM',
          user_id_log: user.user_id,
          updated_at: new Date(),
        },
      )

      await manager.update(
        Pergunta,
        { form_id: id },
        {
          excluido: 'SIM',
          user_id_log: user.user_id,
          updated_at: new Date(),
        },
      )
    })

    return { message: 'OK' }
  }

  /* =========================
     PERGUNTAS
  ==========================*/

  async listarPerguntas(empresaId: number, formId: number) {
    const perguntas = await this.perguntaRepo.find({
      where: {
        form_id: formId,
        excluido: 'NAO',
      },
      order: { ordem: 'ASC' },
    })

    return perguntas
  }

  async criarPergunta(user: any, formId: number, body: any) {
    const nova = this.perguntaRepo.create({
      form_id: formId,
      categ_id: body.categ_id,
      texto: body.texto,
      tipo_resposta: body.tipo_resposta || 'TEXTO',
      obrigatoria: body.obrigatoria || 'NAO',
      ordem: body.ordem ?? 0,
      user_id_log: user.user_id,
      excluido: 'NAO',
    })

    return this.perguntaRepo.save(nova)
  }

  async atualizarPergunta(
    user: any,
    perguntaId: number,
    body: any,
  ) {
    await this.perguntaRepo.update(
      { pergunta_id: perguntaId },
      {
        texto: body.texto,
        categ_id: body.categ_id,
        tipo_resposta: body.tipo_resposta || 'TEXTO',
        obrigatoria: body.obrigatoria || 'NAO',
        ordem: body.ordem ?? 0,
        user_id_log: user.user_id,
        updated_at: new Date(),
      },
    )

    return { message: 'OK' }
  }

  async excluirPergunta(user: any, perguntaId: number) {
    await this.perguntaRepo.update(
      { pergunta_id: perguntaId },
      {
        excluido: 'SIM',
        user_id_log: user.user_id,
        updated_at: new Date(),
      },
    )

    return { message: 'OK' }
  }
}
