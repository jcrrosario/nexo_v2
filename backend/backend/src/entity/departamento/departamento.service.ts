import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DepartamentoEntity } from './departamento.entity'

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectRepository(DepartamentoEntity)
    private readonly repo: Repository<DepartamentoEntity>,
  ) {}

  async listar(
    idtb_empresas: number,
    page = 1,
    limit = 10,
    search = '',
  ) {
    const qb = this.repo.createQueryBuilder('d')

    qb.where('d.idtb_empresas = :idtb_empresas', { idtb_empresas })
      .andWhere('d.excluido = :excluido', { excluido: 'Não' })

    if (search) {
      qb.andWhere('LOWER(d.nome) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      })
    }

    qb.orderBy('d.nome', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()

    return { data, total }
  }

  async criar(data: any) {
    return this.repo.save(this.repo.create(data))
  }

  async atualizar(dpto_id: number, idtb_empresas: number, data: any) {
    const dep = await this.repo.findOne({
      where: { dpto_id, idtb_empresas },
    })

    if (!dep) {
      throw new NotFoundException('Departamento não encontrado')
    }

    Object.assign(dep, data)
    return this.repo.save(dep)
  }

  async excluir(dpto_id: number, idtb_empresas: number, user_id_log: string) {
    const dep = await this.repo.findOne({
      where: { dpto_id, idtb_empresas },
    })

    if (!dep) {
      throw new NotFoundException('Departamento não encontrado')
    }

    dep.excluido = 'Sim'
    dep.user_id_log = user_id_log
    return this.repo.save(dep)
  }
}
