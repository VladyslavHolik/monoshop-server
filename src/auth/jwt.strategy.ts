import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Request as HttpRequest } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'token' in req.cookies) {
      return req.cookies.token;
    }
    return null;
  }

  async validate(payload: { id: string; email: string }) {
    const user: User = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

interface UserJwtPayload {
  id: number;
}

export type AuthRequest = HttpRequest & { user: UserJwtPayload };
