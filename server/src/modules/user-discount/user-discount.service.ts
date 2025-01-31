import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

Injectable()
export class UserDiscountService {
  constructor (private readonly prisma: PrismaService) {}

  async getUserDiscount(userId: string) {
    const discount = await this.prisma.discount.findUnique({
      where: {
        userId,
      }
    });

    console.log(discount);

    return discount;
  }
}