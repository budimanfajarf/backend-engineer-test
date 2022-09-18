import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { UserRole } from './users/entities/user.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  onApplicationBootstrap() {
    this.initAdmin();
  }

  async initAdmin() {
    const email = this.config.get<string>('ADMIN_EMAIL') || 'admin@primaku.com';
    const password = this.config.get<string>('ADMIN_PASSWORD') || '#Admin123';

    const userAdmin = await this.authService.validateUser(email, password);

    Logger.log('----- ADMIN ACCOUNT -----');

    if (userAdmin) {
      Logger.log(email, 'Email');
      Logger.log(password, 'Password');
      return;
    }

    try {
      await this.usersService.create({
        name: 'Admin',
        email,
        password,
        role: UserRole.ADMIN,
      });
      Logger.log(email, 'Email');
      Logger.log(password, 'Password');
    } catch (error) {
      Logger.log(email, 'Email');
      Logger.log('Password has changed', 'Password');
    }
  }
}
