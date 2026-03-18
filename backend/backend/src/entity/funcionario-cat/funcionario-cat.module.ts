import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FuncionarioCatEntity } from './funcionario-cat.entity'
import { FuncionarioCatService } from './funcionario-cat.service'
import { FuncionarioCatController } from './funcionario-cat.controller'

@Module({
  imports: [TypeOrmModule.forFeature([FuncionarioCatEntity])],
  controllers: [FuncionarioCatController],
  providers: [FuncionarioCatService],
})
export class FuncionarioCatModule {}