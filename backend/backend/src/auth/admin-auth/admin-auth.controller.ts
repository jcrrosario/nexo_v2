import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AdminAuthService } from './admin-auth.service'
import { AdminJwtGuard } from './admin-jwt.guard'

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('login')
  login(@Body() body: { user: string; password: string }) {
    return this.authService.login(body.user, body.password)
  }

  @UseGuards(AdminJwtGuard)
  @Get('me')
  me(@Req() req) {
    return req.user
  }
}
