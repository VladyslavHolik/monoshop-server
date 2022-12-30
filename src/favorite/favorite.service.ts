import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async toggleFavorite(id: number, userId: number) {
    const candidate = await this.prisma.item.findFirst({
      where: {
        id,
        favoriteUsers: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        favoriteUsers: true,
      },
    });

    console.log(candidate, 'candidate');

    //Push item to the user
    if (!candidate) {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          favorites: {
            connect: {
              id,
            },
          },
        },
        include: {
          favorites: true,
        },
      });

      return true;
    }

    // Remove an item from the user
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          disconnect: {
            id,
          },
        },
      },
      include: {
        favorites: true,
      },
    });

    return false;
  }

  async getAllFavorites(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        favorites: true,
      },
    });

    return user.favorites;
  }

  async isAlreadyFavorite(id: number, userId: number) {
    const candidate = await this.prisma.item.findFirst({
      where: {
        favoriteUsers: {
          some: {
            id: userId,
          },
        },
        id,
      },
    });

    if (candidate) {
      return true;
    }

    return false;
  }
}
