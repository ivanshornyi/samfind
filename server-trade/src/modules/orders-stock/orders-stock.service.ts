import { BadRequestException, ConflictException, Injectable } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"
import { CreateStockOrderDto } from "./dto/create-order-dto"

@Injectable()
export class StockOrdersService {
  constructor(private readonly prisma: PrismaService) { }

  async createStockOrder(body: CreateStockOrderDto) {
    const { stockId, userId, type, quantity, offeredPrice, paymentId } = body
    // TO-DO: Send email after order is placed
    // TO-DO: Also / OR make and webhook notification, if will be decided to ALTER model with it

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

  async cancelStockOrder(id: string) {
    // TO-DO: Send email after order is canceled | rejected
    // TO-DO: Also / OR make and webhook notification, if will be decided to ALTER model with it

    try {
      const stockOrder = await this.prisma.$transaction(async (prisma) => {
        const originalOrder = await prisma.orderStock.findFirst({
          where: { id },
          include: { stock: true, user: true }
        })

        if (!originalOrder) {
          throw new Error("Order not found.")
        }

        if (!['PENDING', 'ACCEPTED'].includes(originalOrder.status)) {
          throw new Error("Only pending or accepted orders can be canceled.")
        }

        const stockOrder = await prisma.orderStock.update({
          where: { id: id },
          data: {
            status: 'CANCELED'
          }
        })

        await prisma.transactionHistory.create({
          data: {
            stockId: originalOrder.stock.id,
            userId: originalOrder.user.id,
            orderId: id,
            type: "REJECTION",
            quantity: 0,
            price: 0
          }
        })

        return stockOrder
      })

      return stockOrder
    } catch (error) {
      throw new ConflictException(`Failed to erase stock-order: ${error.message}`)
    }
  }

  async getAllStockOrdersWithPagination(page: number, limit: number, order: "asc" | "desc") {
    const stockOrders = await this.prisma.orderStock.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { user: true, stock: true, transaction: true },
      orderBy: { createdAt: order }
    })

    const total = await this.prisma.orderStock.count()

    return {
      paging: {
        page,
        limit,
        total
      },
      data: stockOrders
    }
  }
}
