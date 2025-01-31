import { IsNumber, IsString, IsEnum } from "class-validator";

import { LicenseTierType, PlanPeriod } from "@prisma/client";

export class CreatePlanDto {
  @IsNumber()
  price: number;

  @IsEnum(LicenseTierType)
  @IsString()
  type: LicenseTierType;

  @IsEnum(PlanPeriod)
  @IsString()
  period: PlanPeriod;
}
