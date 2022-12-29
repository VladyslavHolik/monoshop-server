import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  @MinLength(9)
  @MaxLength(12)
  phone: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  location: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  fullName: string;
}
