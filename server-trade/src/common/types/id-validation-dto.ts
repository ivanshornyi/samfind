import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class ValidateIdDto {
  @ApiProperty({ description: "User ID", example: "qweqne21u4312873hd1w3i17" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!:id$).*$/, { message: "ID cannot be ':id' or empty id." })
  id: string
}
