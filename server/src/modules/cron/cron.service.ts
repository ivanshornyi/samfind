import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "nestjs-prisma";
import { StripeService } from "../stripe/stripe.service";
import { LicenseStatus, LicenseTierType } from "@prisma/client";
import { MailService } from "../mail/mail.service";
import { subDays } from "date-fns";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly mailService: MailService,
  ) {}

  @Cron("0 9 * * *")
  // @Cron("43 15 * * *")
  async setInactiveStatusNotPayedSubscriptions() {
    try {
      this.logger.log(
        "Running every day at 09:00 AM Check Unpaid Subscriptions - start",
      );

      const fiveDaysAgo = subDays(new Date(), 5);

      const subscriptions = await this.prisma.subscription.findMany({
        where: {
          isInTrial: true,
          nextDate: {
            lt: fiveDaysAgo,
          },
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

      const stripeSubscriptionIds = feeBasedSubscriptions
        .map((sub) => sub.stripeSubscriptionId)
        .filter((id) => typeof id === "string");

      if (feeBasedSubscriptionIds.length > 0) {
        await this.prisma.$transaction([
          this.prisma.subscription.updateMany({
            where: {
              id: { in: feeBasedSubscriptionIds },
            },
            data: {
              isInTrial: false,
              isActive: false,
            },
          }),
          this.prisma.license.updateMany({
            where: {
              id: { in: licenseIds },
            },
            data: {
              status: LicenseStatus.inactive,
            },
          }),
        ]);
      }

      for (let i = 0; i < stripeSubscriptionIds.length; i++) {
        const stripeSubscriptionId = stripeSubscriptionIds[i];

        await this.stripeService.putSubscriptionOnPause(stripeSubscriptionId);
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
        "Running every day at 09:00 AM Check Unpaid Subscriptions - end",
      );
    } catch (error) {
      this.logger.error("Error deactivating Subscriptions", error);
    }
  }
}
