import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsuarioEntity } from './usuario.entity'

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private repo: Repository<UsuarioEntity>,
  ) {}

  findByLogin(user_id: string, idtb_empresas: number) {
    return this.repo.findOne({
      where: { user_id, idtb_empresas },
    })
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } })
  }
}
