import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { License, LicenseStatus } from "@prisma/client";

import { AddUserLicenseDto } from "./dto/add-user-license-dto";
import { UpdateUserLicenseDto } from "./dto/update-user-license-dto";

@Injectable()
export class UserLicenseService {
  constructor(private readonly prisma: PrismaService) {}

  async addLicense(createUserLicenseDto: AddUserLicenseDto) {
    const userLicense = await this.prisma.license.create({
      data: {
        ...createUserLicenseDto,
        status: LicenseStatus.active,
      },
    });

    return userLicense;
  }

  async findById(id: string): Promise<License | null> {
    const license = await this.prisma.license.findUnique({
      where: {
        id,
      },
    });

    if (!license) {
      throw new NotFoundException("User not found");
    }

    return license;
  }

  async findByUserId(id: string) {
    const license = await this.prisma.license.findFirst({
      where: {
        ownerId: id,
      },
      include: {
        activeLicenses: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
    if (!license) return null;
    return {
      id: license.id,
      limit: license.limit,
      users: license.activeLicenses.map((i) => ({
        name: i.user.firstName + "  " + i.user.lastName,
        email: i.user.email,
        date: i.createdAt,
        license: i.id,
      })),
    };
  }

  async update(id: string, updateUserLicenseDto: UpdateUserLicenseDto) {
    return await this.prisma.license.update({
      where: { id },
      data: {
        ...updateUserLicenseDto,
      },
    });
  }
}
