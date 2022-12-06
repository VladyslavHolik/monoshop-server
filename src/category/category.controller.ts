import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dto/add-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAll() {
    return this.categoryService.getAll();
  }

  @Post()
  addCategory(@Body() dto: AddCategoryDto) {
    return this.categoryService.addCategory(dto);
  }
}
