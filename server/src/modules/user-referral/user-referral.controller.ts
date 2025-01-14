import { Get, Controller, Param, Post, Body } from "@nestjs/common";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { UserReferralService } from "./user-referral.service";

import { CreateUserReferralDto } from "./dto/create-user-referral-dto";

@ApiTags("User referrals")
@Controller("user-referral")
export class UserReferralController {
  constructor(private readonly userReferralService: UserReferralService) {}

  @ApiOperation({ summary: "Create user referral" })
  @Post("/")
  async createReferral(@Body() createReferralDto: CreateUserReferralDto) {
    return await this.userReferralService.create(createReferralDto);
  }

  @ApiOperation({ summary: "Find user referrals" })
  @Get("/:userId")
  async findByUserId(@Param("userId") userId: string) {
    return await this.userReferralService.findByUserId(userId);
  }
}