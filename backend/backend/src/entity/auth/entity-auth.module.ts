import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { EntityAuthService } from './entity-auth.service'
import { EntityAuthController } from './entity-auth.controller'
import { EntityJwtStrategy } from './entity-jwt.strategy'
import { ENTITY_JWT_SECRET } from './entity-jwt.constants'
import { UsuarioModule } from '../usuario/usuario.module'
import { EmpresaModule } from '../empresa/empresa.module'

@Module({
  imports: [
    UsuarioModule,
    EmpresaModule,
    JwtModule.register({
      secret: ENTITY_JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [EntityAuthController],
  providers: [EntityAuthService, EntityJwtStrategy],
})
export class EntityAuthModule {}
