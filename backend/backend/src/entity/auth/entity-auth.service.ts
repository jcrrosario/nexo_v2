import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsuarioService } from '../usuario/usuario.service'
import { EmpresaService } from '../empresa/empresa.service'

@Injectable()
export class EntityAuthService {
  constructor(
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private jwtService: JwtService,
  ) {}

  async login(user_id: string, idtb_empresas: number, senha: string) {
    const empresa = await this.empresaService.findById(idtb_empresas)

    if (!empresa || empresa.ativa === 'Não') {
      throw new UnauthorizedException(
        'A empresa informada esta com seu acesso bloqueado.',
      )
    }

    const user = await this.usuarioService.findByLogin(user_id, idtb_empresas)

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const match = await bcrypt.compare(senha, user.senha)

    if (!match) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const payload = {
      user_id: user.user_id,
      idtb_empresas: user.idtb_empresas,
      type: 'entity',
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
