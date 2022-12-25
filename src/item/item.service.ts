import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import { IFilter } from './item.controller';

const getTotalPages = (totalItems: number, limit: number) => {
  return Math.ceil(totalItems / limit);
};

const ITEMS_LIMIT = 12;

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(dto: CreateItemDto, userId: number) {
    const item = await this.prisma.item.create({
      data: {
        user: { connect: { id: userId } },
        condition: dto.condition,
        price: dto.price,
        description: dto.description,
        brand: { connect: { value: dto.brand } },
        category: { connect: { id: dto.categoryId } },
        colour: { connect: { value: dto.colour } },
        images: dto.images,
        size: dto.size,
        style: { connect: { value: dto.style } },
        gender: dto.gender,
        name: dto.name,
        hashtags: dto.hashtags,
      },
      select: {
        id: true,
        brand: true,
        category: true,
        price: true,
      },
    });

    return item;
  }

  async getAll(query: IFilter) {
    const {
      brand,
      category,
      colour,
      condition,
      filterBy,
      gender,
      price,
      size,
      style,
      page,
    } = query;

    const items = await this.prisma.item.findMany({
      where: {
        price: {
          gt: price[0],
          lt: price[1],
        },
        AND: [
          {
            category: {
              value: {
                in: category,
              },
            },
          },
          {
            brand: {
              value: {
                in: brand,
              },
            },
          },
          {
            condition: {
              in: condition,
            },
          },
          {
            size: {
              in: size,
            },
          },
          {
            style: {
              value: {
                in: style,
              },
            },
          },
        ],

        gender: gender,
        colour: {
          value: {
            in: colour,
          },
        },
      },
      take: ITEMS_LIMIT,
      skip: (page - 1) * ITEMS_LIMIT,
      select: {
        images: true,
        price: true,
        id: true,
        category: true,
        gender: true,
        colour: true,
        size: true,
      },
    });

    const count = await this.prisma.item.count({
      where: {
        price: {
          gt: price[0],
          lt: price[1],
        },
        AND: [
          {
            category: {
              value: {
                in: category,
              },
            },
          },
          {
            brand: {
              value: {
                in: brand,
              },
            },
          },
          {
            condition: {
              in: condition,
            },
          },
          {
            size: {
              in: size,
            },
          },
          {
            style: {
              value: {
                in: style,
              },
            },
          },
        ],

        gender: gender,
        colour: {
          value: {
            in: colour,
          },
        },
      },
    });

    return {
      data: items,
      meta: {
        total: count,
      },
    };
  }

  async getUserItems(id: number) {
    return this.prisma.item.findMany({
      where: {
        userId: id,
      },
    });
  }

  async getItem(id: string) {
    return await this.prisma.item.findUnique({
      where: { id: Number(id) },
      select: {
        images: true,
        gender: true,
        brand: true,
        category: true,
        colour: true,
        size: true,
        condition: true,
        user: true,
        price: true,
        style: true,
        description: true,
        name: true,
        hashtags: true,
      },
    });
  }

  async editItem(id: string, dto: EditItemDto) {
    const editedItem = await this.prisma.item.update({
      where: { id: Number(id) },
      data: {
        ...dto,
      },
    });
    return editedItem;
  }

  async delete(id: string) {
    await this.prisma.item.delete({ where: { id: Number(id) } });

    return { message: 'Item deleted succsfully' };
  }
}
