import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { UpdateWalletDto } from "./dto/update-user-license-dto";
import { BalanceType, TransactionType } from "@prisma/client";
import { SubscriptionService } from "../subscription/subscription.service";
import { StripeService } from "../stripe/stripe.service";

@Injectable()
export class WalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
  ) {}

  async getUserWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!wallet) throw new NotFoundException("Wallet not found");

    let discountAmount = wallet.discountAmount;

    if (wallet.user.stripeCustomerId) {
      const stripeUser = await this.stripeService.getCustomer(
        wallet.user.stripeCustomerId,
      );
      if (!stripeUser) throw new NotFoundException("Stripe User not found");

      discountAmount = Math.abs(stripeUser.balance);
    }

    return {
      ...wallet,
      discountAmount,
      user: undefined,
    };
  }

  async updateWallet({
    id,
    discountAmount,
    bonusAmount,
    sharesAmount,
    salesAmount,
    sweatAmount,
  }: UpdateWalletDto) {
    if (!discountAmount && !bonusAmount && !sharesAmount)
      throw new BadRequestException("No data to change");

    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!wallet) throw new NotFoundException("Wallet not found");

    if (discountAmount && (bonusAmount || bonusAmount === 0)) {
      if (discountAmount > wallet.discountAmount) {
        await this.subscriptionService.addDiscount({
          discountAmount,
          userId: wallet.userId,
        });
      }

      if (bonusAmount < wallet.bonusAmount) {
        await this.prisma.walletTransaction.create({
          data: {
            userId: wallet.userId,
            walletId: wallet.id,
            amount: wallet.bonusAmount - bonusAmount,
            transactionType: TransactionType.expense,
            balanceType: BalanceType.bonus,
            description: "Transfer to a discount balance",
          },
        });
      }
    } else if (sharesAmount && (bonusAmount || bonusAmount === 0)) {
      if (sharesAmount > wallet.sharesAmount) {
        await this.prisma.walletTransaction.create({
          data: {
            userId: wallet.userId,
            walletId: wallet.id,
            amount: sharesAmount - wallet.sharesAmount,
            transactionType: TransactionType.income,
            balanceType: BalanceType.shares,
            description: "Buying with bonuses",
          },
        });
      }

      if (bonusAmount < wallet.bonusAmount) {
        await this.prisma.walletTransaction.create({
          data: {
            userId: wallet.userId,
            walletId: wallet.id,
            amount: wallet.bonusAmount - bonusAmount,
            transactionType: TransactionType.expense,
            balanceType: BalanceType.bonus,
            description: "Purchase of shares",
          },
        });
      }
    } else if (bonusAmount && (salesAmount || salesAmount === 0)) {
      if (bonusAmount > wallet.bonusAmount) {
        await this.prisma.walletTransaction.create({
          data: {
            userId: wallet.userId,
            walletId: wallet.id,
            amount: bonusAmount - wallet.bonusAmount,
            transactionType: TransactionType.income,
            balanceType: BalanceType.bonus,
            description: "Transfer from Salas balance",
          },
        });
      }

      if (salesAmount < wallet.salesAmount) {
        await this.prisma.walletTransaction.create({
          data: {
            userId: wallet.userId,
            walletId: wallet.id,
            amount: wallet.salesAmount - salesAmount,
            transactionType: TransactionType.expense,
            balanceType: BalanceType.sale,
            description: "Transfer to a bonus balance",
          },
        });
      }
    } else if (bonusAmount && (sweatAmount || sweatAmount === 0)) {
      if (bonusAmount > wallet.bonusAmount) {
        await this.prisma.walletTransaction.create({
          data: {
            userId: wallet.userId,
            walletId: wallet.id,
            amount: bonusAmount - wallet.bonusAmount,
            transactionType: TransactionType.income,
            balanceType: BalanceType.bonus,
            description: "Transfer from Sweat balance",
          },
        });
      }

      if (sweatAmount < wallet.sweatAmount) {
        await this.prisma.walletTransaction.create({
          data: {
            userId: wallet.userId,
            walletId: wallet.id,
            amount: wallet.sweatAmount - sweatAmount,
            transactionType: TransactionType.expense,
            balanceType: BalanceType.sweat,
            description: "Transfer to a bonus balance",
          },
        });
      }
    } else if (sharesAmount) {
      if (sharesAmount > wallet.sharesAmount) {
        await this.prisma.walletTransaction.create({
          data: {
            userId: wallet.userId,
            walletId: wallet.id,
            amount: sharesAmount - wallet.sharesAmount,
            transactionType: TransactionType.income,
            balanceType: BalanceType.shares,
            description: "Buying with money",
          },
        });
      }
    }
    const stripeUser = await this.stripeService.getCustomer(
      wallet.user.stripeCustomerId,
    );
    if (!stripeUser) throw new NotFoundException("Stripe User not found");

    return await this.prisma.wallet.update({
      where: { id },
      data: {
        discountAmount: Math.abs(stripeUser.balance),
        bonusAmount,
        sharesAmount,
        salesAmount,
        sweatAmount,
      },
    });
  }
}
