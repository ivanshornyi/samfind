import { IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class FindUserDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  offset: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number;

  @IsString()
  @IsOptional()
  name?: string;
}