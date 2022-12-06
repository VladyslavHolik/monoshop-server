import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StyleController } from './style.controller';
import { StyleService } from './style.service';

@Module({
  controllers: [StyleController],
  providers: [StyleService],
  imports: [PrismaModule],
})
export class StyleModule {}
