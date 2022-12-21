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
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dto/add-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAll(@Query() query: { [gender: string]: Gender }) {
    return this.categoryService.getAll(query.gender);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  addCategory(@Body() dto: AddCategoryDto) {
    return this.categoryService.addCategory(dto);
  }
}
