import { IsString } from "class-validator";

export class CheckUserLicenseDto {
  @IsString()
  email: string;
}
