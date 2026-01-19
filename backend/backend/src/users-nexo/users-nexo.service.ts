import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersNexo } from './users-nexo.entity';

@Injectable()
export class UsersNexoService {
  constructor(
    @InjectRepository(UsersNexo)
    private repo: Repository<UsersNexo>,
  ) {}

  findByUserId(usernexo_id: string) {
    return this.repo.findOne({ where: { usernexo_id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  create(data: Partial<UsersNexo>) {
    return this.repo.save(data);
  }
}
