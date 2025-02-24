import { PurchaseType } from "@prisma/client";
import { IsEnum, IsNumber, IsString } from "class-validator";

export class BySharesDto {
  @IsString()
  userId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsEnum(PurchaseType)
  purchaseType: PurchaseType;
}
