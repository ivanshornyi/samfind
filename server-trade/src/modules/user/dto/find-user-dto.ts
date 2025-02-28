import { IsNumber, IsOptional, IsString } from "class-validator"
import { Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class FindUserDto {
  @ApiProperty({ description: "Offset", example: "2 - number" })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  offset: number

  @ApiProperty({ description: "Limit", example: "25 per page - number" })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  limit: number

  @ApiProperty({ description: "Name", example: "Jonny" })
  @IsString()
  @IsOptional()
  name?: string
}
