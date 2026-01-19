import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersNexo } from './users-nexo.entity';
import { UsersNexoService } from './users-nexo.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersNexo])],
  providers: [UsersNexoService],
  exports: [UsersNexoService],
})
export class UsersNexoModule {}
