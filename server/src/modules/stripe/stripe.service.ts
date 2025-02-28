import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import Stripe from "stripe";
import {
  UserAccountType,
  LicenseStatus,
  PlanPeriod,
  User,
  TransactionType,
  BalanceType,
  PurchaseType,
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
import { ShareService } from "../share/share.service";

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

interface ICreateSubscription {
  stripeCustomerId: string;
  items: { price: string; quantity: number }[];
  tax: boolean;
  metadata: { [key: string]: string | number };
  description: string;
}

interface IUpdateSubscriptionItems {
  subscriptionId: string;
  subscriptionItemId: string;
  items: { price: string; quantity: number }[];
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
    @Inject(forwardRef(() => ShareService))
    private readonly shareService: ShareService,
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
      automatic_tax: metadata.subscriptionId ? { enabled: true } : undefined,
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

    const metadata: any = {
      userId,
      tierType,
      limit,
    };

    const intent = {
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
      const { quantity: quantityShears, share, userId } = invoice.metadata;

      if (share && userId && quantityShears) {
        await this.shareService.byShares({
          quantity: Number(quantityShears),
          purchaseType: PurchaseType.money,
          userId,
          price: invoice.total,
        });
      } else if (invoice.subscription) {
        const {
          userId,
          userReferralCode,
          memberId,
          newPlan,
          quantity,
          stripeCouponId,
        } = invoice.subscription_details.metadata;
        const metadata = invoice.subscription_details.metadata;

        const subscription = await this.prisma.subscription.findUnique({
          where: { userId },
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

        if (!subscription) return;

        let licenseId = subscription.licenseId;

        if (userReferralCode) {
          // find user and update user discount

          const discountAmount =
            subscription.plan.period === PlanPeriod.yearly
              ? Math.round(subscription.plan.price / 10)
              : Math.round(subscription.plan.price / 10);

          this.userService.findAndUpdateUserByReferralCode(
            Number(userReferralCode),
            subscription.user,
            discountAmount,
          );

          delete metadata.userReferralCode;
          await this.updateSubscriptionMetadata(
            invoice.subscription as string,
            { userReferralCode: null },
          );
        }

        if (subscription.licenseId && memberId) {
          const member = await this.prisma.user.findUnique({
            where: { id: memberId },
          });
          if (!member) return;
          console.log(member);
          await this.prisma.activeLicense.create({
            data: {
              userId: memberId,
              licenseId: subscription.licenseId,
            },
          });

          await this.updateSubscriptionMetadata(
            invoice.subscription as string,
            { memberId: null },
          );
        } else if (
          subscription.user.accountType === UserAccountType.private &&
          newPlan &&
          subscription.license
        ) {
          const plan = await this.prisma.plan.findUnique({
            where: { id: newPlan },
          });
          if (!plan) return;

          await this.prisma.$transaction([
            this.prisma.license.update({
              where: {
                ownerId: subscription.userId,
              },
              data: {
                status: LicenseStatus.active,
                limit: Number(quantity),
                tierType: plan.type,
              },
            }),
            this.prisma.subscription.update({
              where: { id: subscription.id },
              data: { newPlanId: null, planId: newPlan },
            }),
          ]);

          if (
            Number(quantity) > 1 &&
            subscription.license._count.activeLicenses <= 1
          ) {
            const data = Array.from({ length: Number(quantity) - 1 }, () => ({
              licenseId: subscription.license.id,
            }));

            await this.prisma.activeLicense.createMany({
              data,
            });
          }

          await this.updateSubscriptionMetadata(
            invoice.subscription as string,
            { newPlan: null },
          );
        } else if (
          subscription.user.accountType === UserAccountType.business &&
          newPlan
        ) {
          const plan = await this.prisma.plan.findUnique({
            where: { id: newPlan },
          });
          if (!plan) return;

          if (!subscription.licenseId) {
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
                licenseId,
              },
            });
            if (Number(quantity) > 1) {
              const data = Array.from({ length: Number(quantity) - 1 }, () => ({
                licenseId: licenseId,
              }));

              await this.prisma.activeLicense.createMany({
                data,
              });
            }
          } else {
            await this.prisma.$transaction([
              this.prisma.license.update({
                where: {
                  ownerId: subscription.userId,
                },
                data: {
                  status: LicenseStatus.active,
                  limit: Number(quantity),
                  tierType: plan.type,
                },
              }),
              this.prisma.subscription.update({
                where: { id: subscription.id },
                data: { newPlanId: null, planId: newPlan },
              }),
            ]);
            licenseId = subscription.licenseId;
          }

          await this.updateSubscriptionMetadata(
            invoice.subscription as string,
            { newPlan: null },
          );
        }

        if (stripeCouponId) {
          await this.prisma.discount.updateMany({
            where: { stripeCouponId },
            data: {
              used: true,
            },
          });

          await this.updateSubscriptionMetadata(
            invoice.subscription as string,
            { stripeCouponId: null },
          );
        }

        const stripeSubscription = await this.getSubscriptionById(
          invoice.subscription as string,
        );
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            licenseId,
            isActive: true,
            isInTrial: false,
            nextDate: new Date(stripeSubscription.current_period_end * 1000),
            cancelDate: null,
            stripeInvoiceIds: [...subscription.stripeInvoiceIds, invoice.id],
          },
        });

        if (!subscription.isActive) {
          await this.prisma.license.update({
            where: {
              ownerId: subscription.userId,
            },
            data: {
              status: "active",
            },
          });
        }

        this.logger.log(`Invoice payed for user ${subscription?.userId}`);
      }
    } catch (error) {
      this.logger.error("Error paying invoice to user", error);
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

  async addDiscount(user: User, discountAmount: number, email: string) {
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

  async checkAndAddEarlyBirdBonus(userId: string, amount: number) {
    const appSettings = await this.prisma.appSettings.findFirst({
      where: {},
    });

    if (
      !appSettings ||
      !appSettings.earlyBirdPeriod ||
      appSettings.currentSharesPurchased >=
        appSettings.limitOfSharesPurchased ||
      amount === 0
    )
      return;

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) return;

    await this.prisma.wallet.update({
      where: { userId },
      data: { bonusAmount: { increment: amount } },
    });

    await this.prisma.walletTransaction.create({
      data: {
        userId: userId,
        walletId: wallet.id,
        amount,
        transactionType: TransactionType.income,
        balanceType: BalanceType.bonus,
        description: `Early Bird Bonus`,
      },
    });
  }

  async createSubscriptionPrice(
    amount: number,
    productId: string,
    period: PlanPeriod,
  ) {
    return await this.stripe.prices.create({
      unit_amount: amount,
      currency: "eur",
      recurring: { interval: period === PlanPeriod.monthly ? "month" : "year" },
      product: productId,
    });
  }

  async createSubscription({
    stripeCustomerId,
    items,
    tax,
    metadata,
    description,
  }: ICreateSubscription) {
    return await this.stripe.subscriptions.create({
      customer: stripeCustomerId,
      payment_behavior: "default_incomplete",
      proration_behavior: "always_invoice",
      items,
      expand: ["latest_invoice.payment_intent"],
      automatic_tax: tax ? { enabled: true } : undefined,
      metadata,
      description,
    });
  }

  async getInvoiceById(invoiceId: string) {
    return await this.stripe.invoices.retrieve(invoiceId);
  }

  async getSubscriptionById(subscriptionId: string) {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async cancelSubscriptionById(subscriptionId: string) {
    return await this.stripe.subscriptions.cancel(subscriptionId);
  }

  async updateSubscriptionMetadata(
    subscriptionId: string,
    metadata: { [key: string]: string | number },
  ) {
    this.stripe.subscriptions.update(subscriptionId, {
      metadata,
    });
  }

  async putSubscriptionOnPause(subscriptionId: string) {
    await this.stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: "keep_as_draft", // Зупиняє платежі, але зберігає підписку
      },
    });
  }

  async activeSubscription(subscriptionId: string) {
    await this.stripe.subscriptions.update(subscriptionId, {
      pause_collection: null, // Відновлює підписку
    });
  }

  async changeSubscriptionItems({
    subscriptionId,
    subscriptionItemId,
    newPriceId,
    quantity,
    metadata,
    description,
    deleteMember,
  }: IChangeSubscriptionItems) {
    await this.stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionItemId,
          price: newPriceId,
          quantity,
        },
      ],
      proration_behavior: metadata.memberId
        ? "always_invoice"
        : deleteMember
          ? "none"
          : undefined,
      metadata,
      description,
    });
  }
}

export interface IChangeSubscriptionItems {
  newPriceId?: string;
  subscriptionId: string;
  subscriptionItemId: string;
  quantity: number;
  description: string;
  deleteMember?: boolean;
  metadata: { [key: string]: string | number };
}
