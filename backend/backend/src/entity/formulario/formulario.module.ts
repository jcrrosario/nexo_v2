import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Formulario } from './formulario.entity'
import { Pergunta } from './pergunta.entity'
import { CategoriaEntity } from '../categoria/categoria.entity'
import { FormularioService } from './formulario.service'
import { FormularioController } from './formulario.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Formulario,
      Pergunta,
      CategoriaEntity,
    ]),
  ],
  controllers: [FormularioController],
  providers: [FormularioService],
})
export class FormularioModule {}
