import { IsNumber, IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateSharesInvoiceDto {
  @IsString()
  userId: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsBoolean()
  trading?: boolean;

  @IsOptional()
  @IsString()
  stockId?: string;
}
