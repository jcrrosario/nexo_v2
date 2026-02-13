import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FatorEntity } from './fator.entity'
import { FatorService } from './fator.service'
import { FatorController } from './fator.controller'

@Module({
  imports: [TypeOrmModule.forFeature([FatorEntity])],
  controllers: [FatorController],
  providers: [FatorService],
})
export class FatorModule {}
