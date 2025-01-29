import { IsEmail } from "class-validator";

export class CheckUserDto {
  @IsEmail()
  email: string;
}