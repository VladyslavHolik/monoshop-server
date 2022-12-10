import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async toggleFavorite(id: number, userId: number) {
    const candidate = await this.prisma.item.findFirst({
      where: {
        favoriteUsers: {
          some: {
            id: userId,
          },
        },
        
      },
      
    });
    
    //Push item to the user
    if (!candidate) {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          favorites: {
            set: {
              id
            }
          },
        },
        include: {
          favorites: true
        }
      });

      return user.favorites;
    } 

    // Remove an item from the user
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          disconnect: {
            id
          }
        },
      },
      include: {
        favorites: true
      }
    });

    return user.favorites;
  }
}
