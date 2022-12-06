import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCategoryDto } from './dto/add-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async addCategory(dto: AddCategoryDto) {
    const candidate = await this.prisma.category.findFirst({
      where: { name: dto.name },
    });

    if (candidate) {
      throw new HttpException('Category already exists', HttpStatus.FORBIDDEN);
    }

    return this.prisma.category.create({ data: dto });
  }

  async getAll() {
    return this.prisma.category.findMany({ select: { id: true, name: true } });
  }
}
