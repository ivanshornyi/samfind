import { Injectable } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"

@Injectable()
export class PursharedSharesService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllUserSharesById(id: string) {
    return await this.prisma.user.findFirst({
      where: { id },
      include: { purchasedShares: true, transactions: true }
    })
  }
}
