import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getSelled(userId: number) {
    const selledItems = await this.prisma.order.findMany({
      where: {
        sellerId: String(userId),
      },
    });

    return selledItems;
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new BadRequestException('There is not order with that id');
    }

    return order;
  }

  async getOrders(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return await this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        id: true,
        itemId: true,
        city: true,
        country: true,
        fullName: true,
        sellerId: true,
        line1: true,
        line2: true,
        phone: true,
        state: true,
        postalCode: true,
        status: true,
        date: true,
        userId: true,
      },
    });
  }

  getNextOrderStatus(currentStatus: OrderStatus): OrderStatus | never {
    if (currentStatus === OrderStatus.SEND_WAIT) {
      return OrderStatus.ON_THE_WAY;
    } else if (currentStatus === OrderStatus.ON_THE_WAY) {
      return OrderStatus.PICKUP_WAIT;
    }

    throw new BadRequestException('Delivered is the last status');
  }

  async changeOrderStatus(userId: number, orderId: string) {
    const order = await this.getOrderById(orderId);

    if (Number(order.sellerId) !== userId) {
      throw new BadRequestException(
        'You do not have enough rights to do this operation',
      );
    }

    const nextStatus = this.getNextOrderStatus(order.status);

    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: nextStatus,
      },
    });
  }

  async setAsDelivered(userId: number, orderId: string) {
    const order = await this.getOrderById(orderId);
    const user = await this.userService.getUserById(userId);

    if (order.customerId !== user.stripeCustomerId) {
      throw new BadRequestException(
        'You do not have enough rights to do this operation',
      );
    }

    return await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: 'DELIVERED',
      },
    });
  }
}
