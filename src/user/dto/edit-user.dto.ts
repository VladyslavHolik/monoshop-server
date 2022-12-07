import { IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  image: string;
}
