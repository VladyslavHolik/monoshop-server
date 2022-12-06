import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddStyleDto } from './dto/add-style.dto';

@Injectable()
export class StyleService {
  constructor(private prisma: PrismaService) {}

  async addStyle(dto: AddStyleDto) {
    const candidate = await this.prisma.size.findFirst({
      where: { name: dto.name },
    });

    if (candidate) {
      throw new HttpException('Style already exists', HttpStatus.FORBIDDEN);
    }

    return this.prisma.style.create({ data: dto });
  }

  async getAll() {
    return this.prisma.style.findMany({ select: { id: true, name: true } });
  }
}
