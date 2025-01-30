import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { PlanType, LicenseStatus } from "@prisma/client";
import { StripeService } from "../stripe/stripe.service";
import { AddSubscriptionDto } from "./dto/add-subscription-dto";

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async addSubscription({
    userId,
    licenseId,
    planId,
    quantity,
    discount,
  }: AddSubscriptionDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException("User not found");

    const subscriptionDb = await this.prisma.subscription.findUnique({
      where: { licenseId, userId },
    });
    if (subscriptionDb)
      throw new BadRequestException("Subscription already exists");

    const license = await this.prisma.license.findUnique({
      where: { id: licenseId, ownerId: userId },
    });
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!license || !plan) throw new NotFoundException("License not found");

    const stripeCustomer = await this.stripeService.createCustomer(
      user.email,
      user.firstName + " " + user.lastName,
    );
  }
}
