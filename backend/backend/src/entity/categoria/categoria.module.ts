import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriaEntity } from './categoria.entity'
import { CategoriaService } from './categoria.service'
import { CategoriaController } from './categoria.controller'

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  controllers: [CategoriaController],
  providers: [CategoriaService],
})
export class CategoriaModule {}
