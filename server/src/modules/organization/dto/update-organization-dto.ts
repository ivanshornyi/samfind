import { IsString, IsOptional, IsArray } from "class-validator";

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsOptional()
  domains?: string[];

  @IsArray()
  @IsOptional()
  availableEmails?: string[];
}