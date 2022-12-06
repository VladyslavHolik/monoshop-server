import { Body, Controller, Get, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { AddBrandDto } from './dto/add-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  async addBrand(@Body() dto: AddBrandDto) {
    return this.brandService.addBrand(dto);
  }

  @Get()
  async getAll() {
    return this.brandService.getAll();
  }
}
