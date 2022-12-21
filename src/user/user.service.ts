import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';

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
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async getMyUser(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        items: true,
        email: true,
        role: true,
        favorites: {
          select: {
            images: true,
            brand: true,
            size: true,
            category: true,
          },
        },
        image: true,
        phone: true,
        location: true,
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
}
