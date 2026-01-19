import { Module } from '@nestjs/common';
import { UsersNexoModule } from '../users-nexo/users-nexo.module';
import { AdminSeed } from './admin.seed';
import { AdminController } from './admin.controller';

@Module({
  imports: [UsersNexoModule],
  providers: [AdminSeed],
  controllers: [AdminController],
})
export class AdminModule {}
