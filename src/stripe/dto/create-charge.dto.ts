import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

class CreateChargeDto {
  @IsNumber()
  itemId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  line1: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  line2?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  state: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(100000)
  @Max(999999)
  postalCode: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  country: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  phone: string;
}

export default CreateChargeDto;
