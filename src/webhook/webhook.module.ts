import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StripeModule } from 'src/stripe/stripe.module';
import { WebhookController } from './webhook.controller';

@Module({
  controllers: [WebhookController],
  imports: [StripeModule, PrismaModule],
})
export class WebhookModule {}
