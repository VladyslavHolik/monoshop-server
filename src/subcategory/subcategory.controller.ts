import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Gender } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import Role from 'src/auth/role.enum';
import RoleGuard from 'src/auth/roles.guard';
import { SubcategoryService } from './subcategory.service';
import { AddSubcategoryDto } from './dto/add-subcategory.dto';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Get()
  getAll(@Query() query: { gender: Gender; categoryId: number }) {
    return this.subcategoryService.getAll(query.gender, query.categoryId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  addSubcategory(@Body() dto: AddSubcategoryDto) {
    return this.subcategoryService.addSubcategory(dto);
  }
}
