import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

export type ValidatedJWTUserData = Pick<User, 'id' | 'email' | 'role'>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any): Promise<ValidatedJWTUserData> {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
