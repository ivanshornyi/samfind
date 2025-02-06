import { IsArray, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserLicenseDto {
  @IsArray()
  @IsOptional()
  @IsEmail({}, { each: true })
  availableEmails?: string[];
}
