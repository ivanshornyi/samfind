import { IsOptional, IsString, IsBoolean, IsDate } from "class-validator";

import { UserStatus } from "../types/user";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({ description: "First Name", example: "Jonny" })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: "Last Name", example: "Depp" })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: "Email", example: "something@example.com" })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: "Password", example: "somethingA1234" })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: "Refresh Token", example: "qweqne21u4312873hd1w3i17" })
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @ApiProperty({ description: "Status", example: "inactive - string" })
  @IsString()
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ description: "Reset Code", example: "qweqne21u4312873hd1w3i17" })
  @IsOptional()
  @IsString()
  resetCode?: string;

  @ApiProperty({ description: "Reset Code Expires At", example: "Date - object" })
  @IsOptional()
  @IsDate()
  resetCodeExpiresAt?: Date;

  @ApiProperty({ description: "Email Reset Code", example: "qweqne21u4312873hd1w3i17" })
  @IsOptional()
  @IsString()
  emailResetCode?: string;

  @ApiProperty({ description: "Email Reset Code Expires At", example: "Date - object" })
  @IsOptional()
  @IsDate()
  emailResetCodeExpiresAt?: Date;

  @ApiProperty({ description: "Is Verified", example: "boolean" })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty({ description: "Registration Code", example: "qweqne21u4312873hd1w3i17" })
  @IsOptional()
  @IsString()
  registrationCode?: string;

  @ApiProperty({ description: "Registration Code Expires At", example: "Date - object" })
  @IsOptional()
  @IsDate()
  registrationCodeExpiresAt?: Date;
}
