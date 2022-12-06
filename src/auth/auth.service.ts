import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';

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

    const token = await this.signToken(candidate.id, email);

    if (!token) {
      throw new ForbiddenException();
    }

    res.cookie('token', token, {});

    return res.send({ message: 'Logged in succesfully' });
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
    res.clearCookie('token');
    return res.send({ message: 'Succesfuly signed out' });
  }

  async hashPassword(password: string): Promise<string> {
    const rounds = 5;

    return await bcrypt.hash(password, rounds);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async signToken(id: number, email: string) {
    const payload = { id, email };

    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
