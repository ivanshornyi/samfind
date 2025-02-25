import { PrismaService } from "nestjs-prisma";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionHistoryService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllTransactionHistoriesWithPagination(page: number, limit: number, order: "asc" | "desc") {
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
}
