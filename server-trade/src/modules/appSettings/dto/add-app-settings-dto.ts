import { IsNumber, IsBoolean, IsOptional } from "class-validator";

export class AddAppSettingsDto {
  @IsOptional()
  @IsNumber()
  sharePrice?: number;

  @IsOptional()
  @IsNumber()
  limitOfSharesPurchased: number;

  @IsOptional()
  @IsNumber()
  currentSharesPurchased: number;

  @IsOptional()
  @IsBoolean()
  earlyBirdPeriod: boolean;
}
