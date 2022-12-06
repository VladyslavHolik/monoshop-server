import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditItemDto {
  // @IsOptional()
  // @IsString()
  // style: string;

  @IsOptional()
  images: string[];

  @IsOptional()
  @IsNumber()
  price: number;

  // @IsOptional()
  // @IsString()
  // size: string;

  // @IsOptional()
  // @IsString()
  // category: string;

  // @IsOptional()
  // @IsString()
  // brand: string;

  // @IsOptional()
  // @IsString()
  // colour: string;

  @IsOptional()
  @IsNumber()
  condition: number;
}
