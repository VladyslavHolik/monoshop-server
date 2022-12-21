import { IsNotEmpty, IsString } from 'class-validator';

export class AddSizeDto {
  @IsNotEmpty()
  @IsString()
  value: string;
}
