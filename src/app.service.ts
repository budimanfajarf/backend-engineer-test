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

    try {
      await this.authService.validateUser(email, password);
      // Logger.log('Admin exists');
    } catch (error) {
      await this.usersService.create({
        name: 'Admin',
        email,
        password,
        role: UserRole.ADMIN,
      });

      // Logger.log('Admin created');
    } finally {
      Logger.log('----- ADMIN ACCOUNT -----');
      Logger.log(email, 'Email');
      Logger.log(password, 'Password');
    }
  }
}
