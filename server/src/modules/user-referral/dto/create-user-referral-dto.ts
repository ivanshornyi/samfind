import { IsString } from "class-validator";

export class CreateUserReferralDto {
  @IsString()
  userId: string;
}