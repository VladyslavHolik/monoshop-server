import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import Role from 'src/auth/role.enum';
import RoleGuard from 'src/auth/roles.guard';
import { AddSizeDto } from './dto/add-size.dto';
import { SizeService } from './size.service';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  addSize(@Body() dto: AddSizeDto) {
    return this.sizeService.addSize(dto);
  }

  @Get()
  getAll() {
    return this.sizeService.getAll();
  }
}
