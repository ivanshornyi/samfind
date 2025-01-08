import { IsString } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  email: string;

  @IsString()
  verificationCode: string;

  @IsString()
  newPassword: string;
}