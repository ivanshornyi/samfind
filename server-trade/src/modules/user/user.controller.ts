import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags, } from '@nestjs/swagger'

import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user-dto'


@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: "Create user" })
  @Post("/")
  async signUpNewUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto)
  }
}
