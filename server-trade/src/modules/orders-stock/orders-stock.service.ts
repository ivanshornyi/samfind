import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"
import { CreateStockOrderDto } from "./dto/create-order-dto"

@Injectable()
export class StockOrdersService {
  constructor(private readonly prisma: PrismaService) { }

  async createStockService(body: CreateStockOrderDto) {
    const { stockId, userId, type, quantity, offeredPrice, paymentId } = body
    // TO-DO: Send email after order is placed

    if (!stockId || !userId) throw new BadRequestException("StockID and UserID is required in order creation.")
    try {
      const stockOrder = await this.prisma.$transaction(async (prisma) => {
        const stock = await prisma.stock.findFirst({
          where: { id: stockId }
        })

        const user = await prisma.user.findFirst({
          where: { id: userId }
        })

        const existingOrder = await this.prisma.orderStock.findFirst({
          where: {
            stockId,
            userId,
          },
        })

        if (existingOrder) throw new BadRequestException("You cannot duplicate an order for the same StockID and UserID.")
        if (!stock || !user) throw new BadRequestException("Stock or User wasn`t created or properly assigned.")

        const stockOrder = await prisma.orderStock.create({
          data: {
            stockId,
            userId,
            type,
            quantity,
            offeredPrice,
            paymentId: paymentId ? paymentId : null
          }
        })

        await prisma.transactionHistory.create({
          data: {
            stockId,
            userId,
            orderId: stockOrder.id,
            type: "PLACEMENT",
            quantity: quantity,
            price: offeredPrice
          }
        })

        return stockOrder
      })

      return stockOrder
    } catch (error) {
      throw new BadRequestException(`Failed to create stock-order: ${error.message}`)
    }
  }
}
