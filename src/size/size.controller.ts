import { Body, Controller, Post, Get } from '@nestjs/common';
import { AddSizeDto } from './dto/add-size.dto';
import { SizeService } from './size.service';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  addSize(@Body() dto: AddSizeDto) {
    return this.sizeService.addSize(dto);
  }

  @Get()
  getAll() {
    return this.sizeService.getAll();
  }
}
