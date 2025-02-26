import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsString()
  email: string

  @IsString()
  @IsOptional()
  stripeCustomerId?: string
}
