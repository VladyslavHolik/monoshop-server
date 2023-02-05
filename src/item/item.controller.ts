import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Gender, Size, User } from '@prisma/client';

import { JwtAuthGuard, OptionalJwtAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/jwt.strategy';
import { CreateItemDto } from './dto/create-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import { SortBy } from './sort-by.enum';
import { ItemService } from './item.service';
import { ParseEnumPipe } from '@nestjs/common/pipes';
import { FilterDto } from './dto/filter.dto';

// export interface IFilter {
//   price?: [number, number];
//   gender?: Gender;
//   category?: number;
//   subcategory?: number[];
//   size?: Size[];
//   condition?: number[];
//   brand?: string[];
//   style?: string[];
//   colour?: string[];
//   sortBy?: SortBy;
//   page: number;
//   search?: string;
// }

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
  @UseGuards(OptionalJwtAuthGuard)
  getAll(@Query() dto: FilterDto, @Req() req: AuthRequest) {
    return this.itemService.getAll(dto, req.user.id);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  getUserItems(@Req() req: AuthRequest) {
    const { user } = req;
    return this.itemService.getUserItems(user.id);
  }

  @Get('popular')
  getHot() {
    return this.itemService.getHot();
  }

  @Get(':id')
  getItem(@Param('id') id: string) {
    return this.itemService.getItem(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  editItem(@Param('id') id: string, @Body() dto: EditItemDto) {
    return this.itemService.editItem(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteItem(@Param('id') id: string, @Req() req: AuthRequest) {
    const userId = req.user.id;
    return this.itemService.delete(id, userId);
  }
}
