import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostReviewDto } from './dto/post-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async postReview(userId: number, dto: PostReviewDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: dto.orderId,
      },
      select: {
        user: true,
        city: true,
        country: true,
        customerId: true,
        date: true,
        fullName: true,
        id: true,
        itemId: true,
        line1: true,
        line2: true,
        phone: true,
        postalCode: true,
        review: true,
        sellerId: true,
        status: true,
        state: true,
        userId: true,
      },
    });

    if (order.review) {
      throw new HttpException('There is already review', HttpStatus.NOT_FOUND);
    }

    if (!order) {
      throw new HttpException(
        'There is no order with that id',
        HttpStatus.NOT_FOUND,
      );
    }

    if (order.review) {
    }

    if (order.userId !== userId) {
      throw new HttpException(
        'You do not have permissions',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.review.create({
      data: {
        rating: dto.rating,
        text: dto.text,
        order: { connect: { id: dto.orderId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async getUserReviews(userId: number, page: number, take: number) {
    if (take > 50) {
      throw new HttpException(
        'Take can not me bigger than 50',
        HttpStatus.BAD_REQUEST,
      );
    }

    const skip = (page - 1) * take;

    return await this.prisma.review.findMany({
      where: {
        order: {
          sellerId: String(userId),
        },
      },
      take,
      skip,
    });
  }
}
