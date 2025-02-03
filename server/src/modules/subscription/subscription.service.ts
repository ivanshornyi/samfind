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
import { CreateMemberInvoiceDto } from "./dto/create-member-invoice-dto";
import Stripe from "stripe";

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async addSubscription({
    userId,
    planId,
    quantity,
    discount,
    userReferralCode,
  }: AddSubscriptionDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException("User not found");

    let subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });
    if (subscription && subscription.isActive)
      throw new BadRequestException("Subscription already exists");

    const license = await this.prisma.license.findUnique({
      where: { ownerId: userId },
    });
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) throw new NotFoundException("Plan not found");

    let discountId = undefined;

    const stripeCustomer = await this.stripeService.createCustomer(
      user.email,
      user.firstName + " " + user.lastName,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        stripeCustomerId: stripeCustomer.id,
      },
    });

    if (discount) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          discount: user.discount + discount.amount,
        },
      });
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
        ? startOfMonth(addMonths(new Date(), 1)).toISOString()
        : startOfMonth(addYears(new Date(), 1)).toISOString();

    if (!subscription) {
      subscription = await this.prisma.subscription.create({
        data: {
          userId,
          licenseId: license?.id,
          planId: plan.id,
          isActive: false,
          isInTrial: false,
          nextDate,
        },
      });
    } else {
      subscription = await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          userId,
          licenseId: license?.id,
          planId: plan.id,
          isActive: false,
          isInTrial: false,
          nextDate,
        },
      });
    }

    const metadata = {
      quantity,
      userReferralCode,
      subscriptionId: subscription.id,
      stripeCouponId: discountId,
      discountAmount: discount?.amount,
      firstInvoice: "true",
    };

    const invoice = await this.stripeService.createAndPayInvoice({
      customerId: stripeCustomer.id,
      priceId: plan.stripePriceId,
      quantity,
      couponId: discountId,
      description: `Plan - ${plan.type} - ${plan.period}. Quantity - ${quantity}. ${discount ? `Discount: ${discount.amount / 100}$ - ${discount.description}.` : ""}`,
      metadata,
    });

    const paymentIntent = await this.stripeService.getPaymentIntention(
      invoice.payment_intent as string,
    );

    return { clientSecret: paymentIntent.client_secret };

    // return { url: invoice.hosted_invoice_url };
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

  async payInvoice() {
    const invoice = await this.stripeService.createAndPayInvoice({
      customerId: "cus_RgJCv0aVvMKOWq",
      priceId: "price_1QmdQoIQ0ONDLa6i86RGvcWo",
      quantity: 1,
      // couponId: discountId,
      description: "Description rdfgfdgfgdfsgfdg",
      metadata: { subscriptionId: "cd07bf65-57be-4334-b831-e1f30b60a0b1" },
      pay: true,
    });

    return { url: invoice.hosted_invoice_url };
  }

  async payMemberInvoice({ memberId, ownerId }: CreateMemberInvoiceDto) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId: ownerId,
      },
      include: {
        user: true,
        plan: true,
      },
    });

    if (!subscription || !subscription.user.stripeCustomerId)
      throw new NotFoundException("Subscription not found");

    const member = await this.prisma.user.findUnique({
      where: { id: memberId },
    });

    if (!member) throw new NotFoundException("User not found");

    const metadata = {
      quantity: 1,
      subscriptionId: subscription.id,
      memberId: member.id,
    };

    return await this.stripeService.createAndPayInvoice({
      customerId: subscription.user.stripeCustomerId,
      priceId: subscription.plan.stripePriceId,
      quantity: 1,
      description: `Member License: ${member.email}`,
      metadata,
      pay: true,
    });
  }

  async getBalingHistory(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.stripeCustomerId)
      throw new NotFoundException("User not found");

    let allInvoices: Stripe.Invoice[] = [];
    let hasMore = true;
    let lastInvoiceId = undefined;

    while (hasMore) {
      const response = await this.stripeService.getUserInvoices(
        user.stripeCustomerId,
        100,
        lastInvoiceId,
      );

      allInvoices.push(...response.data);
      hasMore = response.has_more;

      if (response.data.length > 0) {
        lastInvoiceId = response.data[response.data.length - 1].id;
      }
    }

    const invoices = allInvoices.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      url: invoice.hosted_invoice_url,
      pdf: invoice.invoice_pdf,
      status: invoice.status,
      price: invoice.subtotal,
      afterDiscount: invoice.total,
      description: invoice.description,
      date: invoice.status_transitions.finalized_at,
      payDate: invoice.status_transitions.paid_at,
    }));

    return invoices;
  }
}
