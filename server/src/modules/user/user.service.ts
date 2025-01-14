import { Injectable, NotFoundException } from "@nestjs/common";

import { User, UserAuthType, UserRole, UserStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

import { UpdateUserDto } from "./dto/update-user-dto";
import { CreateUserDto } from "./dto/create-user-dto";
import { FindUserDto } from "./dto/find-user-dto";

import { createHash } from "crypto";

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

    return user || null;
  }

  async findAndUpdateUserByReferralCode(referralCode: string, newUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { referralCode },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        // update discount
        // update percent
      },
    });

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
    // const users = await this.prisma.user.findMany({
    //   id: {
    //     in: ids,
    //   }
    // });

    // return users;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password,
        status: UserStatus.active,
        role: UserRole.customer,
      },
    });

    return user;
  }

  async findUserByEmail(email: string, authType: UserAuthType): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        authType,
      },
    });

    return user || null;
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
