import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddColourDto } from './dto/add-colour.dto';

@Injectable()
export class ColourService {
  constructor(private prisma: PrismaService) {}

  async addColour(dto: AddColourDto) {
    const candidate = await this.prisma.colour.findFirst({
      where: { value: dto.value },
    });

    if (candidate) {
      throw new HttpException('Colour already exists', HttpStatus.FORBIDDEN);
    }

    return await this.prisma.colour.create({ data: dto });
  }

  async getAll() {
    const colors = await this.prisma.colour.findMany({
      select: { value: true, hexCode: true },

    });

    const mapped = colors.map((item) => {
      return {
        ...item,
        label: item.value,
      };
    });

    return mapped;
  }
}
