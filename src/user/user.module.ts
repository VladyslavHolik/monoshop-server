import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtRefreshTokenStrategy } from 'src/auth/jwt-refresh-token.strategy';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  imports: [PrismaModule, StripeModule],
  exports: [UserService],
})
export class UserModule {}
