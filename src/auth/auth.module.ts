import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PrismaModule,
    UserModule,
    JwtModule.register({
      signOptions: {
        expiresIn: 3600,
      },
      secretOrPrivateKey: process.env.JWT_SECRET,
    }),
    PassportModule,
  ],
})
export class AuthModule {}
