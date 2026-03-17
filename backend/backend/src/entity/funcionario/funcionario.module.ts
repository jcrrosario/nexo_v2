import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FuncionarioEntity } from './funcionario.entity'
import { FuncionarioService } from './funcionario.service'
import { FuncionarioController } from './funcionario.controller'
import { FuncaoEntity } from '../funcao/funcao.entity'
import { DepartamentoEntity } from '../departamento/departamento.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FuncionarioEntity,
      FuncaoEntity,
      DepartamentoEntity,
    ]),
  ],
  controllers: [FuncionarioController],
  providers: [FuncionarioService],
})
export class FuncionarioModule {}