import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateUserLicenseDto {
  @IsArray()
  @IsOptional()
  availableEmails?: string[];
}