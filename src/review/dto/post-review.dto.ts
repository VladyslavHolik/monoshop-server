import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class PostReviewDto {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  text: string;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  orderId: string;
}
