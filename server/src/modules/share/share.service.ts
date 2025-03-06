import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from "../wallet/wallet.service";
import { BySharesDto } from "./dto/by-shares-dto";
import { PurchaseType } from "@prisma/client";
import { StripeService } from "../stripe/stripe.service";
import { CreateSharesInvoiceDto } from "./dto/create-shares-invoice-dto";
import { SubscriptionService } from "../subscription/subscription.service";

@Injectable()
export class ShareService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async byShares({ quantity, price, purchaseType, userId }: BySharesDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    const appSettings = await this.prisma.appSettings.findFirst({
      where: {},
    });

    if (!user || !user.wallet || !appSettings)
      throw new NotFoundException("User not found");

    const maxEndNumber = await this.prisma.purchasedShare.aggregate({
      _max: {
        endNumber: true,
      },
    });

    const startNumber = maxEndNumber._max.endNumber
      ? maxEndNumber._max.endNumber + 1
      : 1;
    const endNumber = startNumber + quantity - 1;

    await this.prisma.$transaction([
      this.prisma.purchasedShare.create({
        data: {
          userId,
          startNumber,
          endNumber,
          price,
          quantity,
          purchaseType,
        },
      }),

      this.prisma.appSettings.update({
        where: { id: appSettings.id },
        data: {
          currentSharesPurchased: {
            increment: price * quantity,
          },
        },
      }),
    ]);

    if (
      appSettings.currentSharesPurchased + price * quantity >=
        appSettings.limitOfSharesPurchased &&
      appSettings.earlyBirdPeriod
    ) {
      await this.subscriptionService.transformEarlyBirdToStandardSubscriptions();
    }

    await this.walletService.updateWallet({
      id: user.wallet.id,
      sharesAmount: user.wallet.sharesAmount + quantity,
      bonusAmount:
        purchaseType === PurchaseType.bonus
          ? user.wallet.bonusAmount - quantity * price
          : undefined,
    });
  }

  async createInvoiceToByShares({ userId, quantity }: CreateSharesInvoiceDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("User not found");

    let stripeCustomerId = user.stripeCustomerId;

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

    const appSettings = await this.prisma.appSettings.findFirst({
      where: {},
    });

    if (
      !appSettings ||
      !appSettings.sharePrice ||
      !appSettings.shareStripePriceId
    )
      throw new NotFoundException("Share not found");

    const metadata = {
      quantity,
      share: "true",
      userId,
    };

    const invoice = await this.stripeService.createAndPayInvoice({
      customerId: stripeCustomerId,
      priceId: appSettings.shareStripePriceId,
      quantity,
      description: `Shares. Quantity - ${quantity}.`,
      metadata,
      tax: false,
    });

    return { url: invoice.hosted_invoice_url };
  }
}
