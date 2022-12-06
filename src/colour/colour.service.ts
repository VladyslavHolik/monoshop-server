import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddColourDto } from './dto/add-colour.dto';

@Injectable()
export class ColourService {
  constructor(private prisma: PrismaService) {}

  async addColour(dto: AddColourDto) {
    const candidate = await this.prisma.colour.findFirst({
      where: { name: dto.name },
    });

    if (candidate) {
      throw new HttpException('Colour already exists', HttpStatus.FORBIDDEN);
    }

    return this.prisma.colour.create({ data: dto });
  }

  async getAll() {
    return this.prisma.colour.findMany({ select: { id: true, name: true } });
  }
}
