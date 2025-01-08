import { Controller, Get, Param, Patch, Body } from "@nestjs/common";

import { UserService } from "./user.service";
import { User } from "./entities/user.entity";

import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { UpdateUserDto } from "./dto/update-user-dto";

@ApiTags("Users")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Find one user" })
  @Get("/:id")
  async findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: "Find all users" })
  @Get("/")
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: "Update user" })
  @Patch("/:id")
  async updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
