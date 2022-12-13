import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '@prisma/client';

export class AddCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
