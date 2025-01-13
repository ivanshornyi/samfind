import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserReferralService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    const referral = await this.prisma.userReferral.findUnique({
      where: {
        userId,
      }
    });

    return referral;
  }
}