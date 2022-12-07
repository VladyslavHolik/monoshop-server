import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  async addBrand(@Body() dto: AddBrandDto) {
    return this.brandService.addBrand(dto);
  }

  @Get()
  async getAll() {
    return this.brandService.getAll();
  }
}
