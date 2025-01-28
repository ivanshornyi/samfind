import { IsString, IsEmail } from "class-validator";

export class CheckDomainDto {
  @IsString()
  domain: string;

  @IsEmail()
  email: string;
}