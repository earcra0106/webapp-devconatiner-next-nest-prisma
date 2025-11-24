import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './local-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    // LocalAuthGuard attaches user to req.user
    return this.authService.login(req.user);
  }
}
