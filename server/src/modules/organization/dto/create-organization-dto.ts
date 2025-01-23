import { IsOptional, IsString } from "class-validator";

export class CreateOrganizationDto {
  @IsString()
  ownerId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  domain?: string;

  @IsString()
  VAT: string;

  @IsString()
  businessOrganizationNumber: string;
}