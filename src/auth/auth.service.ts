import {
  BadRequestException,
  ForbiddenException,
  Get,
  Injectable,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { AuthRequest, UserJwtPayload } from './jwt.strategy';
import JwtRefreshGuard from './jwt-refresh.guard';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(userDto: LoginUserDto, req: Request, res: Response) {
    const { email, password } = userDto;
    const candidate = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!candidate) {
      throw new BadRequestException('Wrong credentials');
    }

    const isMatch = await this.comparePasswords(password, candidate.password);

    if (!isMatch) {
      throw new BadRequestException('Wrong password or email');
    }

    const accessTokenCookie = this.getCookieWithJwtAccessToken(candidate.id);
    const refreshTokenCookie = this.getCookieWithJwtRefreshToken(candidate.id);

    await this.setCurrentRefreshToken(refreshTokenCookie.token, candidate.id);

    res.setHeader('Set-Cookie', [
      accessTokenCookie.cookie,
      refreshTokenCookie.cookie,
    ]);

    return res.send({
      accessToken: accessTokenCookie.token,
      refreshTokenCookie: refreshTokenCookie.token,
    });
  }

  getCookieWithJwtRefreshToken(id: number) {
    const payload = { id };
    const token = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;

    return {
      cookie,
      token,
    };
  }

  getCookieWithJwtAccessToken(id: number) {
    const payload = { id };
    const token = this.jwt.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;

    return {
      cookie,
      token,
    };
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await this.hashPassword(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        currentHashedRefreshToken,
      },
    });
  }

  async register(userDto: CreateUserDto) {
    const candidate = await this.prisma.user.findUnique({
      where: { email: userDto.email },
    });

    if (candidate) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(userDto.password);

    return this.userService.createUser({
      ...userDto,
      password: hashedPassword,
    });
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('Authorization');
    return res.send({ message: 'Succesfuly signed out' });
  }

  async hashPassword(password: string): Promise<string> {
    const rounds = 5;

    return await bcrypt.hash(password, rounds);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
