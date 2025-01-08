import { IsString } from "class-validator";
import { UserAuthType, UserStatus } from "../types/user";

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  authType: UserAuthType;
}