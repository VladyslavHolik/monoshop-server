import { IsNotEmpty, IsString } from 'class-validator';

export class AddStyleDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
