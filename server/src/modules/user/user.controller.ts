import { Controller, Get, Param, Patch, Body, Query } from "@nestjs/common";

import { UserService } from "./user.service";
import { User } from "./entities/user.entity";

import { ApiOperation, ApiTags, ApiQuery } from "@nestjs/swagger";

import { UpdateUserDto } from "./dto/update-user-dto";

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
  @Get("/find")
  async findAll(
    // @Req() req: AuthenticatedRequest`
    @Query("offset") offset: number,
    @Query("limit") limit: number,
  ): Promise<User[]> {
    return this.userService.findAll(offset, limit);
  }

  @ApiOperation({ summary: "Find one user" })
  @Get("/:id")
  async findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: "Update user" })
  @Patch("/:id")
  async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
