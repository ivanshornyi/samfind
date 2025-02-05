import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

Injectable();
export class UserDiscountService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserDiscount(userId: string) {
    const discount = await this.prisma.discount.findFirst({
      where: {
        userId,
        used: false,
        stripeCouponId: null,
      },
    });

    return discount;
  }
}
