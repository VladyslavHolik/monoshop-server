import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddBrandDto } from './dto/add-brand.dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async addBrand(dto: AddBrandDto) {
    const candidate = await this.prisma.brand.findFirst({
      where: { name: dto.name },
    });

    if (candidate) {
      throw new HttpException('Brand already exists', HttpStatus.FORBIDDEN);
    }

    return this.prisma.brand.create({ data: dto });
  }

  async getAll() {
    return this.prisma.brand.findMany({ select: { id: true, name: true } });
  }
}
