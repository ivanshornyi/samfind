import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Query,
  ParseArrayPipe,
  Delete,
} from "@nestjs/common";

import { User } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { UserService } from "./user.service";

import { ApiOperation, ApiTags, ApiQuery } from "@nestjs/swagger";

import { UpdateUserDto } from "./dto/update-user-dto";
import { FindUserDto } from "./dto/find-user-dto";

// import { RefreshGuard } from "src/common/guards/refresh.guard";

// import { AuthenticatedRequest } from "src/common/types/interfaces/auth-request.interface";

@ApiTags("Users")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @UseGuards(RefreshGuard)
  @ApiOperation({ summary: "Find all users" })
  @ApiQuery({
    name: "offset",
    type: Number,
    description: "Start of range",
    required: true,
  })
  @ApiQuery({
    name: "limit",
    type: Number,
    description: "End of range",
    required: true,
  })
  @ApiQuery({
    name: "name",
    type: String,
    description: "User name",
    required: false,
  })
  @Get("/find")
  async find(
    // @Req() req: AuthenticatedRequest
    @Query() findUserDto: FindUserDto,
  ): Promise<User[]> {
    return this.userService.findAll(findUserDto);
  }

  @ApiOperation({ summary: "Find one user" })
  @Get("/:id")
  async findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: "Update user" })
  @Patch("/:id")
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: "Find users by ids" })
  @Get("/find/find-by-ids")
  async findUsersByIds(@Query("userId", new ParseArrayPipe()) ids: string[]) {
    return this.userService.findUsersByIds(ids);
  }

  @ApiOperation({ summary: "Update user discount by referral code" })
  @Patch("/referral/:referralCode")
  async updateUserByReferralCode(
    @Param("referralCode") referralCode: number,
    @Body() dto: { newUserId: string; discount: number },
  ) {
    const user = await this.userService.findOne(dto.newUserId);

    return this.userService.findAndUpdateUserByReferralCode(
      referralCode,
      user,
      dto.discount,
    );
  }

  @ApiOperation({ summary: "Get domain info" })
  @Get("/check-user-email/:email")
  async getDomainInfo(@Param("email") email: string) {
    // find license and users by this domain and email
  }

  @ApiOperation({ summary: "Delete user" })
  @Delete("/:id")
  async deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: "Find user subscription info" })
  @Get("/subscription-info/:userId")
  async findUserSubscriptionInfo(@Param("userId") userId: string) {
    // find user information, where he has subscription, type of subscription, in other license and organization or not
    return this.userService.findUserSubscriptionInfo(userId);
  }

  @ApiOperation({ summary: "Find user invited user info" })
  @Get("/find-invited-user/info/:userId")
  async getInvitedUserInfo(@Param("userId") userId: string) {
    return this.userService.findInvitedUserInfo(userId);
  }
}
