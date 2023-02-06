import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Request as HttpRequest } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: { id: string }) {
    const user: User = await this.prisma.user.findFirst({
      where: { id: Number(payload.id), isEmailConfirmed: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

export interface UserJwtPayload {
  id: number;
}

export type AuthRequest = HttpRequest & { user: UserJwtPayload };
