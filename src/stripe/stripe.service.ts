import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';
import CreateChargeDto from './dto/create-charge.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  async updateCustomer(customerId: string, dto: CreateChargeDto) {
    return await this.stripe.customers.update(customerId, {
      address: {
        city: dto.city,
        country: dto.country,
        line1: dto.line1,
        line2: dto.line2,
        postal_code: String(dto.postalCode),
        state: dto.state,
      },
      name: dto.fullName,
      email: dto.email,
      phone: dto.phone,
    });
  }

  async charge(userId: number, dto: CreateChargeDto) {
    const item = await this.prisma.item.findUnique({
      where: {
        id: dto.itemId,
      },
    });

    if (!item) {
      throw new BadRequestException('There is no item with this id');
    }
    // Search for user
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    //update customer
    await this.updateCustomer(user.stripeCustomerId, dto);

    const session = await this.stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/success?message=Succesful+payment',
      cancel_url: 'http://localhost:3000/404?message=Payment+canceled',
      mode: 'payment',
      currency: 'pln',
      customer: user.stripeCustomerId,
      metadata: {
        seller_id: item.userId,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'pln',
            unit_amount: item.price * 100,
            product_data: {
              name: item.name,
              images: item.images,
              metadata: {
                id: item.id,
              },
            },
          },
        },
      ],
    });
    return session.id;
  }

  async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }
}
