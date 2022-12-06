import { Body, Controller, Get, Post } from '@nestjs/common';
import { AddStyleDto } from './dto/add-style.dto';
import { StyleService } from './style.service';

@Controller('style')
export class StyleController {
  constructor(private readonly styleService: StyleService) {}

  @Post()
  addStyle(@Body() dto: AddStyleDto) {
    return this.styleService.addStyle(dto);
  }

  @Get()
  getAll() {
    return this.styleService.getAll();
  }
}
