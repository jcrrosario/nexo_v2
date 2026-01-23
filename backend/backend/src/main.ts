import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // 🔒 validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  // 🌐 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  })

  // 📂 servir uploads (avatars, etc)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  })

  const port = process.env.APP_PORT || 3001
  await app.listen(port)

  console.log(`🚀 Backend rodando na porta ${port}`)
}

bootstrap()
