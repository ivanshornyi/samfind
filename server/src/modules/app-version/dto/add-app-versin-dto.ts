import { IsEnum, IsString } from "class-validator";

import { OsType } from "@prisma/client";

export class AddAppVersionDto {
  @IsString()
  version: string;

  @IsEnum(OsType)
  @IsString()
  osType: OsType;

  @IsString()
  url: string;
}
