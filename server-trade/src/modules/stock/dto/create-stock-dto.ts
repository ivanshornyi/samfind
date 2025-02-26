import { IsNumber, IsString } from "class-validator";

export class CreateStockDto {
  @IsString()
  name: string

  @IsNumber()
  totalQuantity: number;

  @IsNumber()
  price: number;
}
