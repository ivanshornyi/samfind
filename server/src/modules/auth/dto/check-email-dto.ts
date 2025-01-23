import { IsEmail, IsString } from "class-validator";

export class CheckEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  organizationId: string;
}