import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersNexoService } from '../../users-nexo/users-nexo.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private usersService: UsersNexoService,
    private jwtService: JwtService,
  ) {}

  async login(usernexo_id: string, senha: string) {
    const user = await this.usersService.findByUserId(usernexo_id);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const match = await bcrypt.compare(senha, user.senha);

    if (!match) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.usernexo_id,
      email: user.email,
      type: 'admin',
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
