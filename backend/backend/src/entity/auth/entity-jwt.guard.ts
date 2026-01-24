import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class EntityJwtGuard extends AuthGuard('entity-jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }
}
