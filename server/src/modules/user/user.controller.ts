import { Controller, Get, Param, Patch, Body, Query } from "@nestjs/common";

import { UserService } from "./user.service";
import { User } from "./entities/user.entity";

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
  async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
