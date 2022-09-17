import { UserRole } from '../entities/user.entity';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUUID()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
