import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthRequest } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import * as bcrypt from 'bcrypt';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const stripeCustomer = await this.stripeService.createCustomer(
      dto.fullName,
      dto.email,
    );

    const user = await this.prisma.user.create({
      data: { ...dto, stripeCustomerId: stripeCustomer.id },
    });
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
        stripeCustomerId: true,
        image: true,
        phone: true,
        location: true,
        lastActivity: true,
        id: true,
      },
    });

    if (!user) {
      throw new BadRequestException('There is not user with this id');
    }

    const reviewCount = await this.prisma.review.count({
      where: {
        AND: [
          {
            order: {
              sellerId: {
                equals: String(user.id),
              },
            },
          },
        ],
      },
    });

    const reviewRating = async () => {
      const ratings = await this.prisma.review.findMany({
        where: {
          AND: [
            {
              order: {
                sellerId: {
                  equals: String(user.id),
                },
              },
            },
          ],
        },
        select: {
          rating: true,
        },
      });

      let count = 0;

      ratings.map((i) => {
        count += i.rating;
      });

      return count / reviewCount;
    };

    return { ...user, reviewCount, reviewRating: await reviewRating() };
  }

  async getProfile(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        fullName: true,
        image: true,
        lastActivity: true,
        id: true,
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

    console.log(isRefreshTokenMatching);

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async setLastActivity(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastActivity: new Date(),
      },
    });
  }

  async createWithGoogle(email: string, fullName: string, image: string) {
    const stripeCustomer = await this.stripeService.createCustomer(
      fullName,
      email,
    );

    const newUser = await this.prisma.user.create({
      data: {
        email,
        fullName,
        isRegisteredWithGoogle: true,
        image,
        stripeCustomerId: stripeCustomer.id,
      },
    });
    return newUser;
  }
}
