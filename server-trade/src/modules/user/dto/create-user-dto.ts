import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ description: "First Name", example: "Jonny" })
  @IsString()
  firstName: string

  @ApiProperty({ description: "Last Name", example: "Depp" })
  @IsString()
  lastName: string

  @ApiProperty({ description: "Email", example: "something@example.com" })
  @IsString()
  email: string

  @ApiProperty({ description: "Stripe ID", example: "qweqne21u4312873hd1w3i17" })
  @IsString()
  @IsOptional()
  stripeCustomerId?: string
}
