import { IsOptional, IsString, IsBoolean, IsDate, IsEnum } from "class-validator";

import { UserStatus } from "../types/user";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsString()
  @IsOptional()
  status?: UserStatus;

  @IsOptional()
  @IsString()
  resetCode?: string;

  @IsOptional()
  @IsDate()
  resetCodeExpiresAt?: Date;

  @IsOptional()
  @IsString()
  emailResetCode?: string;

  @IsOptional()
  @IsDate()
  emailResetCodeExpiresAt?: Date;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  @IsString()
  registrationCode?: string;

  @IsOptional()
  @IsDate()
  registrationCodeExpiresAt?: Date;
}
