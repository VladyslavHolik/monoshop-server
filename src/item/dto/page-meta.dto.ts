import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class PageMetaDto {
  @IsNumber()
  @IsNotEmpty()
  page: number;
}
