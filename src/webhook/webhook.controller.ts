import { BadRequestException, Controller, Post } from '@nestjs/common';
import { StripeService } from 'src/stripe/stripe.service';
import RequestWithRawBody from 'src/utils/types/requestWithRawBody.interface';
import {
  Headers,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      await this.prisma.order.create({
        data: {
          city: session.customer_details.address.city,
          country: session.customer_details.address.country,
          line1: session.customer_details.address.line1,
          line2: session.customer_details.address.line2,
          state: session.customer_details.address.state,
          postalCode: session.customer_details.address.postal_code,
          customerId: session.customer as string,
          id: session.id,
          sellerId: session.metadata.seller_id,
          fullName: session.customer_details.name,
          phone: session.customer_details.phone,
        },
      });
    }
  }
}
