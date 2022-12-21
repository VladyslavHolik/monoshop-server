import { IsNotEmpty, IsString } from 'class-validator';

export class AddBrandDto {
  @IsNotEmpty()
  @IsString()
  value: string;
}
