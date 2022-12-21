import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddSizeDto } from './dto/add-size.dto';

@Injectable()
export class SizeService {
  constructor(private prisma: PrismaService) {}

  async addSize(dto: AddSizeDto) {
    // const candidate = await this.prisma.size.findFirst({
    //   where: { value: dto.value },
    // });
    // if (candidate) {
    //   throw new HttpException('Size already exists', HttpStatus.FORBIDDEN);
    // }
    // return this.prisma.size.create({ data: dto });
  }

  async getAll() {
    // const sizes = await this.prisma.size.findMany({ select: { value: true } });
    // const mapped = sizes.map((item) => {
    //   return {
    //     ...item,
    //     label: item.value,
    //   };
    // });
    // return mapped;
  }
}
