import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus, OrderType } from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePoolPurchaseDto {
  @ApiProperty({ description: "Stock ID", example: "qweqne21u4312873hd1w3i17" })
  @IsString()
  stockId: string

  @ApiProperty({ description: "User ID", example: "qweqne21u4312873hd1w3i17" })
  @IsString()
  userId: string;

  @ApiProperty({ description: "Type", example: "TYPE | SELL" })
  @IsString()
  type: OrderType

  @ApiProperty({ description: "Status", example: "PENDING - by auto" })
  @IsString()
  @IsOptional()
  status?: OrderStatus

  @ApiProperty({ description: "Quantity", example: "250 - number" })
  @IsNumber()
  quantity: number

  @ApiProperty({ description: "Price", example: "22$ per each - number" })
  @IsNumber()
  offeredPrice: number

  @ApiProperty({ description: "Payment ID", example: "qweqne21u4312873hd1w3i17" })
  @IsString()
  @IsOptional()
  paymentId?: string
}
