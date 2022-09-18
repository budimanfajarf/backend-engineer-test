import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { User } from 'src/users/entities/user.entity';

export type ValidatedJWTUserData = Pick<User, 'id' | 'email' | 'role'>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
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
