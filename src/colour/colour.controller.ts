import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import Role from 'src/auth/role.enum';
import RoleGuard from 'src/auth/roles.guard';
import { ColourService } from './colour.service';
import { AddColourDto } from './dto/add-colour.dto';

@Controller('colour')
export class ColourController {
  constructor(private readonly colourService: ColourService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard(Role.Admin))
  addColour(@Body() dto: AddColourDto) {
    return this.colourService.addColour(dto);
  }

  @Get()
  getAll() {
    return this.colourService.getAll();
  }
}
