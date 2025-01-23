import { Injectable, NotFoundException } from "@nestjs/common";

import { User, UserAuthType, UserRole, UserStatus } from "@prisma/client";
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
    newUserId: string,
    discountNumber: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { referralCode },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.discount < 50) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          discount: user.discount + discountNumber,
        },
      });
    }

    const userReferral = await this.prisma.userReferral.findUnique({
      where: { userId: user.id },
    });

    const referralUserIds = userReferral.invitedUserIds;
    referralUserIds.push(newUserId);

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
        }
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
      }
    });

    // if

    return user;
  }

  async findUserByEmail(email: string, authType: UserAuthType): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        authType,
      },
    });

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, resetPassword?: boolean): Promise<User> {
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

  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }
}
