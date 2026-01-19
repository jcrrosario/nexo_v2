import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersNexoModule } from './users-nexo/users-nexo.module';
import { AdminModule } from './admin/admin.module';
import { AdminAuthModule } from './auth/admin-auth/admin-auth.module';


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
      synchronize: true,
    }),

    UsersNexoModule,
    AdminModule,
    AdminAuthModule,

  ],
})
export class AppModule {}
