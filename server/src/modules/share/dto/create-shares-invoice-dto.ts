import { IsNumber, IsString } from "class-validator";

export class CreateSharesInvoiceDto {
  @IsString()
  userId: string;

  @IsNumber()
  quantity: number;
}
