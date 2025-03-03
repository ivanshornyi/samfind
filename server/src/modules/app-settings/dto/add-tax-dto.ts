import { IsNumber, IsString } from "class-validator";

export class AddTaxDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  percentage: number;
}
