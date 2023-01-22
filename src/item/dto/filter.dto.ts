import { Gender, Size } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortBy } from '../sort-by.enum';

export class FilterDto {
  @Transform(({ value }) => value.map((num) => Number(num)))
  @IsNumber({}, { each: true })
  @IsOptional()
  price: number[];

  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((num) => Number(num)) : Number(value),
  )
  @IsNumber({}, { each: true })
  @IsOptional()
  subcategory: number[];

  @IsNumber({}, { each: true })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((num) => Number(num)) : Number(value),
  )
  condition: number[];

  @IsString({ each: true })
  @IsOptional()
  colour: string[];

  @IsString({ each: true })
  @IsOptional()
  style: string[];

  @IsString({ each: true })
  @IsOptional()
  brand: string[];

  @IsEnum(Size, { each: true })
  @IsOptional()
  size: Size[];

  @IsNumber()
  @IsOptional()
  category: number;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @IsString()
  @IsOptional()
  search: string;

  @IsEnum(SortBy)
  @IsOptional()
  sortBy: SortBy;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page: number;
}
