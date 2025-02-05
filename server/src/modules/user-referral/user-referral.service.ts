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
        discountIncomes: {
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (!referral) {
      throw new NotFoundException("Referral not found");
    }

    const referralItems = referral.discountIncomes.map((i) => ({
      name: i.user,
    }));

    return referral;
  }
}
