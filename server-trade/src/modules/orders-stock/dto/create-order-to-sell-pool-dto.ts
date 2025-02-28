import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateOrderToSellToPool {
  @ApiProperty({ description: "Stock ID", example: "qweqne21u4312873hd1w3i17" })
  @IsString()
  stockId: string

  @ApiProperty({ description: "Quantity", example: "250 - number" })
  @IsNumber()
  quantity: number

  @ApiProperty({ description: "Price", example: "22$ per each - number" })
  @IsNumber()
  offeredPrice: number
}
