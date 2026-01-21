import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmpresaEntity } from './empresa.entity'
import { EmpresaService } from './empresa.service'

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaEntity])],
  providers: [EmpresaService],
  exports: [EmpresaService],
})
export class EmpresaModule {}
