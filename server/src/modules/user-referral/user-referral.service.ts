import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { CreateUserReferralDto } from "./dto/create-user-referral-dto";

@Injectable()
export class UserReferralService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserReferralDto: CreateUserReferralDto) {
    const code = Math.floor(Math.random() * 1_000_000);

    const referral = await this.prisma.userReferral.create({
      data: {
        userId: createUserReferralDto.userId,
        referralCode: code,
      },
    });

    return referral;
  }

  async findByUserId(userId: string) {
    const referral = await this.prisma.userReferral.findUnique({
      where: {
        userId,
      },
      include: {
        discountIncomes: true,
      },
    });

    if (!referral) {
      throw new NotFoundException("Referral not found");
    }

    const userIds = referral.discountIncomes
      .filter((i) => typeof i.invitedUserId === "string")
      .map((i) => i.invitedUserId);

    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    const referralItems = referral.discountIncomes.map((i) => {
      const user = users.find((u) => u.id === i.invitedUserId);
      return {
        userId: user?.id,
        name: user?.firstName + " " + user?.lastName,
        activationDate: i.createdAt,
        amount: i.amount,
      };
    });

    return referralItems;
  }
}
