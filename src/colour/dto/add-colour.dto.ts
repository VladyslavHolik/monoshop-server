import { IsNotEmpty, IsString } from 'class-validator';

export class AddColourDto {
  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  hexCode: string;
}
