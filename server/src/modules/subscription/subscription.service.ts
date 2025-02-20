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
  BalanceType,
  LicenseStatus,
  LicenseTierType,
  PlanPeriod,
  TransactionType,
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
    userReferralCode,
  }: AddSubscriptionDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException("User not found");

    let stripeCustomerId = user.stripeCustomerId;

    let subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });
    if (
      subscription &&
      (subscription.isActive || subscription.isInTrial) &&
      subscription.plan.type !== LicenseTierType.freemium
    )
      throw new BadRequestException("Subscription already exists");

    const license = await this.prisma.license.findUnique({
      where: { ownerId: userId },
    });
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) throw new NotFoundException("Plan not found");

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

    const { discountId, discountAmount } = await this.checkDiscount(
      userId,
      plan.price * quantity,
    );

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
        include: { plan: true },
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
        include: { plan: true },
      });
    }

    const metadata = {
      quantity,
      userReferralCode,
      subscriptionId: subscription.id,
      stripeCouponId: discountId,
      discountAmount,
      firstInvoice: "true",
    };

    const invoice = await this.stripeService.createAndPayInvoice({
      customerId: stripeCustomerId,
      priceId: plan.stripePriceId,
      quantity,
      couponId: discountId,
      description: `Plan - ${plan.type} - ${plan.period}. Quantity - ${quantity}. ${discountAmount ? `Discount: ${discountAmount / 100}€` : ""}`,
      metadata,
    });

    return { url: invoice.hosted_invoice_url };
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

    const { discountId, discountAmount } = await this.checkDiscount(
      subscription.userId,
      subscription.plan.price,
    );

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

  async getBillingHistory(userId: string) {
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

    let invoices = allInvoices
      .filter((invoice, index, arr) => {
        if (index === 0) return true;
        return invoice.status === "paid";
      })
      .map((invoice) => ({
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
        description: `Plan - ${subscription.plan.type} - ${subscription.plan.period}. Quantity - ${subscription.license._count.activeLicenses}. ${discountAmount ? `Discount: ${discountAmount / 100}€.` : ""}`,
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
    let discountId = undefined;
    let discountAmount = undefined;
    let spentBonuses = 0;
    let spentDiscount = 0;

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });

    if (
      !wallet ||
      (!wallet?.discountAmount && !wallet?.selectedBonusToDiscount)
    )
      return { discountId, discountAmount };

    if (payAmount >= wallet.discountAmount + wallet.selectedBonusToDiscount) {
      discountAmount = wallet.discountAmount + wallet.selectedBonusToDiscount;
      spentBonuses = wallet.selectedBonusToDiscount;
      spentDiscount = wallet.discountAmount;
    } else if (
      payAmount > wallet.discountAmount &&
      payAmount < wallet.discountAmount + wallet.selectedBonusToDiscount
    ) {
      discountAmount = payAmount;
      spentBonuses = payAmount - wallet.discountAmount;
      spentDiscount = wallet.discountAmount;
    } else {
      discountAmount = payAmount;
      spentDiscount = payAmount;
    }

    const stripeDiscount =
      await this.stripeService.createCoupon(discountAmount);

    discountId = stripeDiscount.id;

    await this.prisma.discount.create({
      data: {
        userId,
        amount: discountAmount,
        spentBonuses,
        spentDiscount,
        stripeCouponId: discountId,
      },
    });

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        discountAmount: { decrement: spentDiscount },
        bonusAmount: { decrement: spentBonuses },
        selectedBonusToDiscount: { decrement: spentBonuses },
      },
    });

    await this.prisma.walletTransaction.create({
      data: {
        userId,
        walletId: wallet.id,
        amount: spentDiscount,
        transactionType: TransactionType.expense,
        balanceType: BalanceType.discount,
        description: "Subscription payment",
      },
    });

    if (spentBonuses > 0) {
      await this.prisma.walletTransaction.create({
        data: {
          userId,
          walletId: wallet.id,
          amount: spentBonuses,
          transactionType: TransactionType.expense,
          balanceType: BalanceType.bonus,
          description: "Subscription payment",
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

  async cancelChangePlan(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { newPlanId: null },
    });

    return { status: "canalled" };
  }

  async getDiscountHistory(userId: string) {
    const discountHistory: {
      id: string;
      date: string | Date;
      type: TransactionType;
      amount: number;
      description: string;
    }[] = [];

    const discountTransactions = await this.prisma.walletTransaction.findMany({
      where: { userId, balanceType: BalanceType.discount },
    });

    discountTransactions.forEach((d) => {
      discountHistory.push({
        id: d.id,
        date: d.updatedAt,
        type: d.transactionType,
        amount: d.amount,
        description: d.description,
      });
    });

    discountHistory.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return discountHistory;
  }
}
