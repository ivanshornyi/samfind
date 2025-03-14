import { IsNumber, IsString } from "class-validator";

export class AddPreRegisterBonusDto {
  @IsString()
  email: string;

  @IsNumber()
  amount: number;
}
