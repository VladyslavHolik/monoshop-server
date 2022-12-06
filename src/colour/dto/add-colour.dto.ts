import { IsNotEmpty, IsString } from 'class-validator';

export class AddColourDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
