import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService, JwtStrategy],
  imports: [PrismaModule],
  exports: [FavoriteService],
})
export class FavoriteModule {}
