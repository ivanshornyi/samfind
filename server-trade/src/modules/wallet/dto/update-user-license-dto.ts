import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateWalletDto {
  @ApiProperty({ description: "Wallet ID", example: "qweqne21u4312873hd1w3i17" })
  @IsString()
  id: string;

  @ApiProperty({ description: "Discount Amount", example: "200 - number" })
  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @ApiProperty({ description: "Bonus Amount", example: "150 - number" })
  @IsNumber()
  @IsOptional()
  bonusAmount?: number;

  @ApiProperty({ description: "Shares Amount", example: "400 - number" })
  @IsNumber()
  @IsOptional()
  sharesAmount?: number;
}
