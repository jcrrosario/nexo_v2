import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FatorEntity } from './fator.entity'

@Injectable()
export class FatorService {
  constructor(
    @InjectRepository(FatorEntity)
    private readonly repo: Repository<FatorEntity>,
  ) {}

  async findAll(
    idtb_empresas: number,
    page = 1,
    limit = 10,
    search = '',
  ) {
    const qb = this.repo
      .createQueryBuilder('f')
      .where('f.idtb_empresas = :idtb_empresas', { idtb_empresas })
      .andWhere('f.excluido = :excluido', { excluido: 'Nao' })

    if (search) {
      qb.andWhere('LOWER(f.nome) LIKE LOWER(:search)', {
        search: `%${search}%`,
      })
    }

    qb
      .orderBy('f.nome', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, total }
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
    fator_id: number,
    dto: any,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    return this.repo.update(
      { fator_id, idtb_empresas },
      {
        ...dto,
        user_id_log,
      },
    )
  }

  async remove(
    fator_id: number,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    return this.repo.update(
      { fator_id, idtb_empresas },
      {
        excluido: 'Sim',
        user_id_log,
      },
    )
  }

  async findLog(fator_id: number, idtb_empresas: number) {
    return this.repo.findOne({
      where: { fator_id, idtb_empresas },
    })
  }
}
