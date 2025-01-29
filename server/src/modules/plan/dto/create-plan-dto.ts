import { IsNumber, IsString, IsEnum } from "class-validator";

import { PlanType, PlanPeriod } from "@prisma/client";

export class CreatePlanDto {
  @IsNumber()
  price: number;

  @IsEnum(PlanType)
  @IsString()
  type: PlanType;

  @IsEnum(PlanPeriod)
  @IsString()
  period: PlanPeriod;
}
