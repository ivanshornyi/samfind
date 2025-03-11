import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Organization } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

import { CreateOrganizationDto } from "./dto/create-organization-dto";
import { UpdateOrganizationDto } from "./dto/update-organization-dto";

import { MailService } from "../mail/mail.service";

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.prisma.organization.create({
      data: {
        ...createOrganizationDto,
      },
    });

    return organization;
  }

  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    const organization = await this.prisma.organization.findUnique({
      where: {
        id,
      },
    });

    let domains = organization.domains;
    let availableEmails = organization.availableEmails;

    if (updateOrganizationDto.availableEmails) {
      const invitationLink = `${this.configService.get("FRONTEND_DOMAIN")}/auth/sign-up?accountType=private&orgId=${id}`;
      availableEmails = updateOrganizationDto.availableEmails.map((email) =>
        email.toLowerCase(),
      );
      const currentEmails = organization.availableEmails;
      const newEmails = [];

      for (const email of availableEmails) {
        if (!currentEmails.includes(email)) {
          newEmails.push(email);
        }
      }

      if (newEmails.length > 0) {
        await this.prisma.license.update({
          where: {
            ownerId: organization.ownerId,
          },
          data: {
            availableEmails,
          },
        });

        for (const email of newEmails) {
          await this.mailService.sendInvitation(email, invitationLink);
        }
      }
    }

    if (updateOrganizationDto.domains) {
      domains = updateOrganizationDto.domains.map((d) => d.toLowerCase());
    }

    const updatedOrganization = await this.prisma.organization.update({
      where: { id },
      data: {
        ...updateOrganizationDto,
        availableEmails,
        domains,
      },
    });

    return updatedOrganization;
  }

  async findOrganization(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: {
        id,
      },
    });

    return organization;
  }
}
