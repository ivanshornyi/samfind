import { IsString } from "class-validator";

export class CheckDeviceDto {
  @IsString()
  email?: string;

  @IsString()
  computer_id: string;
}
