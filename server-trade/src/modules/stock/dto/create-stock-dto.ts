import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class CreateStockDto {
  @ApiProperty({ description: "Name", example: "Stock X" })
  @IsString()
  name: string

  @ApiProperty({ description: "Price", example: "22$ per each - number" })
  @IsNumber()
  price: number

  @ApiProperty({ description: "Total Quantity", example: "1000 - number" })
  @IsNumber()
  totalQuantity: number
}
