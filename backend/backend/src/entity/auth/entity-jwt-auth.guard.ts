// src/entity/auth/entity-jwt-auth.guard.ts
// CRIAR ESTE ARQUIVO

import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class EntityJwtAuthGuard extends AuthGuard('entity-jwt') {}
