import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class EditItemDto {
  @IsOptional()
  @IsString()
  @Min(10)
  @Max(200)
  description: string;

  @IsOptional()
  images: string[];

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  condition: number;
}
