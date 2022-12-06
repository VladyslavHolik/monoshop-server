import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddSizeDto } from './dto/add-size.dto';

@Injectable()
export class SizeService {
  constructor(private prisma: PrismaService) {}

  async addSize(dto: AddSizeDto) {
    const candidate = await this.prisma.size.findFirst({
      where: { name: dto.name },
    });

    if (candidate) {
      throw new HttpException('Size already exists', HttpStatus.FORBIDDEN);
    }

    return this.prisma.size.create({ data: dto });
  }

  async getAll() {
    return this.prisma.size.findMany({ select: { id: true, name: true } });
  }
}
