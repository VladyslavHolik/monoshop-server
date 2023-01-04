import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddBrandDto } from './dto/add-brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async addBrand(dto: AddBrandDto) {
    const candidate = await this.prisma.brand.findFirst({
      where: { value: dto.value },
    });

    if (candidate) {
      throw new HttpException('Brand already exists', HttpStatus.FORBIDDEN);
    }

    return this.prisma.brand.create({ data: dto });
  }

  async getAll(search: string) {
    const brands = await this.prisma.brand.findMany({
      select: { value: true, id: true },
      where: {
        value: {
          contains: search ? search : undefined,
          mode: 'insensitive',
        },
      },
      take: 10,
    });

    const mapped = brands.map((item) => {
      return {
        ...item,
        label: item.value,
      };
    });

    return mapped;
  }

  async getPopularBrands() {
    const popularBrands = await this.prisma.brand.findMany({
      orderBy: {
        item: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return popularBrands;
  }
}
