import { IsNumber, IsOptional, IsString, IsEnum } from "class-validator";

import { LicenseTierType } from "@prisma/client";

export class CreateIntentDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  userId: string;

  @IsNumber()
  @IsOptional()
  userReferralCode?: number;

  @IsEnum(LicenseTierType)
  @IsString()
  tierType: LicenseTierType;

  @IsNumber()
  count: number;
}