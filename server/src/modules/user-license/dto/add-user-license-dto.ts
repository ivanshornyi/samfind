import { IsString } from "class-validator";

export class AddUserLicenseDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsString()
  licenseId: string;
}