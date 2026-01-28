import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FuncaoEntity } from './funcao.entity'
import { FuncaoService } from './funcao.service'
import { FuncaoController } from './funcao.controller'

@Module({
  imports: [TypeOrmModule.forFeature([FuncaoEntity])],
  controllers: [FuncaoController],
  providers: [FuncaoService],
})
export class FuncaoModule {}
