import { IsString, IsEmail } from "class-validator";

export class SendSupportEmailDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  category: string;

  @IsString()
  message: string;
}
