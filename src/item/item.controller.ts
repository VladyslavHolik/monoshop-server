import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request as HttpRequest } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemService } from './item.service';

interface UserJwtPayload {
  id: number;
}
type AuthRequest = HttpRequest & { user: UserJwtPayload };

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createItem(@Body() dto: CreateItemDto, @Req() req: AuthRequest) {
    const { user } = req;
    return this.itemService.createItem(dto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@Req() req: AuthRequest) {
    const { user } = req;
    return this.itemService.getAll(user.id);
  }
}
