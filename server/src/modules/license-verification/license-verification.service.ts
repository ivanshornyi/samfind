import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LicenseVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  public async checkUserByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const license = await this.prisma.license.findUnique({
      where: { ownerId: user.id },
    });

    if (!license) {
      throw new NotFoundException("This user does not have a license");
    }

    return license;
  }

  public async checkByDomain(domain: string, userEmail: string) {
    const organization = await this.prisma.organization.findFirst({
      where: {
        domains: {
          has: domain,
        },
      },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: organization.ownerId,
        email: userEmail,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User is not found");
    }

    const license = await this.prisma.license.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    if (!license) {
      throw new NotFoundException("License is not found");
    }

    return {
      user,
      organization,
      license,
    };
  }
}
