import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '@prisma/client';

export class AddCategoryDto {
  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;
}
