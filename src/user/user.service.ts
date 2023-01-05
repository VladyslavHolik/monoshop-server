import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthRequest } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    return user;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        image: true,
        location: true,
        favorites: true,
      },
    });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        fullName: true,
        items: {
          select: {
            id: true,
            price: true,
            images: true,
            name: true,
            size: true,
          },
        },
        image: true,
        phone: true,
        location: true,
      },
    });

    if (!user) {
      throw new BadRequestException('There is not user with this id');
    }

    return user;
  }

  async getProfile(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async editUser(id: number, dto: EditUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    console.log(refreshToken, user.currentHashedRefreshToken);

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async createWithGoogle(email: string, fullName: string, image: string) {
    const newUser = await this.prisma.user.create({
      data: {
        email,
        fullName,
        isRegisteredWithGoogle: true,
        image,
      },
    });
    return newUser;
  }
}
