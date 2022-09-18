import { Controller, Request, Post, Get, UseGuards } from '@nestjs/common';
import { ApiBody, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ValidatedUserData } from './auth/local.strategy';
import { ValidatedJWTUserData } from './auth/jwt.strategy';
import { LoginUserDto } from './users/dto/login-user.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @ApiTags('auth')
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req: { user: ValidatedUserData }) {
    return this.authService.login(req.user);
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: { user: ValidatedJWTUserData }) {
    return req.user;
  }
}
