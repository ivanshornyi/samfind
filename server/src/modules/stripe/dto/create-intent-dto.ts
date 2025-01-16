import { IsNumber, IsString } from "class-validator";

export class CreateIntentDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  userId: string;

  @IsString()
  licenseName: string;

  @IsString()
  licenseKey: string;
}