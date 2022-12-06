import { IsNotEmpty, IsString } from 'class-validator';

export class AddSizeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
