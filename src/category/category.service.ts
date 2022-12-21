import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Gender } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddCategoryDto } from './dto/add-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async addCategory(dto: AddCategoryDto) {
    const candidate = await this.prisma.category.findFirst({
      where: { value: dto.value, gender: dto.gender },
    });

    if (candidate) {
      throw new HttpException('Category already exists', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.category.create({ data: dto });
  }

  async getAll(gender: Gender) {
    // console.log(gender);

    const categories = await this.prisma.category.findMany({
      where: {
        gender: gender,
      },
      select: { value: true, gender: true, id: true },
    });

    const mapped = categories.map((category) => {
      return {
        ...category,
        label: category.value,
      };
    });

    return mapped;
  }
}
