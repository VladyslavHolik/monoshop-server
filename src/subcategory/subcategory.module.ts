import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
  imports: [PrismaModule],
})
export class CategoryModule {}
