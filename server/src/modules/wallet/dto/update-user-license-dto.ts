import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateWalletDto {
  @IsString()
  id: string;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @IsOptional()
  bonusAmount?: number;

  @IsNumber()
  @IsOptional()
  sharesAmount?: number;
}
