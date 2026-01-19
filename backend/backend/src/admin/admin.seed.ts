import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersNexoService } from '../users-nexo/users-nexo.service';

@Injectable()
export class AdminSeed implements OnModuleInit {
  constructor(private usersService: UsersNexoService) {}

  async onModuleInit() {
    const exists = await this.usersService.findByUserId('admin');

    if (!exists) {
      const hash = await bcrypt.hash('admin123', 10);

      await this.usersService.create({
        usernexo_id: 'admin',
        nome: 'Administrador NEXO',
        email: 'admin@nexo.com',
        senha: hash,
      });

      console.log('✔ Admin NEXO criado');
    }
  }
}
