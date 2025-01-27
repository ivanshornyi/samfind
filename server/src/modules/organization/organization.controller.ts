import { Controller, Post, Get, Param, Body, Patch } from "@nestjs/common";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { OrganizationService } from "./organization.service";

import { CreateOrganizationDto } from "./dto/create-organization-dto";
import { UpdateOrganizationDto } from "./dto/update-organization-dto";

@ApiTags("Organization")
@Controller("organization")
export class OrganizationController {
  constructor (private readonly organizationService: OrganizationService) {}

  @ApiOperation({ summary: "Create organization" })
  @Post("/")
  async createOrganization(@Body() createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationService.create(createOrganizationDto);
  }

  @ApiOperation({ summary: "Find organization" })
  @Get("/:id")
  async findOrganization(@Param("id") id: string) {
    console.log(id);
  }

  @ApiOperation({ summary: "Update organization" })
  @Patch("/:id")
  async updateOrganization(@Param("id") id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return await this.organizationService.update(id, updateOrganizationDto);
  }
}