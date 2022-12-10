import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ItemController } from './item/item.controller';
import { ItemService } from './item/item.service';
import { ItemModule } from './item/item.module';
import { StyleModule } from './style/style.module';
import { SizeModule } from './size/size.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ColourModule } from './colour/colour.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ItemModule,
    StyleModule,
    SizeModule,
    CategoryModule,
    BrandModule,
    ColourModule,
    FavoriteModule,
  ],
  controllers: [AuthController, UserController, ItemController],
  providers: [AuthService, JwtService, ItemService],
})
export class AppModule {}
