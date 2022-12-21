import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddStyleDto } from './dto/add-style.dto';

@Injectable()
export class StyleService {
  constructor(private prisma: PrismaService) {}

  async addStyle(dto: AddStyleDto) {
    const candidate = await this.prisma.style.findFirst({
      where: { value: dto.value },
    });

    if (candidate) {
      throw new HttpException('Style already exists', HttpStatus.FORBIDDEN);
    }

    return this.prisma.style.create({ data: dto });
  }

  async getAll() {
    const styles = await this.prisma.style.findMany({
      select: { value: true },
    });

    const mapped = styles.map((item) => {
      return {
        ...item,
        label: item.value,
      };
    });

    return mapped;
  }
}
