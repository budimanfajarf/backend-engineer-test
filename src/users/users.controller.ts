import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ValidatedJWTUserData } from 'src/auth/jwt.strategy';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneBy({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'User deleted.',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Not allowed to delete a user.',
  // })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user: ValidatedJWTUserData },
  ) {
    const { user } = req;

    Logger.log(user);

    if (user.role !== UserRole.ADMIN) {
      throw new HttpException(
        'You are not allowed to delete a user.',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.usersService.remove(id);
  }
}
