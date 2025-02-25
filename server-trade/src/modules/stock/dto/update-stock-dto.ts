import { IsNumber, IsString } from "class-validator";

export class UpdateStockDto {
  @IsString()
  stockName: string;

  @IsNumber()
  price: number

  @IsNumber()
  quantity: number
}
