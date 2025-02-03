import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { startOfDay, endOfDay } from "date-fns";
import { PrismaService } from "nestjs-prisma";
import { StripeService } from "../stripe/stripe.service";
import { LicenseStatus } from "@prisma/client";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  @Cron("0 8 1 * *")
  //   @Cron("19 12 * * *")
  async handleFirstDayOfMonth() {
    this.logger.log(
      "Running on the 1st day of the month at 08:00 AM Create Invoices - start",
    );
    const today = new Date();

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        nextDate: {
          gte: startOfDay(today),
          lt: endOfDay(today),
        },
        isActive: true,
      },
      include: {
        plan: true,
        user: true,
        license: {
          include: {
            _count: {
              select: { activeLicenses: true },
            },
          },
        },
      },
    });

    const subscriptionIds = subscriptions.map((sub) => sub.id);

    if (subscriptionIds.length > 0) {
      await this.prisma.subscription.updateMany({
        where: {
          id: { in: subscriptionIds },
        },
        data: {
          isInTrial: true,
        },
      });
    }

    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i];
      if (subscription.license._count.activeLicenses === 0) continue;

      const discount = await this.prisma.discount.findFirst({
        where: {
          userId: subscription.userId,
          stripeCouponId: null,
          used: false,
        },
      });

      let discountId = undefined;
      let discountAmount = undefined;
      if (discount) {
        discountAmount = discount.endAmount;

        if (
          discount.endAmount >
          subscription.license._count.activeLicenses * subscription.plan.price
        ) {
          discountAmount =
            subscription.license._count.activeLicenses *
            subscription.plan.price;
          await this.prisma.discount.create({
            data: {
              userId: subscription.userId,
              endAmount:
                discount.endAmount -
                subscription.license._count.activeLicenses *
                  subscription.plan.price,
            },
          });
        }

        const stripeDiscount =
          await this.stripeService.createCoupon(discountAmount);

        discountId = stripeDiscount.id;

        await this.prisma.discount.update({
          where: { id: discount.id },
          data: {
            stripeCouponId: discountId,
          },
        });
      }

      const metadata = {
        quantity: subscription.license._count.activeLicenses,
        subscriptionId: subscription.id,
        stripeCouponId: discountId,
        discountAmount,
      };

      await this.stripeService.createAndPayInvoice({
        customerId: subscription.user.stripeCustomerId,
        priceId: subscription.plan.stripePriceId,
        quantity: subscription.license._count.activeLicenses,
        couponId: discountId,
        description: `Plan - ${subscription.plan.type} - ${subscription.plan.period}. Quantity - ${subscription.license._count.activeLicenses}. ${discount ? `Discount: ${discount.endAmount / 100}$.` : ""}`,
        metadata,
        pay: true,
      });
    }

    this.logger.log(
      "Running on the 1st day of the month at 08:00 AM Create Invoices - end",
    );
  }

  @Cron("0 8 6 * *")
  async handleSixthDayOfMonth() {
    this.logger.log(
      "Running on the 6th day of the month at 08:00 AM Check Unpaid Subscriptions - start",
    );

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        isInTrial: true,
      },
    });

    const subscriptionIds = subscriptions.map((sub) => sub.id);
    const licenseIds = subscriptions.map((sub) => sub.licenseId);

    if (subscriptionIds.length > 0) {
      await this.prisma.subscription.updateMany({
        where: {
          id: { in: subscriptionIds },
        },
        data: {
          isInTrial: false,
          isActive: false,
        },
      });

      await this.prisma.license.updateMany({
        where: {
          id: { in: licenseIds },
        },
        data: {
          status: LicenseStatus.inactive,
        },
      });
    }

    this.logger.log(
      "Running on the 6th day of the month at 08:00 AM Check Unpaid Subscriptions - end",
    );
  }
}
