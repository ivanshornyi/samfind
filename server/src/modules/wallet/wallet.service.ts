import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { UpdateWalletDto } from "./dto/update-user-license-dto";
import { BalanceType, TransactionType } from "@prisma/client";

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserWallet(userId: string) {
    return await this.prisma.wallet.findUnique({ where: { userId } });
  }

  async updateWallet({
    id,
    discountAmount,
    bonusAmount,
    sharesAmount,
  }: UpdateWalletDto) {
    if (!discountAmount && !bonusAmount && !sharesAmount)
      throw new BadRequestException("No data to change");

    const wallet = await this.prisma.wallet.findUnique({ where: { id } });

    if (!wallet) throw new NotFoundException("Wallet not found");

    if (discountAmount && bonusAmount) {
      if (discountAmount > wallet.discountAmount) {
        await this.prisma.walletTransaction.create({
          data: {
            userId: wallet.userId,
            walletId: wallet.id,
            amount: discountAmount - wallet.discountAmount,
            transactionType: TransactionType.income,
            balanceType: BalanceType.discount,
            description: "Transfer from a bonus balance",
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
            description: "Transfer to a discount balance",
          },
        });
      }
    }

    if (sharesAmount && bonusAmount) {
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
    }

    return await this.prisma.wallet.update({
      where: { id },
      data: { discountAmount, bonusAmount, sharesAmount },
    });
  }
}
