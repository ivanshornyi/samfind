import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PrismaService } from "../prisma/prisma.service";
import { License, LicenseStatus } from "@prisma/client";
import { MailService } from "../mail/mail.service";

import { AddUserLicenseDto } from "./dto/add-user-license-dto";
import { UpdateUserLicenseDto } from "./dto/update-user-license-dto";
import { CheckDeviceDto } from "./dto/check-device-dto";

@Injectable()
export class UserLicenseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

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

    if (!license) throw new NotFoundException("User not found");
    
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
    const license = await this.prisma.license.findUnique({
      where: { id },  
    });

    // send invitations if available emails
    // send for new emails
    if (updateUserLicenseDto.availableEmails) {
      const invitationLink = `${this.configService.get("FRONTEND_DOMAIN")}/auth/sign-up?accountType=private&lId=${id}`;

      const currentEmails = license.availableEmails;
      const newEmails = [];
  
      for (const email of updateUserLicenseDto.availableEmails) {
        if (!currentEmails.includes(email)) {
          newEmails.push(email);
        }
      }
      
      if (newEmails.length > 0) {
        for (const email of newEmails) {
          await this.mailService.sendInvitation(email, invitationLink);
        }
      }
    }

    const newLicense = await this.prisma.license.update({
      where: { id },  
      data: {
        ...updateUserLicenseDto,
      },
    });
    
    return newLicense;
  }

  async checkDevice({ email, computer_id: deviceId }: CheckDeviceDto) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        activeLicenses: true,
      },
    });
    if (!user || !user.activeLicenses.length)
      return {
        error: "email has no paid license",
      };
    if (
      user.activeLicenses[0].deviceId &&
      user.activeLicenses[0].deviceId !== deviceId
    )
      return {
        error: "email has been registered",
      };
    if (!user.activeLicenses[0].deviceId)
      await this.prisma.activeLicense.update({
        where: { id: user.activeLicenses[0].id },
        data: {
          deviceId,
        },
      });
    return {
      error: null,
    };
  }
}
