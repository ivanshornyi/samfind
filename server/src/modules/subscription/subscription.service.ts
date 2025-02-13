import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  addMonths,
  addYears,
  compareAsc,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { PrismaService } from "../prisma/prisma.service";
import {
  LicenseStatus,
  LicenseTierType,
  PlanPeriod,
  User,
} from "@prisma/client";
import { StripeService } from "../stripe/stripe.service";
import { AddSubscriptionDto } from "./dto/add-subscription-dto";
import { CreateMemberInvoiceDto } from "./dto/create-member-invoice-dto";
import Stripe from "stripe";
import { ChangePlanDto } from "./dto/change-plan-dto";

interface IAddDiscountOnNotUsedPeriod {
  totalAmount: number;
  nextDate?: Date;
  owner: User;
  memberEmail: string;
}
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

    let stripeCustomerId = user.stripeCustomerId;

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

    if (!stripeCustomerId) {
      const stripeCustomer = await this.stripeService.createCustomer(
        user.email,
        user.firstName + " " + user.lastName,
      );

      stripeCustomerId = stripeCustomer.id;

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId: stripeCustomer.id,
        },
      });
    }

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
      customerId: stripeCustomerId,
      priceId: plan.stripePriceId,
      quantity,
      couponId: discountId,
      description: `Plan - ${plan.type} - ${plan.period}. Quantity - ${quantity}. ${discount ? `Discount: ${discount.amount / 100}$ - ${discount.description}.` : ""}`,
      metadata,
    });

    // const paymentIntent = await this.stripeService.getPaymentIntention(
    //   invoice.payment_intent as string,
    // );

    // return { clientSecret: paymentIntent.client_secret };

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

  async payInvoice() {
    const invoice = await this.stripeService.createAndPayInvoice({
      customerId: "cus_Ri6j3QX47oJao7",
      priceId: "price_1QogLRIQ0ONDLa6iiO7AZxI5",
      quantity: 1,
      // couponId: discountId,
      description: "Description rdfgfdgfgdfsgfdg",
      metadata: {
        quantity: 1,
        subscriptionId: "15d1ec94-61ec-4dee-a8f0-492242d32536",
        // memberId: member.id,
      },
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

      if (discount.endAmount > subscription.plan.price) {
        discountAmount = subscription.plan.price;
        await this.prisma.discount.create({
          data: {
            userId: subscription.userId,
            endAmount: discount.endAmount - subscription.plan.price,
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
      quantity: 1,
      subscriptionId: subscription.id,
      memberId: member.id,
      stripeCouponId: discountId,
      discountAmount,
    };

    return await this.stripeService.createAndPayInvoice({
      customerId: subscription.user.stripeCustomerId,
      priceId: subscription.plan.stripePriceId,
      quantity: 1,
      description: `Member License: ${member.email}`,
      metadata,
      couponId: discountId,
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

  async addDiscountOnNotUsedPeriod({
    totalAmount,
    owner,
    nextDate,
    memberEmail,
  }: IAddDiscountOnNotUsedPeriod) {
    const discountAmount = this.stripeService.calculateDiscount(
      totalAmount,
      nextDate,
    );
    await this.stripeService.addDiscount(owner, discountAmount, memberEmail);
  }

  async cancelSubscription(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    await this.prisma.subscription.update({
      where: {
        id,
      },
      data: {
        isActive: false,
        cancelDate: new Date(),
      },
    });

    if (subscription.licenseId) {
      await this.prisma.license.update({
        where: { id: subscription.licenseId },
        data: { status: LicenseStatus.inactive },
      });
    }

    return {
      status: LicenseStatus.inactive,
    };
  }

  async activeSubscription(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
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

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    const today = new Date();
    const nextDate = new Date(subscription.nextDate);

    const difference = compareAsc(startOfDay(today), startOfDay(nextDate));

    if (difference < 0) {
      await this.prisma.subscription.update({
        where: {
          id,
        },
        data: {
          isActive: true,
          cancelDate: null,
        },
      });

      if (subscription.licenseId) {
        await this.prisma.license.update({
          where: { id: subscription.licenseId },
          data: { status: LicenseStatus.active },
        });
      }
    } else {
      const payAmount =
        subscription.license._count.activeLicenses * subscription.plan.price;

      const { discountId, discountAmount } = await this.checkDiscount(
        subscription.userId,
        payAmount,
      );

      const metadata = {
        quantity: subscription.license._count.activeLicenses,
        subscriptionId: subscription.id,
        stripeCouponId: discountId,
        discountAmount,
      };

      const invoice = await this.stripeService.createAndPayInvoice({
        customerId: subscription.user.stripeCustomerId,
        priceId: subscription.plan.stripePriceId,
        quantity: subscription.license._count.activeLicenses,
        couponId: discountId,
        description: `Plan - ${subscription.plan.type} - ${subscription.plan.period}. Quantity - ${subscription.license._count.activeLicenses}. ${discountAmount ? `Discount: ${discountAmount / 100}$.` : ""}`,
        metadata,
        pay: true,
      });

      if (invoice.status !== "paid") {
        throw new BadRequestException(
          "An error occurred when paying for the License",
        );
      }
    }

    return { status: LicenseStatus.active };
  }

  async checkDiscount(userId: string, payAmount: number) {
    const discount = await this.prisma.discount.findFirst({
      where: {
        userId,
        stripeCouponId: null,
        used: false,
      },
    });

    let discountId = undefined;
    let discountAmount = undefined;
    if (discount) {
      discountAmount = discount.endAmount;

      if (discount.endAmount > payAmount) {
        discountAmount = payAmount;
        await this.prisma.discount.create({
          data: {
            userId,
            endAmount: discount.endAmount - payAmount,
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
          endAmount: discountAmount,
        },
      });
    }

    return { discountId, discountAmount };
  }

  async changePlan({ planId, subscriptionId }: ChangePlanDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!subscription) {
      throw new NotFoundException("Plan not found");
    }

    if (subscription.planId === planId) {
      throw new BadRequestException("The plan has already been activated");
    }

    const today = new Date();
    const nextDate = new Date(subscription.nextDate);

    const difference = compareAsc(startOfDay(today), startOfDay(nextDate));

    if (difference < 0) {
      await this.prisma.subscription.update({
        where: { id: subscriptionId },
        data: { newPlanId: planId },
      });
    } else {
      await this.prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          planId,
          isActive:
            plan.type === LicenseTierType.freemium
              ? true
              : subscription.isActive,
          isInTrial:
            plan.type === LicenseTierType.freemium
              ? false
              : subscription.isInTrial,
          nextDate:
            plan.type === LicenseTierType.freemium
              ? startOfMonth(addMonths(new Date(), 1)).toISOString()
              : subscription.nextDate,
        },
      });
      await this.prisma.license.update({
        where: { id: subscription.licenseId },
        data: { tierType: plan.type },
      });

      if (plan.type !== LicenseTierType.freemium) {
        await this.activeSubscription(subscriptionId);
      }
    }

    return plan;
  }
}
