import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import { SortBy } from './sort-by.enum';
import { FavoriteService } from 'src/favorite/favorite.service';
import { FilterDto } from './dto/filter.dto';
import { UserService } from 'src/user/user.service';

const getTotalPages = (totalItems: number, limit: number) => {
  return Math.ceil(totalItems / limit);
};

const ITEMS_LIMIT = 12;

@Injectable()
export class ItemService {
  constructor(
    private prisma: PrismaService,
    private favoriteService: FavoriteService,
    private userService: UserService,
  ) {}

  async createItem(dto: CreateItemDto, userId: number) {
    const item = await this.prisma.item.create({
      data: {
        user: { connect: { id: userId } },
        condition: dto.condition,
        price: Number(dto.price).toFixed(2),
        description: dto.description,
        brand: {
          connect: dto.brand.map((id) => ({ id })),
        },
        category: { connect: { id: dto.categoryId } },
        subcategory: { connect: { id: dto.subcategoryId } },
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

  async getAll(query: FilterDto, userId: number) {
    const {
      brand,
      category,
      colour,
      condition,
      sortBy,
      subcategory,
      gender,
      price,
      size,
      style,
      page,
      search,
    } = query;

    function sortPrice(): Prisma.SortOrder | undefined {
      if (sortBy === SortBy.PriceHigh) {
        return Prisma.SortOrder.desc;
      }
      if (sortBy === SortBy.PriceLow) {
        return Prisma.SortOrder.asc;
      }
    }

    const items = await this.prisma.item.findMany({
      orderBy: {
        views: sortBy === SortBy.Popular ? 'desc' : undefined,
        price: sortPrice(),
        id: sortBy === SortBy.Recent ? 'desc' : undefined,
      },
      where: {
        OR: search
          ? [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                brand: {
                  some: {
                    value: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ]
          : undefined,
        price: price
          ? {
              gt: price[0] - 1,
              lt: price[1] + 1,
            }
          : undefined,
        category: {
          id: category,
        },
        AND: [
          {
            subcategory: {
              id: {
                in: subcategory,
              },
            },
          },
          {
            brand: {
              some: {
                value: {
                  in: brand,
                },
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
        selled: false,
        gender: gender,
        colour: {
          value: {
            in: colour,
          },
        },
      },
      take: ITEMS_LIMIT,
      skip: ((page || 1) - 1) * ITEMS_LIMIT,
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
      orderBy: {
        views: sortBy === SortBy.Popular ? 'desc' : undefined,
        price: sortPrice(),
        id: sortBy === SortBy.Recent ? 'desc' : undefined,
      },
      where: {
        OR: search
          ? [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                brand: {
                  some: {
                    value: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ]
          : undefined,
        price: price
          ? {
              gt: price[0] - 1,
              lt: price[1] + 1,
            }
          : undefined,
        category: {
          id: category,
        },

        AND: [
          {
            subcategory: {
              id: {
                in: subcategory,
              },
            },
          },
          {
            brand: {
              some: {
                value: {
                  in: brand,
                },
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
        selled: false,
        colour: {
          value: {
            in: colour,
          },
        },
      },
    });

    if (userId) {
      const mapped = await Promise.all(
        items.map(async (item) => {
          return {
            ...item,
            isFavorite: await this.favoriteService.isAlreadyFavorite(
              item.id,
              userId,
            ),
          };
        }),
      );

      return {
        data: mapped,
        meta: {
          total: count,
        },
      };
    }

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
      orderBy: {
        id: 'desc',
      },
      select: {
        name: true,
        images: true,
        price: true,
        selled: true,
      },
    });
  }

  async getItem(id: string) {
    if (!id) {
      throw new HttpException('No id provided', HttpStatus.BAD_REQUEST);
    }

    const item = await this.prisma.item.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        images: true,
        gender: true,
        brand: true,
        category: true,
        colour: true,
        size: true,
        condition: true,
        user: {
          select: {
            id: true,
          },
        },
        price: true,
        style: true,
        description: true,
        name: true,
        hashtags: true,
        subcategory: true,
        views: true,
        selled: true,
      },
    });

    if (!item) {
      throw new HttpException(
        'There is no item with this id',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.item.update({
      where: { id: Number(id) },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const user = await this.userService.getUserById(item.user.id);

    // Take 5 items of the same user
    const userItems = await this.prisma.item.findMany({
      take: 5,

      where: {
        userId: {
          equals: item.user.id,
        },
        NOT: [
          {
            id: item.id,
          },
        ],
      },
      orderBy: {
        views: 'desc',
      },
    });

    return { ...item, user, userItems };
  }

  async editItem(id: string, dto: EditItemDto) {
    const item = await this.prisma.item.findFirst({
      where: {
        id: Number(id),
        selled: false,
      },
    });

    if (!item) {
      throw new HttpException('Brand already exists', HttpStatus.FORBIDDEN);
    }

    const editedItem = await this.prisma.item.update({
      where: { id: Number(id) },
      data: {
        condition: dto.condition,
        price: Number(dto.price).toFixed(2),
        description: dto.description,
        brand: {
          connect: dto.brand.map((id) => ({ id })),
        },
        category: { connect: { id: dto.categoryId } },
        colour: { connect: { value: dto.colour } },
        images: dto.images,
        size: dto.size,
        style: { connect: { value: dto.style } },
        gender: dto.gender,
        name: dto.name,
        hashtags: dto.hashtags,
        subcategory: { connect: { id: dto.subcategoryId } },
      },
    });

    return editedItem;
  }

  async delete(id: string, userId: number) {
    const candidate = await this.prisma.item.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!candidate) {
      throw new BadRequestException('There is no item with this id');
    }

    if (candidate.userId !== userId) {
      throw new HttpException('You do not have rights', HttpStatus.FORBIDDEN);
    }

    if (candidate.selled) {
      throw new HttpException('You can not delete the selling item', HttpStatus.FORBIDDEN);
    }

    await this.prisma.item.delete({ where: { id: Number(id) } });

    return { message: 'Item deleted succsfully' };
  }

  async getHot() {
    const items = await this.prisma.item.findMany({
      take: 10,
      orderBy: {
        views: 'desc',
      },
      where: {
        NOT: [
          {
            selled: true,
          },
        ],
      },
    });

    return items;
  }
}
