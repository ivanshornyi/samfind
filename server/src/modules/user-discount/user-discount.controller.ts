import { Controller, Get, Param } from "@nestjs/common";

import { UserDiscountService } from "./user-discount.service";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("User License")
@Controller("user-discount")
export class UserDiscountController {
  constructor (private readonly userDiscountService: UserDiscountService) {}

  @ApiOperation({ summary: "Get user discount" })
  @Get("/:userId")
  async getUserDiscount(@Param("userId") userId: string) {
    
  }
}