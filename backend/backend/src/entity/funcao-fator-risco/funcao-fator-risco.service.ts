import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FuncaoFatorRiscoEntity } from './funcao-fator-risco.entity'

@Injectable()
export class FuncaoFatorRiscoService {
  constructor(
    @InjectRepository(FuncaoFatorRiscoEntity)
    private readonly repo: Repository<FuncaoFatorRiscoEntity>,
  ) {}

  async findAll(func_id: number, idtb_empresas: number) {
    return this.repo.find({
      where: {
        func_id,
        idtb_empresas,
        excluido: 'Nao',
      },
      order: { func_fator_id: 'ASC' },
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
    func_fator_id: number,
    dto: any,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    return this.repo.update(
      { func_fator_id, idtb_empresas },
      {
        ...dto,
        user_id_log,
      },
    )
  }

  async remove(
    func_fator_id: number,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    return this.repo.update(
      { func_fator_id, idtb_empresas },
      {
        excluido: 'Sim',
        user_id_log,
      },
    )
  }

  async findLog(func_fator_id: number, idtb_empresas: number) {
    return this.repo.findOne({
      where: { func_fator_id, idtb_empresas },
    })
  }
}