import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersNexoModule } from '../../users-nexo/users-nexo.module';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AdminJwtStrategy } from './admin-jwt.strategy';
import { ADMIN_JWT_SECRET } from './admin-jwt.constants';

@Module({
  imports: [
    UsersNexoModule,
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    JwtModule.register({
      secret: ADMIN_JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AdminAuthService, AdminJwtStrategy],
  controllers: [AdminAuthController],
})
export class AdminAuthModule {}
