import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly fullName: string;
}
