import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ValidatedUserData } from './local.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<ValidatedUserData | null> {
    const user = await this.usersService.findOneBy({ email });

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);

      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: ValidatedUserData) {
    // Logger.log('user', user);
    const { id, email, role } = user;
    return {
      access_token: this.jwtService.sign({ sub: id, email, role }),
    };
  }
}
