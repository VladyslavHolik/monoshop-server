import { Body, Controller, Get, Post } from '@nestjs/common';
import { ColourService } from './colour.service';
import { AddColourDto } from './dto/add-colour.dto';

@Controller('colour')
export class ColourController {
  constructor(private readonly colourService: ColourService) {}

  @Post()
  addColour(@Body() dto: AddColourDto) {
    return this.colourService.addColour(dto);
  }

  @Get()
  getAll() {
    return this.colourService.getAll();
  }
}
