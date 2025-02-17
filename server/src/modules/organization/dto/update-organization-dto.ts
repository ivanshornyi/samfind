import { IsString, IsOptional, IsArray } from "class-validator";

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  businessOrganizationNumber?: string;

  @IsString()
  @IsOptional()
  VAT?: string;

  @IsArray()
  @IsOptional()
  domains?: string[];

  @IsArray()
  @IsOptional()
  availableEmails?: string[];
}
