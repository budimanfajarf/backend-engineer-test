import { UserRole } from '../entities/user.entity';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  /**
   * @see https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
   */
  @Matches(
    '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
    undefined,
    {
      message:
        'Minimum 8 characters, contains uppercase, lowercase, number, and symbol.',
    },
  )
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
