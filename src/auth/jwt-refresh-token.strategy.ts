import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserJwtPayload } from './jwt.strategy';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: UserJwtPayload) {
    const refreshToken = request.get('Authorization').split(' ')[1];

    return await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
}
