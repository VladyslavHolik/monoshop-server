import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Body, Put } from '@nestjs/common/decorators';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/jwt.strategy';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getOrders(@Req() req: AuthRequest) {
    return this.orderService.getOrders(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('selled')
  getSelled(@Req() req: AuthRequest) {
    return this.orderService.getSelled(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('changeStatus')
  changeOrderStatus(@Req() req: AuthRequest, @Body('orderId') orderId: string) {
    return this.orderService.changeOrderStatus(req.user.id, orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  setAsDelivered(@Req() req: AuthRequest, @Param('id') orderId: string) {
    return this.orderService.setAsDelivered(req.user.id, orderId);
  }
}
