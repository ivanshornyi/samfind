import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

import { UserAccountType, UserAuthType } from "@prisma/client";

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  authType: UserAuthType;

  @IsString()
  registrationCode: string;

  @IsDate()
  registrationCodeExpiresAt: Date;

  @IsString()
  accountType: UserAccountType;

  @IsNumber()
  @IsOptional()
  invitedReferralCode?: number;
}
