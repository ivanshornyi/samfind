import { IsNumber, IsString } from "class-validator";

export class CreateOrderToSellToPool {
  @IsString()
  stockId: string

  @IsNumber()
  quantity: number

  @IsNumber()
  offeredPrice: number
}
