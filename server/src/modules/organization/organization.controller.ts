import { Controller, Post, Get, Param, Body } from "@nestjs/common";

import { ApiTags, ApiOperation } from "@nestjs/swagger";

import { OrganizationService } from "./organization.service";

import { CreateOrganizationDto } from "./dto/create-organization-dto";

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
}