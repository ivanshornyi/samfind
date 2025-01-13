import { Get, Controller, Param } from "@nestjs/common";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { UserReferralService } from "./user-referral.service";

@ApiTags("User referrals")
@Controller("user-referral")
export class UserReferralController {
  constructor(private readonly userReferralService: UserReferralService) {}

  @ApiOperation({ summary: "Find user referrals" })
  @Get("/:userId")
  async findByUserId(@Param("userId") userId: string) {
    return this.userReferralService.findByUserId(userId);
  }
}