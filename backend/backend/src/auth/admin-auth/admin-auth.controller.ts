import { Body, Controller, Post } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private authService: AdminAuthService) {}

  @Post('login')
  login(
    @Body('user') user: string,
    @Body('senha') senha: string,
  ) {
    return this.authService.login(user, senha);
  }
}
