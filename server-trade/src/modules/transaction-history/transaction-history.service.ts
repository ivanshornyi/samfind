import { PrismaService } from "nestjs-prisma";
import { Injectable } from "@nestjs/common";
import { OrderType } from "src/common/types/order-type";

@Injectable()
export class TransactionHistoryService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllTransactionHistoriesWithPagination(page: number, limit: number, order: OrderType) {
    const history = await this.prisma.transactionHistory.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true, stock: true, order: true },
      orderBy: { createdAt: order }
    })

    const total = await this.prisma.transactionHistory.count()

    return {
      paging: {
        page,
        limit,
        total
      },
      data: history
    }
  }

  async getAllTransactionHistoriesWithPaginationForId(id: string, page: number, limit: number, order: OrderType) {
    const history = await this.prisma.transactionHistory.findMany({
      where: { id },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true, stock: true, order: true },
      orderBy: { createdAt: order }
    })

    const total = await this.prisma.transactionHistory.count({
      where: { id }
    })

    return {
      paging: {
        page,
        limit,
        total
      },
      data: history
    }
  }
}
