import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

// import { LicenseTierType } from "@prisma/client";

export class CreateIntentDto {
  @ApiProperty({ description: "Amount", example: "200 - number" })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: "Currency", example: "EUR" })
  @IsString()
  currency: string;

  @ApiProperty({ description: "User ID", example: "qweqne21u4312873hd1w3i17" })
  @IsString()
  userId: string;

  @ApiProperty({ description: "User Referral Code", example: "qweqne21u4312873hd1w3i17" })
  @IsNumber()
  @IsOptional()
  userReferralCode?: number;

  // @IsEnum(LicenseTierType)
  // @IsString()
  // tierType: LicenseTierType;

  @ApiProperty({ description: "Limit", example: "25 - number" })
  @IsNumber()
  limit: number;
}
