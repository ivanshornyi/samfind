import { IsNumber, IsString } from "class-validator";

export class CreateStockDto {
  @IsString()
  email: string

  @IsString()
  stockName: string;

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsString()
  externalUserId: string

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
