import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request as HttpRequest } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
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

  @Get(':id')
  getItem(@Param('id') id: string) {
    return this.itemService.getItem(id);
  }

  @Put(':id')
  editItem(@Param('id') id: string, @Body() dto: EditItemDto) {
    return this.itemService.editItem(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteItem(@Param('id') id: string) {
    return this.itemService.delete(id);
  }
}
