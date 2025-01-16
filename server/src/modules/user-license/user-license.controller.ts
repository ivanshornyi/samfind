import { Get, Post, Controller, Param, Body } from "@nestjs/common";

import { UserLicenseService } from "./user-license.service";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { AddUserLicenseDto } from "./dto/add-user-license-dto";

@ApiTags("User License")
@Controller("user-license")
export class UserLicenseController {
  constructor (private readonly licenseService: UserLicenseService) {}

  @ApiOperation({ summary: "Add license to user" })
  @Post("/")
  async addLicense(@Body() addUserLicenseDto: AddUserLicenseDto) {
    console.log(addUserLicenseDto);
    return this.licenseService.addLicense(addUserLicenseDto);
  }

  @ApiOperation({ summary: "Find license" })
  @Get("/:id")
  async findLicense(@Param("id") id: string) {
    return this.licenseService.findById(id);
  }

  @ApiOperation({ summary: "Find user licenses" })
  @Get("/find/:userId")
  async findLicenseByUserId(@Param("userId") userId: string) {
    return this.licenseService.findByUserId(userId);
  }
}