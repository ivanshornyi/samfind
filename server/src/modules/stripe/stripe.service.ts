import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import Stripe from "stripe";
import {
  UserAccountType,
  LicenseStatus,
  PlanPeriod,
  PurchaseType,
  LicenseTierType,
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";

import { CreateIntentDto } from "./dto/create-intent-dto";
import { getDate, getDaysInMonth, getMonth, isSameDay } from "date-fns";
import { MailService } from "../mail/mail.service";
import { ShareService } from "../share/share.service";
import { WalletService } from "../wallet/wallet.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { HttpService } from "@nestjs/axios";

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
  tax?: "inclusive" | "added";
}

interface ICreateSubscription {
  stripeCustomerId: string;
  items: { price: string; quantity: number }[];
  tax?: "inclusive" | "added";
  metadata: { [key: string]: string | number };
  description: string;
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

interface IAddTax {
  name: string;
  description: string;
  percentage: number;
  inclusive: boolean;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => ShareService))
    private readonly shareService: ShareService,
    private readonly walletService: WalletService,
    private readonly subscriptionService: SubscriptionService,
    private readonly httpService: HttpService,
  ) {
    this.stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY"), {
      apiVersion: "2024-12-18.acacia",
    });
  }

  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({ email, name });
  }

  async getCustomer(customerId: string) {
    return (await this.stripe.customers.retrieve(
      customerId,
    )) as Stripe.Customer;
  }

  async updateCustomerBalance(
    customerId: string,
    amount: number,
    decrement?: boolean,
  ) {
    const customer = (await this.getCustomer(customerId)) as Stripe.Customer;

    if (!customer) return;

    return await this.stripe.customers.update(customerId, {
      balance: decrement
        ? customer.balance + amount
        : customer.balance - amount,
    });
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

  async deleteCoupon(couponId: string) {
    return await this.stripe.coupons.del(couponId);
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
    tax,
  }: ICreateAndPayInvoice) {
    let stripeTaxId = null;

    if (tax) {
      const appSettings = await this.prisma.appSettings.findFirst({
        where: {},
      });
      stripeTaxId =
        tax === "added"
          ? appSettings?.stripeTaxAddedId
          : appSettings?.stripeTaxInclusive;
    }

    const customer = await this.getCustomer(customerId);
    if (!customer) return;
    const customerBalance = customer.balance;

    if (customerBalance < 0) {
      await this.updateCustomerBalance(
        customerId,
        Math.abs(customerBalance),
        true,
      );
    }

    const invoice = await this.stripe.invoices.create({
      customer: customerId,
      description,
      metadata,
      currency: "eur",
      collection_method: "charge_automatically",
      default_tax_rates: stripeTaxId ? [stripeTaxId] : undefined,
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

    if (customerBalance < 0) {
      await this.updateCustomerBalance(customerId, Math.abs(customerBalance));
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
      const stripeCustomerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer.id;
      const invoiceLink = invoice.hosted_invoice_url;

      const user = await this.prisma.user.findUnique({
        where: { stripeCustomerId },
      });

      if (!user) return;

      if (invoice.subscription) {
        const stripeSubscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription.id;

        const subscription = await this.prisma.subscription.findFirst({
          where: { stripeSubscriptionId },
        });
        if (!subscription) return;

        const today = new Date();
        const nextDate = new Date(subscription.nextDate);

        const sameDay = isSameDay(today, nextDate);
        if (sameDay) {
          await this.prisma.subscription.update({
            where: { id: subscription.id },
            data: { isInTrial: true },
          });
        }
      }

      if (invoice.metadata.trading) {
        const baseUrl = this.configService.get("TRADING_API_URL");
        if (baseUrl)
          this.httpService.post(
            baseUrl,
            {
              message: "fail",
              status: false,
            },
            {
              headers: {
                Authorization: `Bearer ${this.configService.get("DEVICE_SECRET")}`,
                "Content-Type": "application/json",
              },
            },
          );
      }

      await this.mailService.sendWarningPaymentFailed(user.email, invoiceLink);
      this.logger.log(`Invoice payment failed for user ${user?.id}`);
    } catch (error) {
      this.logger.error("Error fail pay invoice license to user", error);
    }
  }

  private async handleSuccessfulInvoicePayment(invoice: Stripe.Invoice) {
    try {
      const {
        quantity: quantityShears,
        share,
        userId,
        stockId,
      } = invoice.metadata;
      const appSettings = await this.prisma.appSettings.findFirst({
        where: {},
      });

      if (share && userId && quantityShears) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });
        if (!appSettings || !appSettings.sharePrice || !user?.stripeCustomerId)
          return;

        if (
          appSettings.earlyBirdPeriod &&
          appSettings.currentSharesPurchased <
            appSettings.limitOfSharesPurchased
        ) {
          await this.updateCustomerDiscountForPurchasedShares(
            user.stripeCustomerId,
            Number(quantityShears),
            appSettings.sharePrice,
          );
        }
        await this.shareService.buyShares({
          quantity: Number(quantityShears),
          purchaseType: PurchaseType.money,
          userId,
          price: appSettings.sharePrice,
          stockId,
          invoiceId: invoice.id,
        });
      } else if (invoice.subscription) {
        const { userId, userReferralCode, memberId, newPlan, quantity } =
          invoice.subscription_details.metadata;
        const metadata = invoice.subscription_details.metadata;
        let isEarlyBirdNew = false;

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

          isEarlyBirdNew = plan.type === LicenseTierType.earlyBird;

          await this.prisma.$transaction([
            this.prisma.license.update({
              where: {
                ownerId: subscription.userId,
              },
              data: {
                status: LicenseStatus.active,
                limit: isEarlyBirdNew
                  ? 1
                  : Number(quantity) || subscription.license.limit,
                tierType: plan.type,
              },
            }),
            this.prisma.subscription.update({
              where: { id: subscription.id },
              data: { newPlanId: null, planId: newPlan },
            }),
          ]);

          if (
            !isEarlyBirdNew &&
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
            { newPlan: null, quantity: null },
          );
        } else if (
          subscription.user.accountType === UserAccountType.business &&
          newPlan
        ) {
          const plan = await this.prisma.plan.findUnique({
            where: { id: newPlan },
          });
          if (!plan) return;

          isEarlyBirdNew = plan.type === LicenseTierType.earlyBird;

          if (!subscription.licenseId) {
            const license = await this.prisma.license.create({
              data: {
                ownerId: subscription.userId,
                status: LicenseStatus.active,
                limit: isEarlyBirdNew ? 1 : Number(quantity),
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
            if (!isEarlyBirdNew && Number(quantity) > 1) {
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
                  limit: isEarlyBirdNew ? 1 : Number(quantity),
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
            { newPlan: null, quantity: null },
          );
        }

        const stripeSubscription = await this.getSubscriptionById(
          invoice.subscription as string,
        );

        if (
          subscription.plan.type === LicenseTierType.earlyBird &&
          (!newPlan || subscription.plan.id === newPlan)
        ) {
          if (!appSettings || !appSettings.sharePrice) return;

          await this.shareService.buyShares({
            quantity: memberId ? 6 : stripeSubscription.items.data[0].quantity,
            purchaseType: PurchaseType.earlyBird,
            userId,
            price: appSettings.sharePrice,
          });
        }

        if (isEarlyBirdNew && stripeSubscription.items.data[0].quantity > 6) {
          if (!appSettings || !appSettings.sharePrice) return;

          await this.updateCustomerDiscountForPurchasedShares(
            subscription.user.stripeCustomerId,
            stripeSubscription.items.data[0].quantity - 6,
            appSettings.sharePrice,
          );
          await this.changeSubscriptionItems({
            subscriptionId: stripeSubscription.id,
            subscriptionItemId: stripeSubscription.items.data[0].id,
            quantity: 6,
            deleteMember: true,
            metadata: {},
            description: stripeSubscription.description,
          });
        }

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

  async updateCustomerDiscountForPurchasedShares(
    stripeCustomerId: string,
    sharesCount: number,
    sharePrice: number,
  ) {
    const validSharesCount = Math.floor(sharesCount / 6) * 6;
    await this.updateCustomerBalance(
      stripeCustomerId,
      validSharesCount * sharePrice,
    );
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

  async updateUsedDiscount(stripeCouponId: string, subtotal: number) {
    const discount = await this.prisma.discount.findFirst({
      where: { stripeCouponId },
      include: { user: { include: { wallet: true } } },
    });

    if (!discount) return;

    let discountAmount = 0;

    if (discount.amount > subtotal) {
      discountAmount = discount.amount - subtotal;

      await this.prisma.discount.update({
        where: { id: discount.id },
        data: { used: true, amount: subtotal },
      });

      await this.subscriptionService.addDiscount({
        discountAmount,
        userId: discount.userId,
      });
    } else {
      await this.prisma.discount.update({
        where: { id: discount.id },
        data: { used: true },
      });
    }

    await this.walletService.updateWallet({
      id: discount.user.wallet.id,
      discountAmount,
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
    let stripeTaxId = null;
    if (tax) {
      const appSettings = await this.prisma.appSettings.findFirst({
        where: {},
      });
      stripeTaxId =
        tax === "added"
          ? appSettings?.stripeTaxAddedId
          : appSettings?.stripeTaxInclusive;
    }

    return await this.stripe.subscriptions.create({
      customer: stripeCustomerId,
      payment_behavior: "default_incomplete",
      proration_behavior: "always_invoice",
      items,
      default_tax_rates: stripeTaxId ? [stripeTaxId] : undefined,
      expand: ["latest_invoice.payment_intent"],
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

  async addTax({ name, description, percentage, inclusive }: IAddTax) {
    return await this.stripe.taxRates.create({
      display_name: name,
      description,
      jurisdiction: "NO",
      percentage, // VAT 25%
      inclusive, // Чи включено у загальну ціну (false - додається окремо)
    });
  }

  async updateSubscriptionDiscount(
    subscriptionId: string,
    couponId: string,
    oldCouponId?: string,
  ) {
    await this.stripe.subscriptions.update(subscriptionId, {
      coupon: null,
    });

    if (oldCouponId) await this.deleteCoupon(oldCouponId);

    await this.stripe.subscriptions.update(subscriptionId, {
      coupon: couponId,
    });
  }
}
