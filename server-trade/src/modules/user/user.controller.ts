import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiTags, } from '@nestjs/swagger'

import { UserService } from './user.service'
import { OrderType } from 'src/common/types/order-type'
import { ValidateIdDto } from 'src/common/types/id-validation-dto'
import { CreateUserDto } from './dto/create-user-dto'


@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: "Create User" })
  @Post("/")
  async signUpNewUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto)
  }

  @ApiOperation({ summary: "Find Users with pagination" })
  @Get("/")
  async findAllUsersWithPagination(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("order") order: OrderType
  ) {
    return await this.userService.getAllUsersWithPagination(page, limit, order)
  }

  @ApiOperation({ summary: "Get User By Id" })
  @Get("/:id")
  async findUserById(@Param() params: ValidateIdDto) {
    return await this.userService.getUserById(params.id.trim())
  }

  @ApiOperation({ summary: "Delete User By Id" })
  @Delete("/:id")
  async deleteUserById(@Param() params: ValidateIdDto) {
    return await this.userService.deleteUserByid(params.id.trim())
  }
}
