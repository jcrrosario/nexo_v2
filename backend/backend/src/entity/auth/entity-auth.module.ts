import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { EntityAuthService } from './entity-auth.service'
import { EntityAuthController } from './entity-auth.controller'
import { EntityJwtStrategy } from './entity-jwt.strategy'
import { ENTITY_JWT_SECRET } from './entity-jwt.constants'
import { UsuarioModule } from '../usuario/usuario.module'

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: ENTITY_JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [EntityAuthService, EntityJwtStrategy],
  controllers: [EntityAuthController],
})
export class EntityAuthModule {}
