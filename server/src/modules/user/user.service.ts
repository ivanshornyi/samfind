import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  BalanceType,
  LicenseStatus,
  LicenseTierType,
  TransactionType,
  User,
  UserAuthType,
  UserRole,
  UserStatus,
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

import { CreateUserDto } from "./dto/create-user-dto";
import { FindUserDto } from "./dto/find-user-dto";
import { UpdateUserDto } from "./dto/update-user-dto";

import { createHash } from "crypto";
import { AddUserShareholderDataDto } from "./dto/add-user-shareholder-dto";

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
      include: { wallet: true },
    });

    const userReferral = await this.prisma.userReferral.findUnique({
      where: { referralCode },
    });

    if (!user || !userReferral || !user.wallet) {
      throw new NotFoundException("User not found");
    }

    await this.prisma.wallet.update({
      where: { id: user.wallet.id },
      data: { bonusAmount: { increment: discountNumber } },
    });

    await this.prisma.walletTransaction.create({
      data: {
        userId: user.id,
        walletId: user.wallet.id,
        amount: discountNumber,
        transactionType: TransactionType.income,
        balanceType: BalanceType.bonus,
        referralId: userReferral.id,
        invitedUserId: newUser.id,
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

    //Update invited user
    await this.prisma.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        invitedReferralCode: null,
      },
    });

    const newUserWallet = await this.prisma.wallet.findUnique({
      where: { userId: newUser.id },
    });

    if (!newUserWallet) return;

    await this.prisma.wallet.update({
      where: { userId: newUser.id },
      data: { bonusAmount: { increment: discountNumber } },
    });

    await this.prisma.walletTransaction.create({
      data: {
        userId: newUser.id,
        walletId: newUserWallet.id,
        amount: discountNumber,
        transactionType: TransactionType.income,
        balanceType: BalanceType.bonus,
        description: `Bonus for registration via referral link`,
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

  async findUserRoleSubscriptionInfo(userId: string) {
    const userInfo = {
      organizationOwner: false, // with organization
      standardUser: false, // private with license, (standard tier)
      freemiumUser: false, // private with freemium tier (without active license)
      invitedUser: false, // added by invitation (with active license)
      deletedMember: false,
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

        if (activeLicense.deleteDate) {
          userInfo.deletedMember = true;
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

    if (!activeLicense) {
      throw new NotFoundException("Active License not found");
    }

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

    const organization = await this.prisma.organization.findUnique({
      where: { ownerId: license.ownerId },
    });

    return {
      license: {
        ...license,
      },
      licenseOwner: {
        ...licenseOwner,
        organizationName: organization?.name,
      },
    };
  }

  async findUserSubscriptionInfo(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        nextDate: true,
        plan: true,
        isActive: true,
        newPlanId: true,
        license: {
          select: {
            limit: true,
            tierType: true,
            _count: {
              select: {
                activeLicenses: {
                  where: {
                    deleteDate: null,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException("Subscription was not found");
    }

    return subscription;
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

  async getUserOrganizationName(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    return { name: organization.name };
  }

  async getUserName(licenseId: string) {
    const license = await this.prisma.license.findUnique({
      where: { id: licenseId },
      include: { user: { select: { firstName: true, lastName: true } } },
    });

    if (!license) {
      throw new NotFoundException("License not found");
    }

    return { name: license.user.firstName + "  " + license.user.lastName };
  }

  async addUserShareholderData(data: AddUserShareholderDataDto) {
    const shareholderData = await this.prisma.userShareholdersData.findUnique({
      where: { userId: data.userId },
    });

    if (shareholderData) {
      throw new BadRequestException("Data already added");
    }

    return await this.prisma.userShareholdersData.create({ data });
  }

  async getUserShareholderData(userId: string) {
    return await this.prisma.userShareholdersData.findUnique({
      where: { userId },
    });
  }
}
