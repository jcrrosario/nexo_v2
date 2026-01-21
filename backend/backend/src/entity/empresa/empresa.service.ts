import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EmpresaEntity } from './empresa.entity'

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(EmpresaEntity)
    private repo: Repository<EmpresaEntity>,
  ) {}

  findById(empresa_id: number) {
    return this.repo.findOne({ where: { empresa_id } })
  }

  async gerarEmpresaId() {
    const ano = new Date().getFullYear()
    const ultimo = await this.repo
      .createQueryBuilder('e')
      .where('e.empresa_id::text LIKE :ano', { ano: `${ano}%` })
      .orderBy('e.empresa_id', 'DESC')
      .getOne()

    const sequencial = ultimo
      ? Number(String(ultimo.empresa_id).slice(4)) + 1
      : 1

    return Number(`${ano}${String(sequencial).padStart(4, '0')}`)
  }
}
