import { IsOptional, IsString } from "class-validator";

export class DeleteDeviceIdDto {
  @IsString()
  @IsOptional()
  activeLicenseId: string;

  @IsString()
  @IsOptional()
  mobileId?: string;

  @IsString()
  @IsOptional()
  desktopId?: string;
}
