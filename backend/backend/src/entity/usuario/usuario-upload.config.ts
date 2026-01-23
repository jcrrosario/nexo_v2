import { diskStorage } from 'multer'
import { extname } from 'path'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'

const jwtService = new JwtService({
  secret: process.env.JWT_SECRET || 'nexo_secret',
})

export const usuarioUploadConfig = {
  storage: diskStorage({
    destination: (req: Request, file, cb) => {
      try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
          return cb(new Error('Token não informado'), '')
        }

        const token = authHeader.replace('Bearer ', '')
        const payload: any = jwtService.verify(token)

        const empresaId = payload.idtb_empresas

        const uploadPath = `backend/uploads/empresas/${empresaId}/usuarios`

        cb(null, uploadPath)
      } catch (err) {
        cb(new Error('Token inválido'), '')
      }
    },

    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const ext = extname(file.originalname)
      cb(null, `usuario-${unique}${ext}`)
    },
  }),
}
