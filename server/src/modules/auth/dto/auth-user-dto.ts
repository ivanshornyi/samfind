import {
  IsString,
  IsOptional,
  IsEmail,
  IsNumber,
} from "class-validator";

import { UserAuthType } from "src/modules/user/types/user";

export class AuthUserDto {
  @IsString()
  authType: UserAuthType;
}

export class SignInDto extends AuthUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class SignUpDto extends SignInDto {
  @IsString()
  @IsOptional()
  firstName: string;
  
  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
