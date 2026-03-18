import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FuncionarioCatEntity } from './funcionario-cat.entity'

@Injectable()
export class FuncionarioCatService {
  constructor(
    @InjectRepository(FuncionarioCatEntity)
    private readonly repo: Repository<FuncionarioCatEntity>,
  ) {}

  async findAll(funcionario_id: number, idtb_empresas: number) {
    return this.repo.find({
      where: {
        funcionario_id,
        idtb_empresas,
        excluido: 'Nao',
      },
      order: { func_cat_id: 'ASC' },
    })
  }

  async create(dto: any, idtb_empresas: number, user_id_log: string) {
    const entity = this.repo.create({
      ...dto,
      idtb_empresas,
      user_id_log,
      excluido: 'Nao',
    })

    return this.repo.save(entity)
  }

  async update(
    func_cat_id: number,
    dto: any,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    return this.repo.update(
      { func_cat_id, idtb_empresas },
      {
        ...dto,
        user_id_log,
      },
    )
  }

  async remove(
    func_cat_id: number,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    return this.repo.update(
      { func_cat_id, idtb_empresas },
      {
        excluido: 'Sim',
        user_id_log,
      },
    )
  }

  async findLog(func_cat_id: number, idtb_empresas: number) {
    return this.repo.findOne({
      where: { func_cat_id, idtb_empresas },
    })
  }
}