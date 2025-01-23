import { IsEmail, IsString, IsOptional } from "class-validator";

export class AuthVerificationDto {
  @IsEmail()
  email: string;

  @IsString()
  verificationCode: string;

  @IsString()
  @IsOptional()
  organizationId?: string;

  @IsString()
  @IsOptional()
  licenseId?: string;
}