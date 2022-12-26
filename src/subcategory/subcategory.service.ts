import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Gender } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddSubcategoryDto } from './dto/add-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(private prisma: PrismaService) {}

  async addSubcategory(dto: AddSubcategoryDto) {
    const candidate = await this.prisma.subcategory.findFirst({
      where: { value: dto.value },
    });

    if (candidate) {
      throw new HttpException(
        'Subcategory already exists',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.prisma.subcategory.create({
      data: {
        value: dto.value,
        category: { connect: { id: dto.categoryId } },
      },
    });
  }

  async getAll(gender: Gender, categoryId: number) {
    const subcategories = await this.prisma.subcategory.findMany({
      where: {
        category: {
          id: categoryId,
          gender: gender,
        },
      },
      select: {
        value: true,
        id: true,
      },
    });

    const mapped = subcategories.map((category) => {
      return {
        ...category,
        label: category.value,
      };
    });

    return mapped;
  }
}
