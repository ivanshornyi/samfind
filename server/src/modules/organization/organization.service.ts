import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { CreateOrganizationDto } from "./dto/create-organization-dto";
import { UpdateOrganizationDto } from "./dto/update-organization-dto";

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

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return await this.prisma.organization.update({
      where: { id },
      data: {
        ...updateOrganizationDto,
      }
    });
  }
}