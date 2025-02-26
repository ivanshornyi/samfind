import { IsNumber, IsString } from "class-validator";

export class UpdateStockDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number

  @IsNumber()
  totalQuantity: number
}
