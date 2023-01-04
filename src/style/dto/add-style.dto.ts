import { IsNotEmpty, IsString } from 'class-validator';

export class AddStyleDto {
  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}
