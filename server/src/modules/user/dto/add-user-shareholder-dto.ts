import { IsEnum, IsString } from "class-validator";

import { ShareholderType } from "@prisma/client";

export class AddUserShareholderDataDto {
  @IsString()
  userId: string;

  @IsEnum(ShareholderType)
  shareholderType: ShareholderType;

  @IsString()
  name: string;

  @IsString()
  identificationNumber: string;

  @IsString()
  email: string;

  @IsString()
  address: string;

  @IsString()
  postcode: string;

  @IsString()
  city: string;

  @IsString()
  country: string;
}
