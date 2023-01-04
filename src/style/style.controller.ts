import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import Role from 'src/auth/role.enum';
import RoleGuard from 'src/auth/roles.guard';
import { AddStyleDto } from './dto/add-style.dto';
import { StyleService } from './style.service';

@Controller('style')
export class StyleController {
  constructor(private readonly styleService: StyleService) {}

  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  @Post()
  addStyle(@Body() dto: AddStyleDto) {
    return this.styleService.addStyle(dto);
  }

  @Get()
  getAll() {
    return this.styleService.getAll();
  }

  @Get('popular')
  getPopular() {
    return this.styleService.getPopular();
  }
}
