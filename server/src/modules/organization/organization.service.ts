import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { CreateOrganizationDto } from "./dto/create-organization-dto";

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const organization = await this.prisma.organization.create({
      data: {
        ...createOrganizationDto,
      }
    });

    return organization;
  }
}