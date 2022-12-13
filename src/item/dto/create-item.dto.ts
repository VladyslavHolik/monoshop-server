import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateItemDto {
  @IsNotEmpty()
  style: string;

  @IsNotEmpty()
  images: string[];

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  colour: string;

  @IsNotEmpty()
  @IsNumber()
  condition: number;
}
