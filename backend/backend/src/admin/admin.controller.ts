import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from '../auth/admin-auth/admin-jwt.guard';

@Controller('admin')
export class AdminController {
  @UseGuards(AdminJwtGuard)
  @Get('me')
  me(@Req() req: any) {
    return {
      usernexo_id: req.user.sub,
      email: req.user.email,
      type: req.user.type,
    };
  }
}
