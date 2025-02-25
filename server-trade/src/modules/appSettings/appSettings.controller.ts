import { Body, Controller, Get, Post } from "@nestjs/common";

import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppSettingsService } from "./appSettings.service";
import { AddAppSettingsDto } from "./dto/add-app-settings-dto";

@ApiTags("Share")
@Controller("app-settings")
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @ApiOperation({ summary: "Add App Settings" })
  @Post("/")
  async addSettings(@Body() addAppSettingsDto: AddAppSettingsDto) {
    return await this.appSettingsService.addSettings(addAppSettingsDto);
  }

  @ApiOperation({ summary: "Create Invoice to buy" })
  @Get("/")
  async getAppSettings() {
    return await this.appSettingsService.getAppSettings();
  }
}
