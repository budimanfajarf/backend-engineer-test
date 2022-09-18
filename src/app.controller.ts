import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ValidatedUserData } from './auth/local.strategy';
import { ValidatedJWTUserData } from './auth/jwt.strategy';
import { LoginUserDto } from './users/dto/login-user.dto';
import { UpdateUserPasswordDto } from './users/dto/update-user-password.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiTags('auth')
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req: { user: ValidatedUserData }) {
    return this.authService.login(req.user);
  }

  @ApiExcludeEndpoint()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req: { user: ValidatedJWTUserData }) {
    const { user: loggedInUser } = req;
    return this.usersService.findOneBy({ id: loggedInUser.id });
  }

  @ApiTags('auth')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('password')
  async updatePassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @Request() req: { user: ValidatedJWTUserData },
  ) {
    const { user: loggedInUser } = req;

    return this.usersService.updatePassword(
      loggedInUser.id,
      updateUserPasswordDto,
    );
  }
}
