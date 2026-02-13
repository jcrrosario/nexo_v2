import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoriaEntity } from './categoria.entity'

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(CategoriaEntity)
    private readonly repo: Repository<CategoriaEntity>,
  ) {}

  async findAll(
    idtb_empresas: number,
    page = 1,
    limit = 10,
    search = '',
  ) {
    const qb = this.repo
      .createQueryBuilder('c')
      .where('c.idtb_empresas = :idtb_empresas', { idtb_empresas })
      .andWhere('c.excluido = :excluido', { excluido: 'Nao' })

    if (search) {
      qb.andWhere('LOWER(c.nome) LIKE LOWER(:search)', {
        search: `%${search}%`,
      })
    }

    qb
      .orderBy('c.nome', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, total }
  }

  async create(
    dto: any,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    const entity = this.repo.create({
      ...dto,
      idtb_empresas,
      user_id_log,
      excluido: 'Nao',
    })

    return this.repo.save(entity)
  }

  async update(
    categ_id: number,
    dto: any,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    return this.repo.update(
      { categ_id, idtb_empresas },
      {
        ...dto,
        user_id_log,
      },
    )
  }

  async remove(
    categ_id: number,
    idtb_empresas: number,
    user_id_log: string,
  ) {
    return this.repo.update(
      { categ_id, idtb_empresas },
      {
        excluido: 'Sim',
        user_id_log,
      },
    )
  }

  async findLog(categ_id: number, idtb_empresas: number) {
    return this.repo.findOne({
      where: { categ_id, idtb_empresas },
    })
  }
}
