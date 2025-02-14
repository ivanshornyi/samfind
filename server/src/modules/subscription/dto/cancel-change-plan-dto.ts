import { IsString } from "class-validator";

export class CancelChangePlanDto {
  @IsString()
  subscriptionId: string;
}
