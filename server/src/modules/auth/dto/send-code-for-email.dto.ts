import { IsString } from "class-validator";

export class SendCodeForEmailDto {
  @IsString()
  userId: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}