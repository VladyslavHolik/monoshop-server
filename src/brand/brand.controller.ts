import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import Role from 'src/auth/role.enum';
import RoleGuard from 'src/auth/roles.guard';
import { BrandService } from './brand.service';
import { AddBrandDto } from './dto/add-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  addBrand(@Body() dto: AddBrandDto) {
    return this.brandService.addBrand(dto);
  }

  @Get()
  getAll(@Query('search') search: string) {
    return this.brandService.getAll(search);
  }

  @Get('popular')
  getPopularBrands() {
    return this.brandService.getPopularBrands();
  }
}
