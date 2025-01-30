import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class DiscountDto {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;
}

export class AddSubscriptionDto {
  @IsString()
  userId: string;

  @IsString()
  planId: string;

  @IsString()
  licenseId: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => DiscountDto)
  discount?: DiscountDto;
}
