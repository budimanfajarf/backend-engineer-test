import { Controller, Request, Post, Get, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ValidatedUserData } from './auth/local.strategy';
import { ValidatedJWTUserData } from './auth/jwt.strategy';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: ValidatedUserData }) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: { user: ValidatedJWTUserData }) {
    return req.user;
  }
}
