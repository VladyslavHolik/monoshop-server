import { Module } from '@nestjs/common';
import { ColourService } from './colour.service';
import { ColourController } from './colour.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ColourController],
  providers: [ColourService],
  imports: [PrismaModule],
})
export class ColourModule {}
