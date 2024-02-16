import { IsString, MinLength, MaxLength, IsEmail, IsDefined } from "class-validator";

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  firstName: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  lastName: string;

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
