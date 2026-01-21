import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ENTITY_JWT_SECRET } from './entity-jwt.constants'

@Injectable()
export class EntityJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ENTITY_JWT_SECRET,
    })
  }

  async validate(payload: any) {
    return payload
  }
}
