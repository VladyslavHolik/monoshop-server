import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/jwt.strategy';
import CreateChargeDto from './dto/create-charge.dto';
import { StripeService } from './stripe.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCharge(@Body() dto: CreateChargeDto, @Req() req: AuthRequest) {
    return await this.stripeService.charge(req.user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCheckoutList(@Req() req: AuthRequest) {}
}
