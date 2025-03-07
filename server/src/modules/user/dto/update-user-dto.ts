import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsEnum,
  ValidateNested,
} from "class-validator";

import { UserStatus } from "../types/user";
import { UserAccountType } from "@prisma/client";
import { Type } from "class-transformer";

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

  @IsEnum(UserAccountType)
  @IsOptional()
  accountType?: UserAccountType;

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

  @IsOptional()
  @IsString()
  languageCode?: string;

  @IsOptional()
  @IsString()
  languageName?: string;

  // @IsString()
  // @IsOptional()
  // logo?: string;
}
