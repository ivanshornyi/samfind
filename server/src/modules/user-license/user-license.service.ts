import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PrismaService } from "../prisma/prisma.service";
import { License, LicenseStatus, LicenseTierType } from "@prisma/client";
import { MailService } from "../mail/mail.service";

import { AddUserLicenseDto } from "./dto/add-user-license-dto";
import { UpdateUserLicenseDto } from "./dto/update-user-license-dto";
import { CheckDeviceDto } from "./dto/check-device-dto";
import { DeleteDeviceIdDto } from "./dto/delete-device-id-dto";
import { StripeService } from "../stripe/stripe.service";

@Injectable()
export class UserLicenseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
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
      tierType: license.tierType,
      users: license.activeLicenses
        .filter((i) => !i.deleteDate)
        .map((i) => ({
          memberId: i.user?.id,
          name: i.user
            ? i.user.firstName + "  " + i.user.lastName
            : "Available",
          email: i.user?.email,
          date: i.createdAt,
          licenseId: i.id,
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

  async checkDevice({
    email,
    computer_id: desktopId,
    mobile_id: mobileId,
  }: CheckDeviceDto): Promise<{
    error: string | null;
    license?: LicenseTierType;
    userStatus?: string;
  }> {
    if (!desktopId && !mobileId) {
      return {
        error: "Email has no paid license",
      };
    }

    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        activeLicenses: { include: { license: true } },
      },
    });
    if (!user || !user.activeLicenses.length) {
      return {
        error: "Email has no paid license",
      };
    }

    const activeLicense = user.activeLicenses[0];

    if (
      activeLicense.license.status === LicenseStatus.inactive ||
      activeLicense.deleteDate
    ) {
      return {
        error: "Email has no paid license",
        userStatus: mobileId
          ? user.isDeleted
            ? "deleted"
            : "active"
          : undefined,
      };
    }

    if (
      desktopId &&
      activeLicense.desktopIds.length &&
      !activeLicense.desktopIds.includes(desktopId)
    ) {
      return {
        error: "License has been registered on other Device",
        userStatus: mobileId
          ? user.isDeleted
            ? "deleted"
            : "active"
          : undefined,
      };
    }

    if (
      mobileId &&
      activeLicense.mobileIds.length >= 2 &&
      !activeLicense.mobileIds.includes(mobileId)
    ) {
      return {
        error: "License has been registered on other Device",
        userStatus: mobileId
          ? user.isDeleted
            ? "deleted"
            : "active"
          : undefined,
      };
    }

    if (desktopId && activeLicense.desktopIds.includes(desktopId)) {
      return {
        error: null,
        license: activeLicense.license.tierType,
      };
    }

    if (mobileId && activeLicense.mobileIds.includes(mobileId)) {
      return {
        error: null,
        license: activeLicense.license.tierType,
        userStatus: mobileId
          ? user.isDeleted
            ? "deleted"
            : "active"
          : undefined,
      };
    }

    const desktopIds = activeLicense.desktopIds;
    const mobileIds = activeLicense.mobileIds;

    if (desktopId) {
      desktopIds.push(desktopId);
    }

    if (mobileId) {
      mobileIds.push(mobileId);
    }

    await this.prisma.activeLicense.update({
      where: { id: activeLicense.id },
      data: {
        desktopIds,
        mobileIds,
      },
    });

    return {
      error: null,
      license: activeLicense.license.tierType,
      userStatus: mobileId
        ? user.isDeleted
          ? "deleted"
          : "active"
        : undefined,
    };
  }

  async deactivateLicense(id: string) {
    const license = await this.prisma.license.findUnique({
      where: { id },
      include: { subscription: true },
    });

    if (!license) {
      throw new NotFoundException("User not found");
    }

    if (license.subscription) {
      await this.prisma.subscription.update({
        where: { id: license.subscription.id },
        data: { isActive: false },
      });
    }

    await this.prisma.license.update({
      where: { id },
      data: { status: LicenseStatus.inactive },
    });

    return { status: LicenseStatus.inactive };
  }

  async deleteMemberFromLicense(id: string) {
    const activeLicense = await this.prisma.activeLicense.findFirst({
      where: { id },
      include: {
        license: { include: { subscription: { include: { plan: true } } } },
      },
    });

    if (!activeLicense || activeLicense.deleteDate) {
      throw new NotFoundException("Member License not found");
    }

    if (activeLicense.license.ownerId === activeLicense.userId) {
      throw new BadRequestException(
        "You can delete License Owner from License",
      );
    }

    const stripeSubscription = await this.stripeService.getSubscriptionById(
      activeLicense.license.subscription.stripeSubscriptionId,
    );
    if (!stripeSubscription) {
      throw new NotFoundException("Subscription not found");
    }

    await this.stripeService.changeSubscriptionItems({
      subscriptionId: stripeSubscription.id,
      subscriptionItemId: stripeSubscription.items.data[0].id,
      quantity: stripeSubscription.items.data[0].quantity - 1,
      deleteMember: true,
      metadata: {},
      description: `Plan - ${activeLicense.license.subscription.plan.type} - ${activeLicense.license.subscription.plan.period}. Quantity - ${stripeSubscription.items.data[0].quantity - 1}.`,
    });
    await this.prisma.activeLicense.update({
      where: { id: activeLicense.id },
      data: { deleteDate: new Date() },
    });

    return { status: "deleted" };
  }

  async getUserActiveLicense(userId: string) {
    const activeLicense = await this.prisma.activeLicense.findFirst({
      where: { userId },
    });

    if (!activeLicense || activeLicense.deleteDate) {
      throw new NotFoundException("License not found");
    }

    return activeLicense;
  }

  async deleteDeviceIdFromLicense({
    activeLicenseId,
    desktopId,
    mobileId,
  }: DeleteDeviceIdDto) {
    const activeLicense = await this.prisma.activeLicense.findFirst({
      where: { id: activeLicenseId },
    });

    if (!activeLicense || activeLicense.deleteDate) {
      throw new NotFoundException("License not found");
    }

    let mobileIds = activeLicense.mobileIds;
    let desktopIds = activeLicense.desktopIds;

    if (desktopId)
      desktopIds = activeLicense.desktopIds.filter((id) => id !== desktopId);
    if (mobileId)
      mobileIds = activeLicense.mobileIds.filter((id) => id !== mobileId);

    await this.prisma.activeLicense.update({
      where: { id: activeLicenseId },
      data: { mobileIds, desktopIds },
    });

    return { status: "deleted" };
  }
}
