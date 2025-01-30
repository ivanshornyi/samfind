import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { addMonths, addYears, startOfMonth } from "date-fns";
import { PrismaService } from "../prisma/prisma.service";
import { PlanPeriod } from "@prisma/client";
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

    let discountId = undefined;

    const stripeCustomer = await this.stripeService.createCustomer(
      user.email,
      user.firstName + " " + user.lastName,
    );

    if (discount) {
      const stripeDiscount = await this.stripeService.createCoupon(
        discount.amount,
      );
      discountId = stripeDiscount.id;
      await this.addDiscount(
        userId,
        discount.amount,
        discount.description,
        discountId,
      );
    }

    const nextDate =
      plan.period === PlanPeriod.monthly
        ? startOfMonth(addMonths(new Date(), 1))
        : startOfMonth(addYears(new Date(), 1));

    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        licenseId: license.id,
        planId: plan.id,
        isActive: false,
        isInTrial: false,
        nextDate,
      },
    });

    const invoice = await this.stripeService.createAndPayInvoice({
      customerId: stripeCustomer.id,
      priceId: plan.stripePriceId,
      quantity,
      couponId: discountId,
      description: "Description rdfgfdgfgdfsgfdg",
      subscriptionId: subscription.id,
    });

    // const session = await this.stripeService.createPaymentSession({
    //   customerId: stripeCustomer.id,
    //   priceId: plan.stripePriceId,
    //   quantity,
    //   discountId,
    //   description: "Description rdfgfdgfgdfsgfdg",
    //   subscriptionId: subscription.id,
    // });

    // console.log("session", session);

    return { url: invoice.hosted_invoice_url };
  }

  async addDiscount(
    userId: string,
    amount: number,
    description: string,
    discountId?: string,
  ) {
    const discount = await this.prisma.discount.create({
      data: {
        userId,
        endAmount: amount,
        stripeCouponId: discountId,
      },
    });

    await this.prisma.discountIncome.create({
      data: {
        userId,
        amount,
        discountId: discount.id,
        description,
      },
    });
  }
}
