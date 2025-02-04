import { IsString, IsOptional } from "class-validator";

export class CheckDeviceDto {
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  computer_id?: string;

  @IsOptional()
  @IsString()
  mobile_id?: string;
}
