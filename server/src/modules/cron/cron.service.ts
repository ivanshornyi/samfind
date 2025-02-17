import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { startOfDay, endOfDay, startOfMonth, addMonths } from "date-fns";
import { PrismaService } from "nestjs-prisma";
import { StripeService } from "../stripe/stripe.service";
import { LicenseStatus, LicenseTierType } from "@prisma/client";
import { MailService } from "../mail/mail.service";
import { SubscriptionService } from "../subscription/subscription.service";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly mailService: MailService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Cron("0 8 1 * *")
  // @Cron("03 12 * * *")
  async handleFirstDayOfMonth() {
    try {
      this.logger.log(
        "Running on the 1st day of the month at 08:00 AM Create Invoices - start",
      );
      const today = new Date();
      // const today = new Date("2025-03-01");

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

      const freeBasedSubscriptions = subscriptions.filter(
        (sub) => sub.plan.type === LicenseTierType.freemium,
      );

      const freeBasedSubscriptionIds = freeBasedSubscriptions.map(
        (sub) => sub.id,
      );

      if (freeBasedSubscriptionIds.length > 0) {
        const nextDate = startOfMonth(addMonths(today, 1)).toISOString();
        await this.prisma.subscription.updateMany({
          where: {
            id: { in: freeBasedSubscriptionIds },
          },
          data: {
            nextDate,
            isActive: true,
            isInTrial: false,
          },
        });
      }

      const feeBasedSubscriptions = subscriptions.filter(
        (sub) => sub.plan.type !== LicenseTierType.freemium,
      );

      const feeBasedSubscriptionIds = feeBasedSubscriptions.map(
        (sub) => sub.id,
      );

      if (feeBasedSubscriptionIds.length > 0) {
        await this.prisma.subscription.updateMany({
          where: {
            id: { in: feeBasedSubscriptionIds },
          },
          data: {
            isInTrial: true,
          },
        });
      }

      for (let i = 0; i < feeBasedSubscriptions.length; i++) {
        const subscription = feeBasedSubscriptions[i];
        let plan = subscription.plan;
        let planPrice = subscription.plan.price;

        if (subscription.newPlanId) {
          const newPlan = await this.prisma.plan.findUnique({
            where: { id: subscription.newPlanId },
          });

          if (newPlan) {
            await this.prisma.subscription.update({
              where: { id: subscription.id },
              data: {
                planId: newPlan.id,
                newPlanId: null,
                isInTrial:
                  newPlan.type === LicenseTierType.freemium ? false : true,
                nextDate:
                  newPlan.type === LicenseTierType.freemium
                    ? startOfMonth(addMonths(new Date(), 1)).toISOString()
                    : subscription.nextDate,
              },
            });
            await this.prisma.license.update({
              where: { id: subscription.licenseId },
              data: { tierType: newPlan.type },
            });

            planPrice = newPlan.price;
            plan = newPlan;
          }
        }

        if (subscription.license._count.activeLicenses === 0 || planPrice === 0)
          continue;
        const payAmount =
          subscription.license._count.activeLicenses * planPrice;

        const { discountId, discountAmount } =
          await this.subscriptionService.checkDiscount(
            subscription.userId,
            payAmount,
          );

        const metadata = {
          quantity: subscription.license._count.activeLicenses,
          subscriptionId: subscription.id,
          stripeCouponId: discountId,
          discountAmount,
        };

        await this.stripeService.createAndPayInvoice({
          customerId: subscription.user.stripeCustomerId,
          priceId: plan.stripePriceId,
          quantity: subscription.license._count.activeLicenses,
          couponId: discountId,
          description: `Plan - ${plan.type} - ${plan.period}. Quantity - ${subscription.license._count.activeLicenses}. ${discountAmount ? `Discount: ${discountAmount / 100}€.` : ""}`,
          metadata,
          pay: true,
        });
      }

      this.logger.log(
        "Running on the 1st day of the month at 08:00 AM Create Invoices - end",
      );
    } catch (error) {
      this.logger.error("Error Paying Subscriptions", error);
    }
  }

  @Cron("0 8 6 * *")
  //   @Cron("40 15 * * *")
  async handleSixthDayOfMonth() {
    try {
      this.logger.log(
        "Running on the 6th day of the month at 08:00 AM Check Unpaid Subscriptions - start",
      );

      const subscriptions = await this.prisma.subscription.findMany({
        where: {
          isInTrial: true,
        },
        include: { user: true, plan: true },
      });

      const feeBasedSubscriptions = subscriptions.filter(
        (sub) => sub.plan.type !== LicenseTierType.freemium,
      );

      const feeBasedSubscriptionIds = feeBasedSubscriptions.map(
        (sub) => sub.id,
      );
      const licenseIds = feeBasedSubscriptions.map((sub) => sub.licenseId);

      if (feeBasedSubscriptionIds.length > 0) {
        await this.prisma.subscription.updateMany({
          where: {
            id: { in: feeBasedSubscriptionIds },
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

      for (let i = 0; i < feeBasedSubscriptions.length; i++) {
        const subscription = feeBasedSubscriptions[i];
        const response = await this.stripeService.getUserInvoices(
          subscription.user.stripeCustomerId,
          1,
        );
        if (!response.data.length) continue;

        await this.mailService.sendWarningLicenseDeactivated(
          subscription.user.email,
          response.data[0].hosted_invoice_url,
        );
      }

      this.logger.log(
        "Running on the 6th day of the month at 08:00 AM Check Unpaid Subscriptions - end",
      );
    } catch (error) {
      this.logger.error("Error deactivating Subscriptions", error);
    }
  }
}
