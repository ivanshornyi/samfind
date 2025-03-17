import {
  Body,
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  Get,
  Param,
} from "@nestjs/common";

import { AppVersionService } from "./app-version.service";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AddAppVersionDto } from "./dto/add-app-versin-dto";
import { EXCEPTION } from "src/common/constants/exception.constant";
import { OsType } from "@prisma/client";

@ApiTags("App Version")
@Controller("app-version")
export class AppVersionController {
  constructor(
    private readonly appVersionService: AppVersionService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: "Add App Version" })
  @Post("/")
  async addAppVersion(
    @Headers("authorization") authHeader: string,
    @Body() addAppVersionDto: AddAppVersionDto,
  ) {
    const secret = this.configService.get("DEVICE_SECRET");
    if ("Bearer " + secret !== authHeader)
      throw new UnauthorizedException(EXCEPTION.INVALID_TOKEN);
    return await this.appVersionService.addAppVersion(addAppVersionDto);
  }

  @ApiOperation({ summary: "Get last App Version" })
  @Get("/:os")
  async getLastAppVersion(
    @Headers("authorization") authHeader: string,
    @Param("os") os: OsType,
  ) {
    const secret = this.configService.get("DEVICE_SECRET");
    if ("Bearer " + secret !== authHeader)
      throw new UnauthorizedException(EXCEPTION.INVALID_TOKEN);

    if (!Object.values(OsType).includes(os)) {
      return {
        error: "Version not found",
      };
    }
    return await this.appVersionService.getLastAppVersion(os);
  }
}
