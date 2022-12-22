import {
  ArrayNotEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ArrayMaxSize,
  ArrayMinSize,
  Min,
  Max,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Colour, Gender, Size } from '@prisma/client';

export class CreateItemDto {
  @IsNotEmpty()
  style: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  images: string[];

  @IsOptional()
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  hashtags: string[];

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Size)
  size: Size;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  colour: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  condition: number;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  name: string;
}
