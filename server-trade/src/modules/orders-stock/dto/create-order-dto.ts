import { OrderStatus, OrderType } from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStockOrderDto {
  @IsString()
  stockId: string

  @IsString()
  userId: string;

  @IsString()
  type: OrderType

  @IsString()
  @IsOptional()
  status?: OrderStatus

  @IsNumber()
  quantity: number

  @IsNumber()
  offeredPrice: number

  @IsString()
  @IsOptional()
  paymentId?: string
}
