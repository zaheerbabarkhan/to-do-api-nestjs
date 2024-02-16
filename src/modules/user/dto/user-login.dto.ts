import { IsDefined, IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class UserLoginDTO {
  @IsDefined()
  @IsString()
  @MaxLength(250)
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  password: string;



}