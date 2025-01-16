import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { UserLicense, UserLicenseStatus } from "@prisma/client";

import { AddUserLicenseDto } from "./dto/add-user-license-dto";

@Injectable()
export class UserLicenseService {
   constructor(private readonly prisma: PrismaService) {}

  async addLicense(createUserLicenseDto: AddUserLicenseDto) {
    const userLicense = await this.prisma.userLicense.create({
      data: {
        ...createUserLicenseDto,
        status: UserLicenseStatus.active,
      },
    });

    return userLicense;
  }

  async findById(id: string): Promise<UserLicense | null> {
    const license = await this.prisma.userLicense.findUnique({
      where: {
        id,
      }
    });

    if (!license) {
      throw new NotFoundException("User not found");
    }

    return license;
  }

  async findByUserId(id: string): Promise<UserLicense[]> {
    const licenses = await this.prisma.userLicense.findMany({
      where: {
        userId: id,
      },
      // take: limit,
      // skip: offset,
    });

    return licenses;
  }
}