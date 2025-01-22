import { IsEnum, IsNumber, IsString } from "class-validator";

import { LicenseTierType } from "@prisma/client";

export class AddUserLicenseDto {
  @IsString()
  ownerId: string;

  @IsEnum(LicenseTierType)
  @IsString()
  tierType: LicenseTierType;

  @IsNumber()
  count: number;
}