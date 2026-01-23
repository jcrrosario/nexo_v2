import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsuarioService } from '../usuario/usuario.service'
import { EmpresaService } from '../empresa/empresa.service'

@Injectable()
export class EntityAuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly empresaService: EmpresaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    user_id: string,
    idtb_empresas: number,
    senha: string,
  ) {
    const empresa = await this.empresaService.findById(idtb_empresas)

    if (!empresa || empresa.ativa === 'Não') {
      throw new UnauthorizedException(
        'A empresa informada esta com seu acesso bloqueado.',
      )
    }

    const usuario = await this.usuarioService.findByLogin(
      user_id,
      Number(idtb_empresas), // garante number
    )

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const match = await bcrypt.compare(senha, usuario.senha)

    if (!match) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const payload = {
      user_id: usuario.user_id,
      idtb_empresas: usuario.idtb_empresas,
      type: 'entity',
    }

    return {
      access_token: this.jwtService.sign(payload),
      empresa: {
        nome_fantasia: empresa.nome_fantasia,
      },
      usuario: {
        nome: usuario.nome,
      },
    }
  }
}
