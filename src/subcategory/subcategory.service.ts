import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Gender } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddSubcategoryDto } from './dto/add-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(private prisma: PrismaService) {}

  async addSubcategory(dto: AddSubcategoryDto) {
    const candidate = await this.prisma.subcategory.findFirst({
      where: { value: dto.value, category: { id: dto.categoryId } },
    });

    if (candidate) {
      throw new HttpException(
        'Subcategory already exists',
        HttpStatus.FORBIDDEN,
      );
    }

    const isCategoryExists = await this.prisma.category.findFirst({
      where: {
        id: dto.categoryId,
      },
    });

    if (!isCategoryExists) {
      throw new HttpException(
        'There is not category with this id',
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

  async getAll(categoryId: number) {
    const subcategories = await this.prisma.subcategory.findMany({
      where: {
        category: {
          id: categoryId,
        },
      },
      select: {
        value: true,
        id: true,
      },
    });

    console.log(subcategories);

    const mapped = subcategories.map((subcategory) => {
      return {
        ...subcategory,
        label: subcategory.value,
      };
    });

    return mapped;
  }
}
