import {
  IsString,
  IsOptional,
  IsEmail,
  ValidateNested,
  IsNumber,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";

import { UserAccountType } from "@prisma/client";

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

  @IsString()
  @IsOptional()
  mobileId: string;
}

export class SignUpOrganizationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  businessOrganizationNumber?: string;

  @IsString()
  @IsOptional()
  VAT?: string;

  @IsArray()
  @IsOptional()
  domains?: string[];
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

  @IsString()
  accountType: UserAccountType;

  @ValidateNested()
  @Type(() => SignUpOrganizationDto)
  @IsOptional()
  organization?: SignUpOrganizationDto;

  @IsNumber()
  @IsOptional()
  invitedReferralCode?: number;
}
