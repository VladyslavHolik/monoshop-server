import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(dto: CreateItemDto, userId: number) {
    const item = await this.prisma.item.create({
      data: {
        user: { connect: { id: userId } },
        condition: dto.condition,
        price: dto.price,
        brand: { connect: { name: dto.brand } },
        category: { connect: { name: dto.category } },
        colour: { connect: { name: dto.colour } },
        images: dto.images,
        size: { connect: { name: dto.size } },
        style: { connect: { name: dto.style } },
      },
      include: {
        size: true,
        brand: true,
        category: true,
        colour: true,
        style: true,
      },
    });

    return item;
  }

  async getAll(userId: number) {
    const userItems = await this.prisma.item.findMany({
      where: { userId },
      include: {
        brand: true,
        category: true,
        colour: true,
        size: true,
        style: true,
      },
    });

    return userItems;
  }
}
