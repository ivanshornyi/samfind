import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import Stripe from "stripe";
import {
  UserAccountType,
  LicenseStatus,
  PlanPeriod,
  User,
  TransactionType,
  BalanceType,
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";

import { CreateIntentDto } from "./dto/create-intent-dto";
import {
  addMonths,
  addYears,
  getDate,
  getDaysInMonth,
  getMonth,
  startOfMonth,
} from "date-fns";
import { MailService } from "../mail/mail.service";

interface ICreatePaymentSession {
  customerId: string;
  priceId: string;
  quantity: number;
  subscriptionId: string;
  description?: string;
  discountId?: string;
}

interface ICreateInvoiceItem {
  customerId: string;
  invoiceId: string;
  priceId: string;
  quantity: number;
  description: string;
}

interface ICreateAndPayInvoice {
  customerId: string;
  priceId: string;
  quantity: number;
  description: string;
  metadata: { [key: string]: string | number };
  couponId?: string;
  pay?: boolean;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {
    this.stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY"), {
      apiVersion: "2024-12-18.acacia",
    });
  }

  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({ email, name });
  }

  async createProduct(
    name: string,
    description: string,
  ): Promise<Stripe.Product> {
    return await this.stripe.products.create({ name, description });
  }

  async createPrice(productId: string, amount: number): Promise<Stripe.Price> {
    return await this.stripe.prices.create({
      unit_amount: amount,
      currency: "eur",
      product: productId,
    });
  }

  async createCoupon(amount: number): Promise<Stripe.Coupon> {
    return await this.stripe.coupons.create({
      amount_off: amount,
      currency: "eur",
      duration: "once",
    });
  }

  async getUserInvoices(
    customerId: string,
    limit: number,
    startingAfter?: string,
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.Invoice>>> {
    return await this.stripe.invoices.list({
      customer: customerId,
      limit,
      starting_after: startingAfter,
    });
  }

  createPaymentSession = async ({
    customerId,
    priceId,
    quantity,
    description,
    subscriptionId,
    discountId,
  }: ICreatePaymentSession) => {
    if (discountId) {
      await this.stripe.customers.update(customerId, {
        coupon: discountId,
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      // allow_promotion_codes: discountId ? true : undefined,
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata: {
            subscriptionId,
          },
        },
      },
      discounts: discountId ? [{ coupon: discountId }] : undefined,
      customer: customerId,
      mode: "payment",
      payment_intent_data: {
        setup_future_usage: "off_session",
        description,
      },
      success_url: "http://localhost:3000/",
      cancel_url: "http://localhost:3000/",
    });
    return session;
  };

  async createInvoiceItem({
    customerId,
    invoiceId,
    priceId,
    quantity,
    description,
  }: ICreateInvoiceItem): Promise<Stripe.InvoiceItem> {
    return await this.stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoiceId,
      price: priceId,
      quantity,
      description,
    });
  }

  async createAndPayInvoice({
    customerId,
    priceId,
    quantity,
    description,
    couponId,
    metadata,
    pay,
  }: ICreateAndPayInvoice) {
    const invoice = await this.stripe.invoices.create({
      customer: customerId,
      description,
      metadata,
      currency: "eur",
      collection_method: "charge_automatically",
    });

    await this.createInvoiceItem({
      customerId,
      invoiceId: invoice.id,
      priceId,
      quantity,
      description,
    });

    if (couponId)
      await this.stripe.invoices.update(invoice.id, {
        discounts: [
          {
            coupon: couponId,
          },
        ],
      });

    await this.stripe.invoices.finalizeInvoice(invoice.id);
    if (pay) {
      await this.stripe.invoices.pay(invoice.id);
    }

    const retrieveInvoice = await this.stripe.invoices.retrieve(invoice.id);

    return retrieveInvoice;
  }

  async getPaymentIntention(paymentIntentId: string) {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async createPaymentIntent(
    createPaymentDto: CreateIntentDto,
  ): Promise<Stripe.PaymentIntent> {
    const { userId, amount, currency, tierType, limit, userReferralCode } =
      createPaymentDto;

    const referralDiscount = amount / 10;

    let metadata: any = {
      userId,
      tierType,
      limit,
    };

    let intent = {
      amount,
      currency,
      metadata,
    };

    if (userReferralCode) {
      intent.metadata = {
        ...metadata,
        userReferralCode,
        referralDiscount,
      };
    }

    return this.stripe.paymentIntents.create(intent);
  }

  constructEvent(
    payload: any,
    sig: string | string[],
    secret: string,
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, sig, secret);
  }

  async handleEvent(event: Stripe.Event) {
    const invoice = event.data.object as Stripe.Invoice;

    switch (event.type) {
      case "invoice.payment_succeeded":
        this.handleSuccessfulInvoicePayment(invoice);
        break;
      case "invoice.payment_failed":
        this.handleFailedInvoicePayment(invoice);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  private async handleFailedInvoicePayment(invoice: Stripe.Invoice) {
    try {
      const invoiceLink = invoice.hosted_invoice_url;
      const { subscriptionId } = invoice.metadata;

      const subscription = await this.prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { user: true },
      });

      if (!subscription) return;

      await this.mailService.sendWarningPaymentFailed(
        subscription.user.email,
        invoiceLink,
      );
      this.logger.log(
        `Invoice payment failed for user ${subscription?.userId}`,
      );
    } catch (error) {
      this.logger.error("Error fail pay invoice license to user", error);
    }
  }

  private async handleSuccessfulInvoicePayment(invoice: Stripe.Invoice) {
    try {
      const {
        quantity,
        userReferralCode,
        subscriptionId,
        stripeCouponId,
        discountAmount,
        memberId,
        firstInvoice,
      } = invoice.metadata;

      const subscription = await this.prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { plan: true, user: true, license: true },
      });

      if (!subscription) return;

      let licenseId = subscription.licenseId;

      if (userReferralCode) {
        // find user and update user discount

        const discountAmount =
          subscription.plan.period === PlanPeriod.yearly
            ? Math.round(subscription.plan.price / 100)
            : Math.round(subscription.plan.price / 10);

        this.userService.findAndUpdateUserByReferralCode(
          Number(userReferralCode),
          subscription.user,
          discountAmount,
        );
      }

      if (subscription.licenseId && memberId) {
        const member = await this.prisma.user.findUnique({
          where: { id: memberId },
        });
        if (!member) return;

        await this.prisma.activeLicense.create({
          data: {
            userId: memberId,
            licenseId: subscription.licenseId,
          },
        });

        const discountAmount = this.calculateDiscount(
          subscription.plan.price,
          subscription.plan.period === PlanPeriod.yearly
            ? new Date(subscription.nextDate)
            : undefined,
        );

        if (discountAmount > 0) {
          await this.addDiscount(
            subscription.user,
            discountAmount,
            member.email,
          );
        }
      } else if (
        subscription.user.accountType === UserAccountType.private &&
        firstInvoice &&
        subscription.license
      ) {
        await this.prisma.license.update({
          where: {
            ownerId: subscription.userId,
          },
          data: {
            status: LicenseStatus.active,
            limit: Number(quantity),
            tierType: subscription.plan.type,
          },
        });
        if (Number(quantity) > 1) {
          const data = Array.from({ length: Number(quantity) - 1 }, () => ({
            licenseId: subscription.license.id,
          }));

          await this.prisma.activeLicense.createMany({
            data,
          });
        }
      } else if (
        subscription.user.accountType === UserAccountType.business &&
        !subscription.licenseId
      ) {
        const license = await this.prisma.license.create({
          data: {
            ownerId: subscription.userId,
            status: LicenseStatus.active,
            limit: Number(quantity),
            tierType: subscription.plan.type,
          },
        });
        licenseId = license.id;
        await this.prisma.activeLicense.create({
          data: {
            userId: subscription.userId,
            licenseId: license.id,
          },
        });
        if (Number(quantity) > 1) {
          const data = Array.from({ length: Number(quantity) - 1 }, () => ({
            licenseId: subscription.license.id,
          }));

          await this.prisma.activeLicense.createMany({
            data,
          });
        }
      }

      if (stripeCouponId && discountAmount) {
        await this.prisma.discount.updateMany({
          where: { stripeCouponId },
          data: {
            used: true,
          },
        });
      }

      if (firstInvoice) {
        const totalAmount =
          quantity && Number(quantity) > 1
            ? subscription.plan.price * Number(quantity)
            : subscription.plan.price;

        const discountAmount = this.calculateDiscount(
          totalAmount,
          subscription.plan.period === PlanPeriod.yearly
            ? new Date(subscription.nextDate)
            : undefined,
        );

        if (discountAmount === 0) return;

        await this.addDiscount(
          subscription.user,
          discountAmount,
          subscription.user.email,
        );
      }

      if (!memberId) {
        const nextDate =
          subscription.plan.period === PlanPeriod.monthly
            ? startOfMonth(addMonths(new Date(), 1)).toISOString()
            : startOfMonth(addYears(new Date(), 1)).toISOString();
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            licenseId,
            isActive: true,
            isInTrial: false,
            nextDate,
            cancelDate: null,
            stripeInvoiceIds: [...subscription.stripeInvoiceIds, invoice.id],
          },
        });

        if (!firstInvoice && !subscription.isActive) {
          await this.prisma.license.update({
            where: {
              ownerId: subscription.userId,
            },
            data: {
              status: "active",
            },
          });
        }
      }

      this.logger.log(`Invoice payed for user ${subscription?.userId}`);
    } catch (error) {
      this.logger.error("Error paying license to user", error);
    }
  }

  calculateDiscount(totalAmount: number, nextDate?: Date): number {
    const today = new Date();
    const currentDay = getDate(today);
    const currentMonth = getMonth(today);
    const totalDaysInMonth = getDaysInMonth(today);

    if (nextDate) {
      const renewalMonth = getMonth(nextDate);
      let monthsPassed = ((currentMonth - renewalMonth + 12) % 12) - 1;
      if (monthsPassed < 0) monthsPassed = 0;

      const monthlyRate = totalAmount / 12;
      const pastMonthsAmount = monthlyRate * monthsPassed;

      const dailyRate = monthlyRate / totalDaysInMonth;
      const currentMonthDiscount = dailyRate * (currentDay - 1);

      return Math.round(pastMonthsAmount + currentMonthDiscount);
    } else {
      const dailyRate = Math.round(totalAmount / totalDaysInMonth);
      return dailyRate * (currentDay - 1);
    }
  }

  async addDiscount(
    user: User,
    discountAmount: number,
    email: string,
    referral?: boolean,
  ) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) return;

    await this.prisma.wallet.update({
      where: { userId: user.id },
      data: { discountAmount: { increment: discountAmount } },
    });

    await this.prisma.walletTransaction.create({
      data: {
        userId: user.id,
        walletId: wallet.id,
        amount: discountAmount,
        transactionType: TransactionType.income,
        balanceType: BalanceType.discount,
        description: `Discount for unused user period user with email - ${email}`,
      },
    });
  }
}
