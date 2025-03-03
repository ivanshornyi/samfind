import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { compareAsc, startOfDay } from "date-fns";
import { PrismaService } from "../prisma/prisma.service";
import {
  BalanceType,
  LicenseStatus,
  LicenseTierType,
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

interface IAddDiscount {
  discountAmount: number;
  userId: string;
}
@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => StripeService))
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
    let invoiceId = null;
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

    const items = [{ quantity, price: plan.stripePriceId }];
    const metadata = {
      quantity,
      userReferralCode,
      userId: user.id,
      newPlan: plan.id,
    };

    if (!subscription) {
      const stripeSubscription = await this.stripeService.createSubscription({
        stripeCustomerId,
        items,
        tax: user.isFromNorway,
        metadata,
        description: `Plan - ${plan.type} - ${plan.period}. Quantity - ${quantity}.`,
      });

      invoiceId =
        typeof stripeSubscription.latest_invoice === "string"
          ? stripeSubscription.latest_invoice
          : stripeSubscription.latest_invoice.id;

      subscription = await this.prisma.subscription.create({
        data: {
          userId,
          licenseId: license?.id,
          planId: plan.id,
          isActive: false,
          isInTrial: false,
          stripeSubscriptionId: stripeSubscription.id,
          nextDate: new Date(stripeSubscription.current_period_end * 1000),
        },
        include: { plan: true },
      });
    } else {
      await this.stripeService.cancelSubscriptionById(
        subscription.stripeSubscriptionId,
      );

      const stripeSubscription = await this.stripeService.createSubscription({
        stripeCustomerId,
        items,
        tax: user.isFromNorway,
        metadata,
        description: `Plan - ${plan.type} - ${plan.period}. Quantity - ${quantity}.`,
      });

      invoiceId =
        typeof stripeSubscription.latest_invoice === "string"
          ? stripeSubscription.latest_invoice
          : stripeSubscription.latest_invoice.id;

      subscription = await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          userId,
          licenseId: license?.id,
          stripeSubscriptionId: stripeSubscription.id,
          planId: plan.id,
          isActive: false,
          isInTrial: false,
          nextDate: new Date(stripeSubscription.current_period_end * 1000),
        },
        include: { plan: true },
      });
    }
    const invoice = await this.stripeService.getInvoiceById(invoiceId);

    return { url: invoice?.hosted_invoice_url };
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

    const allInvoices: Stripe.Invoice[] = [];
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

    const invoices = allInvoices
      .filter((invoice) => !invoice.metadata.share)
      .filter((invoice, index) => {
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

    await this.stripeService.putSubscriptionOnPause(
      subscription.stripeSubscriptionId,
    );

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

    await this.stripeService.activeSubscription(
      subscription.stripeSubscriptionId,
    );

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
      const stripeSubscription = await this.stripeService.getSubscriptionById(
        subscription.stripeSubscriptionId,
      );

      if (!stripeSubscription || stripeSubscription.status === "past_due") {
        throw new BadRequestException(
          "An error occurred when paying for the License",
        );
      }

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          isActive: true,
          isInTrial: false,
          nextDate: new Date(stripeSubscription.current_period_end * 1000),
        },
      });
    }

    return { status: LicenseStatus.active };
  }

  async checkDiscount(userId: string, payAmount: number) {
    let discountId = undefined;
    let discountAmount = undefined;

    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });

    if (!wallet || !wallet?.discountAmount)
      return { discountId, discountAmount };

    if (payAmount >= wallet.discountAmount) {
      discountAmount = wallet.discountAmount;
    } else {
      discountAmount = payAmount;
    }

    const stripeDiscount =
      await this.stripeService.createCoupon(discountAmount);

    discountId = stripeDiscount.id;

    await this.prisma.discount.create({
      data: {
        userId,
        amount: discountAmount,
        stripeCouponId: discountId,
      },
    });

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        discountAmount: { decrement: discountAmount },
      },
    });

    await this.prisma.walletTransaction.create({
      data: {
        userId,
        walletId: wallet.id,
        amount: discountAmount,
        transactionType: TransactionType.expense,
        balanceType: BalanceType.discount,
        description: "Subscription payment",
      },
    });

    return { discountId, discountAmount };
  }

  async changePlan({ planId, subscriptionId }: ChangePlanDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    const stripeSubscription = await this.stripeService.getSubscriptionById(
      subscription.stripeSubscriptionId,
    );

    if (!stripeSubscription) {
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

    await this.stripeService.changeSubscriptionItems({
      subscriptionId: stripeSubscription.id,
      subscriptionItemId: stripeSubscription.items.data[0].id,
      newPriceId: plan.stripePriceId,
      quantity: stripeSubscription.items.data[0].quantity,
      metadata: { newPlan: plan.id },
      description: `Plan - ${plan.type} - ${plan.period}. Quantity - ${stripeSubscription.items.data[0].quantity}.`,
    });

    if (plan.type === LicenseTierType.freemium) {
      await this.prisma.subscription.update({
        where: { id: subscriptionId },
        data: { planId, isActive: true, isInTrial: false },
      });
      await this.prisma.license.update({
        where: { id: subscription.licenseId },
        data: { tierType: LicenseTierType.freemium },
      });
    } else if (difference < 0) {
      await this.prisma.subscription.update({
        where: { id: subscriptionId },
        data: { newPlanId: planId },
      });
    } else {
      await this.prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          planId,
        },
      });
      await this.prisma.license.update({
        where: { id: subscription.licenseId },
        data: { tierType: plan.type },
      });

      await this.stripeService.activeSubscription(
        subscription.stripeSubscriptionId,
      );

      const invoiceId =
        typeof stripeSubscription.latest_invoice === "string"
          ? stripeSubscription.latest_invoice
          : stripeSubscription.latest_invoice.id;
      const invoice = await this.stripeService.getInvoiceById(invoiceId);

      if (!invoice || invoice.status !== "paid") {
        throw new BadRequestException(
          "Automatic payment is made. Please check the invoice in Payment history",
        );
      }

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          isActive: true,
          isInTrial: false,
          nextDate: new Date(stripeSubscription.current_period_end * 1000),
        },
      });
    }

    return plan;
  }

  // async cancelChangePlan(subscriptionId: string) {
  //   const subscription = await this.prisma.subscription.findUnique({
  //     where: { id: subscriptionId },
  //     include: { plan: true },
  //   });

  //   if (!subscription) {
  //     throw new NotFoundException("Subscription not found");
  //   }

  //   const stripeSubscription = await this.stripeService.getSubscriptionById(
  //     subscription.stripeSubscriptionId,
  //   );

  //   if (!stripeSubscription) {
  //     throw new NotFoundException("Subscription not found");
  //   }

  //   await this.stripeService.changeSubscriptionItems({
  //     subscriptionId: stripeSubscription.id,
  //     subscriptionItemId: stripeSubscription.items.data[0].id,
  //     newPriceId: subscription.plan.stripePriceId,
  //     quantity: stripeSubscription.items.data[0].quantity,
  //     metadata: { newPlan: null },
  //     description: `Plan - ${license.subscription.plan.type} - ${license.subscription.plan.period}. Quantity - ${stripeSubscription.items.data[0].quantity + 1}.`,
  //   });

  //   await this.prisma.subscription.update({
  //     where: { id: subscriptionId },
  //     data: { newPlanId: null },
  //   });

  //   return { status: "canalled" };
  // }

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

  async addDiscount({ discountAmount, userId }: IAddDiscount) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || !subscription.stripeSubscriptionId)
      throw new NotFoundException("Subscription not found");

    const discountDb = await this.prisma.discount.findFirst({
      where: { userId, used: null },
    });

    const stripeCoupon = await this.stripeService.createCoupon(discountAmount);

    await this.stripeService.updateSubscriptionDiscount(
      subscription.stripeSubscriptionId,
      stripeCoupon.id,
      discountDb?.stripeCouponId,
    );

    if (discountDb) {
      await this.prisma.discount.update({
        where: { id: discountDb.id },
        data: { stripeCouponId: stripeCoupon.id, amount: discountAmount },
      });
    } else {
      await this.prisma.discount.create({
        data: {
          stripeCouponId: stripeCoupon.id,
          amount: discountAmount,
          userId,
        },
      });
    }
  }

  async getInvoice() {
    const metadata = {
      quantity: 1,
      userId: null,
    };
    await this.stripeService.updateSubscriptionMetadata(
      "sub_1Qx35fIQ0ONDLa6ipDSz3ypQ",
      metadata,
    );
    return await this.stripeService.getSubscriptionById(
      "sub_1Qx35fIQ0ONDLa6ipDSz3ypQ",
    );
    return await this.stripeService.getInvoiceById(
      "in_1QwlnEIQ0ONDLa6ixSajagSO",
    );
  }
}
