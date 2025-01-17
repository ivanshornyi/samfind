import { IsNumber, IsOptional, IsString } from "class-validator";

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
}