import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersNexoModule } from './users-nexo/users-nexo.module'
import { AdminModule } from './admin/admin.module'
import { AdminAuthModule } from './auth/admin-auth/admin-auth.module'
import { EntityAuthModule } from './entity/auth/entity-auth.module'
import { EmpresaModule } from './entity/empresa/empresa.module'
import { DepartamentoModule } from './entity/departamento/departamento.module'
import { FuncaoModule } from './entity/funcao/funcao.module'
import { VinculacaoModule } from './entity/vinculacao/vinculacao.module'
import { CategoriaModule } from './entity/categoria/categoria.module' // 👈 NOVO

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),

    UsersNexoModule,
    AdminModule,
    AdminAuthModule,
    EmpresaModule,
    EntityAuthModule,
    DepartamentoModule,
    VinculacaoModule,
    FuncaoModule,
    CategoriaModule, // 👈 REGISTRO DO MÓDULO
  ],
})
export class AppModule {}
