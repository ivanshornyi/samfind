import { IsString } from "class-validator";

export class CreateMemberInvoiceDto {
  @IsString()
  memberId: string;

  @IsString()
  ownerId: string;
}
