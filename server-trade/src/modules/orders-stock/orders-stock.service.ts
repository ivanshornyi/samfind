import { BadRequestException, ConflictException, Injectable } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"
import { $Enums } from "@prisma/client"
import { CreateStockOrderDto } from "./dto/create-order-dto"
import { CreatePoolPurchaseDto } from "./dto/create-pool-purshare-dto"

interface Order {
  stockId: string
  userId: string
  type: $Enums.OrderType
  quantity: number
  offeredPrice: number
  paymentId: string | null
  id: string
  status: $Enums.OrderStatus
  createdAt: Date
  updatedAt: Date
}

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
        const stock = await prisma.stock.findUnique({ where: { id: stockId } })
        const user = await prisma.user.findUnique({ where: { id: userId } })

        if (!stock || !user) throw new BadRequestException("Stock or User wasn`t created or properly assigned.")

        // check if user have enough quantity to sell
        if (type === "SELL") {
          const sellerShare = await prisma.purchasedShare.findFirst({
            where: { userId, stockId },
          })
          if (!sellerShare || sellerShare.quantity < quantity) {
            throw new BadRequestException("Insufficient shares to sell.")
          }
        }

        // check if totalQuantity is enough to fullfill user needs
        if (type === 'BUY' && stock.totalQuantity < quantity) {
          throw new BadRequestException("You cant order to buy more then amount of stocks available.")
        }

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

        const matchingOrder = await this.checkMatchingOrder(prisma, stockOrder)
        if (matchingOrder) {
          await this.performTrade(prisma, stockOrder, matchingOrder)
          return { ...stockOrder, status: 'COMPLETED' }
          // we should return a created order with COMPLETED status
          // even if this another requiest
        }

        return stockOrder
      })

      return stockOrder
    } catch (error) {
      throw new BadRequestException(`Failed to create stock-order: ${error.message}`)
    }
  }

  async createPoolPurchaseOrder(body: CreatePoolPurchaseDto) {
    const { stockId, userId, quantity, offeredPrice, paymentId } = body
    // TO-DO: Send email after pool purchase
    // TO-DO: Also / OR make and webhook notification, if will be decided to ALTER model with it

    if (!stockId || !userId) throw new BadRequestException("StockID and UserID are required in pool purchase.")

    return this.prisma.$transaction(async (prisma) => {
      const stock = await prisma.stock.findUnique({ where: { id: stockId } })
      const user = await prisma.user.findUnique({ where: { id: userId } })

      if (!stock || !user) throw new BadRequestException("Stock or User wasn`t created or properly assigned.")
      if (offeredPrice < stock.price) {
        throw new BadRequestException(`Offered price (${offeredPrice}) is below the current stock price (${stock.price}).`);
      }

      // check for available shares in the pool
      const purchasedShares = await prisma.purchasedShare.aggregate({
        where: { stockId },
        _sum: { quantity: true },
      })
      const ownedQuantity = purchasedShares._sum.quantity || 0
      const freeQuantity = stock.totalQuantity - ownedQuantity

      if (freeQuantity < quantity) {
        throw new BadRequestException(`Not enough free shares available to buy. Available: ${freeQuantity}`)
      }

      // create an order from the pool
      const poolOrder = await prisma.orderStock.create({
        data: {
          stockId,
          userId,
          type: "BUY", // Accept as BUY, because order from pool
          quantity,
          offeredPrice,
          paymentId: paymentId || null,
          status: "COMPLETED", // Auto confirm, because its purshare from pool
        },
      })

      // history update
      await prisma.transactionHistory.create({
        data: {
          stockId,
          userId,
          orderId: poolOrder.id,
          type: "PURCHASE",
          quantity,
          price: offeredPrice,
        },
      })

      // update user purshare from pool purshare
      const buyerShare = await prisma.purchasedShare.findFirst({
        where: { userId, stockId },
      })

      if (buyerShare) {
        await prisma.purchasedShare.update({
          where: { id: buyerShare.id },
          data: { quantity: buyerShare.quantity + quantity },
        })
      } else {
        await prisma.purchasedShare.create({
          data: { userId, stockId, quantity },
        })
      }

      // TO-DO: Implement or not, decrease actual stocks quantity, but we might use market / free on web app
      // update "free" stocks quantity to a real number, but cant go below 0
      // const newTotalQuantity = Math.max(stock.totalQuantity - quantity, 0);
      // await prisma.stock.update({
      //   where: { id: stockId },
      //   data: { totalQuantity: newTotalQuantity },
      // });

      return poolOrder
    }).catch((error) => {
      throw new BadRequestException(`Failed to create pool purchase order: ${error.message}`)
    })
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

  /**
    |============================
    | UTILS FN
    |============================
  */

  async checkMatchingOrder(prismaProp, newOrder: Order) {
    const { stockId, type, quantity, offeredPrice } = newOrder

    if (type === "SELL") {
      return await prismaProp.orderStock.findFirst({
        where: {
          stockId,
          type: "BUY",
          status: "PENDING",
          quantity,
          offeredPrice: { gte: offeredPrice } // greater or equal
        },
        orderBy: [
          { offeredPrice: "desc" }, // the highest price
          { createdAt: "asc" } // the earliest placed order
        ]
      })
    } else if (type === "BUY") {
      return await prismaProp.orderStock.findFirst({
        where: {
          stockId,
          type: "SELL",
          status: "PENDING",
          quantity,
          offeredPrice: { lte: offeredPrice } // less or equal
        },
        orderBy: [
          { offeredPrice: "asc" }, // the minimal price
          { createdAt: "asc" } // the earliest placed order
        ]
      })
    }

    return null
  }

  async performTrade(prismaProp, newOrder: Order, matchingOrder: Order) {
    const { type: newOrderType, userId: newUserId, stockId, quantity, offeredPrice: newPrice } = newOrder
    const { id: matchingOrderId, userId: matchingUserId, offeredPrice: matchingPrice } = matchingOrder

    // determine price of person, who was in query earlier
    const tradePrice = newOrder.createdAt < matchingOrder.createdAt ? newPrice : matchingPrice

    // update of stock-orders status
    await prismaProp.orderStock.update({
      where: { id: newOrder.id },
      data: { status: "COMPLETED" }
    })
    await prismaProp.orderStock.update({
      where: { id: matchingOrderId },
      data: { status: "COMPLETED" }
    })

    // update transaction-history for both orders

    // new order history
    await prismaProp.transactionHistory.create({
      data: {
        stockId,
        userId: newUserId,
        orderId: newOrder.id,
        type: newOrderType === "SELL" ? "SALE" : "PURCHASE",
        quantity,
        price: tradePrice
      }
    })

    // match order history
    await prismaProp.transactionHistory.create({
      data: {
        stockId,
        userId: matchingUserId,
        orderId: matchingOrderId,
        type: newOrderType === "SELL" ? "PURCHASE" : "SALE",
        quantity,
        price: tradePrice
      }
    })

    const sellerId = newOrderType === "SELL" ? newUserId : matchingUserId
    const buyerId = newOrderType === "SELL" ? matchingUserId : newUserId

    // decrease amount of shares from the seller
    const sellerShare = await prismaProp.purchasedShare.findFirst({
      where: { userId: sellerId, stockId },
    })

    if (!sellerShare) {
      throw new Error("Seller does not own any shares.")
    }

    const newSellerQuantity = sellerShare.quantity - quantity

    if (newSellerQuantity === 0) {
      // to save some db space
      await prismaProp.purchasedShare.delete({ where: { id: sellerShare.id } })
    } else {
      // update quantity
      await prismaProp.purchasedShare.update({
        where: { id: sellerShare.id },
        data: { quantity: newSellerQuantity },
      })
      // also send email async (if you send it in transaction - its gonna block, send outside of transaction)
    }

    // increasing shares in buyer (or create a new buyer record)
    const buyerShare = await prismaProp.purchasedShare.findFirst({
      where: { userId: buyerId, stockId },
    })

    if (buyerShare) {
      await prismaProp.purchasedShare.update({
        where: { id: buyerShare.id },
        data: { quantity: buyerShare.quantity + quantity },
      })
      // also send email async (if you send it in transaction - its gonna block, send outside of transaction)
    } else {
      await prismaProp.purchasedShare.create({
        data: {
          userId: buyerId,
          stockId,
          quantity,
        },
      })
    }
  }
}
