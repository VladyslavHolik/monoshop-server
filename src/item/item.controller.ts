import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Gender, Size } from '@prisma/client';

import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/auth/jwt.strategy';
import { CreateItemDto } from './dto/create-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import { PageMetaDto } from './dto/page-meta.dto';
import { FilterBy } from './filter-by.enum';
import { ItemService } from './item.service';

export interface IFilter {
  price?: [number, number];
  gender?: Gender;
  category?: string[];
  size?: Size[];
  condition?: number[];
  brand?: string[];
  style?: string[];
  colour?: string[];
  filterBy?: FilterBy;
  page: number;
}

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
  getAll(
    @Query(
      'price',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    price: [number, number],
    @Query(
      'condition',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    condition: number[],
    @Query(
      'colour',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    colour: string[],
    @Query(
      'style',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    style: string[],
    @Query(
      'brand',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    brand: string[],
    @Query(
      'size',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    size: Size[],
    @Query(
      'category',
      new ParseArrayPipe({
        items: String,
        separator: ',',
        optional: true,
      }),
    )
    category: string[],
    @Query('gender') gender: Gender,
    @Query('filterBy') filterBy: FilterBy,
    @Query('page') page: number,
  ) {
    return this.itemService.getAll({
      price: price || [undefined, undefined],
      condition: condition || undefined,
      colour: colour || undefined,
      style: style || undefined,
      brand: brand || undefined,
      size: size || undefined,
      category: category || undefined,
      gender: gender || undefined,
      filterBy: filterBy || undefined,
      page: page,
    });
  }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // getUserItems(@Req() req: AuthRequest) {
  //   const { user } = req;
  //   return '...';
  // }

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
  deleteItem(@Param('id') id: string) {
    return this.itemService.delete(id);
  }
}
