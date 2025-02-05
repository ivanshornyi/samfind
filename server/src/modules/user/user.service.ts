import { Injectable, NotFoundException } from "@nestjs/common";

import {
  LicenseTierType,
  LicenseStatus,
  User,
  UserAuthType,
  UserRole,
  UserStatus,
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

import { UpdateUserDto } from "./dto/update-user-dto";
import { CreateUserDto } from "./dto/create-user-dto";
import { FindUserDto } from "./dto/find-user-dto";

import { createHash } from "crypto";
import { CreateOrganizationDto } from "../organization/dto/create-organization-dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(findUserDto: FindUserDto): Promise<User[]> {
    const { name, limit, offset } = findUserDto;

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: name, mode: "insensitive" } },
          { lastName: { contains: name, mode: "insensitive" } },
        ],
      },
      take: limit,
      skip: offset,
    });

    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findAndUpdateUserByReferralCode(
    referralCode: number,
    newUser: User,
    discountNumber: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { referralCode },
    });

    const userReferral = await this.prisma.userReferral.findUnique({
      where: { referralCode },
    });

    if (!user || !userReferral) {
      throw new NotFoundException("User not found");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        discount: user.discount + discountNumber,
      },
    });

    let discount = await this.prisma.discount.findFirst({
      where: { userId: user.id, used: false, stripeCouponId: null },
    });

    if (discount) {
      await this.prisma.discount.update({
        where: { id: discount.id },
        data: {
          endAmount: discountNumber + discountNumber,
        },
      });
    } else {
      discount = await this.prisma.discount.create({
        data: {
          userId: user.id,
          endAmount: discountNumber,
        },
      });
    }

    await this.prisma.discountIncome.create({
      data: {
        userId: user.id,
        referralId: userReferral.id,
        amount: discountNumber,
        discountId: discount.id,
        description: `Income from referral Registration on email ${newUser.email}`,
      },
    });

    const referralUserIds = userReferral.invitedUserIds;
    referralUserIds.push(newUser.id);

    await this.prisma.userReferral.update({
      where: {
        userId: user.id,
      },
      data: {
        invitedUserIds: referralUserIds,
      },
    });
  }

  async findUsersByIds(ids: string[]) {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
      },
    });

    return users;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;

    const referralCode = Math.floor(Math.random() * 1_000_000);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password,
        status: UserStatus.active,
        role: UserRole.customer,
        referralCode,
      },
    });

    await this.prisma.userReferral.create({
      data: {
        userId: user.id,
        referralCode,
      },
    });

    return user;
  }

  async findUserByEmail(
    email: string,
    authType: UserAuthType,
  ): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        authType,
      },
    });

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    resetPassword?: boolean,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password && !resetPassword) {
      updateUserDto.password = this.hashPassword(updateUserDto.password);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return updatedUser;
  }

  async findUserSubscriptionInfo(userId: string) {
    const userInfo = {
      organizationOwner: false, // with organization
      standardUser: false, // private with license, (standard tier)
      freemiumUser: false, // private with freemium tier (without active license)
      invitedUser: false, // added by invitation (with active license)
    };

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.organizationId) {
      userInfo.organizationOwner = true;
    }

    if (!user.organizationId) {
      const license = await this.prisma.license.findUnique({
        where: {
          ownerId: userId,
        },
      });

      if (license) {
        if (license.tierType === LicenseTierType.freemium) {
          userInfo.freemiumUser = true;
        } else if (license.tierType === LicenseTierType.standard) {
          userInfo.standardUser = true;
        }
      } else {
        const activeLicense = await this.prisma.activeLicense.findFirst({
          where: {
            userId,
          },
        });

        if (activeLicense) {
          userInfo.invitedUser = true;
        }
      }
    }

    return userInfo;
  }

  async findInvitedUserInfo(userId: string) {
    const activeLicense = await this.prisma.activeLicense.findFirst({
      where: {
        userId,
      },
    });

    const license = await this.prisma.license.findUnique({
      where: {
        id: activeLicense.licenseId,
      },
      select: {
        id: true,
        ownerId: true,
        tierType: true,
        updatedAt: true,
      },
    });

    const licenseOwner = await this.prisma.user.findUnique({
      where: {
        id: license.ownerId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        organizationId: true,
      },
    });

    return {
      license: {
        ...license,
      },
      licenseOwner: {
        ...licenseOwner,
      },
    };
  }

  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { License: true, subscription: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.License.length) {
      const licenseIds = user.License.map((l) => l.id);
      await this.prisma.license.updateMany({
        where: {
          id: { in: licenseIds },
        },
        data: {
          status: LicenseStatus.inactive,
        },
      });
    }

    if (user.subscription) {
      await this.prisma.subscription.update({
        where: { id: user.subscription.id },
        data: { isActive: false },
      });
    }

    await this.prisma.user.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
