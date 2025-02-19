import {
  Get,
  Post,
  Patch,
  Controller,
  Param,
  Body,
  Headers,
  UnauthorizedException,
  Delete,
} from "@nestjs/common";

import { UserLicenseService } from "./user-license.service";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { AddUserLicenseDto } from "./dto/add-user-license-dto";
import { UpdateUserLicenseDto } from "./dto/update-user-license-dto";
import { CheckDeviceDto } from "./dto/check-device-dto";
import { ConfigService } from "@nestjs/config";
import { EXCEPTION } from "src/common/constants/exception.constant";
import { CheckUserLicenseDto } from "./dto/check-user-license-dto";
import { DeleteDeviceIdDto } from "./dto/delete-device-id-dto";

@ApiTags("User License")
@Controller("user-license")
export class UserLicenseController {
  constructor(
    private readonly licenseService: UserLicenseService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: "Add license to user" })
  @Post("/")
  async addLicense(@Body() addUserLicenseDto: AddUserLicenseDto) {
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

  @ApiOperation({ summary: "Update user license" })
  @Patch("/:id")
  async updateLicense(
    @Param("id") id: string,
    @Body() updateUserLicenseDto: UpdateUserLicenseDto,
  ) {
    return this.licenseService.update(id, updateUserLicenseDto);
  }

  @ApiOperation({ summary: "Check the device for license connected" })
  @Post("/device")
  async checkDevice(
    @Headers("authorization") authHeader: string,
    @Body() checkDeviceDto: CheckDeviceDto,
  ) {
    const secret = this.configService.get("DEVICE_SECRET");
    if ("Bearer " + secret !== authHeader)
      throw new UnauthorizedException(EXCEPTION.INVALID_TOKEN);
    return await this.licenseService.checkDevice(checkDeviceDto);
  }

  @ApiOperation({ summary: "Check mobile device for license connected" })
  @Post("/mobile-device")
  async checkMobileDevice(@Body() checkDeviceDto: CheckDeviceDto) {
    return await this.licenseService.checkDevice(checkDeviceDto);
  }

  @ApiOperation({ summary: "Deactivate user license" })
  @Post("/deactivate/:id")
  async deactivateLicense(@Param("id") id: string) {
    return this.licenseService.deactivateLicense(id);
  }

  @ApiOperation({ summary: "Delete member from license" })
  @Delete("/:id/member/:memberId")
  async deleteMemberFromLicense(
    @Param("id") id: string,
    @Param("memberId") memberId: string,
  ) {
    return this.licenseService.deleteMemberFromLicense(id, memberId);
  }

  @ApiOperation({ summary: "Get user active license" })
  @Get("/active-license/:id")
  async getUserActiveLicense(@Param("id") id: string) {
    return this.licenseService.getUserActiveLicense(id);
  }

  @ApiOperation({ summary: "Delete device id from license" })
  @Delete("/device")
  async deleteDeviceIdFromLicense(
    @Body() deleteDeviceIdDto: DeleteDeviceIdDto,
  ) {
    return this.licenseService.deleteDeviceIdFromLicense(deleteDeviceIdDto);
  }
}
