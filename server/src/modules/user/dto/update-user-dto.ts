import { IsOptional, IsString, IsNumber } from "class-validator";

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
  @IsNumber()
  resetCodeExpiresAt?: number;

  @IsOptional()
  @IsString()
  emailResetCode?: string;

  @IsOptional()
  @IsNumber()
  emailResetCodeExpiresAt?: number;

  // @IsString()
  // @IsOptional()
  // logo?: string;
}