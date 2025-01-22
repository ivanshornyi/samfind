import { IsEmail, IsString } from "class-validator";

export class AuthVerificationDto {
  @IsEmail()
  email: string;

  @IsString()
  verificationCode: string;
}