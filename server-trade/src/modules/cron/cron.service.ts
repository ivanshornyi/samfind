import { Injectable, Logger } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"
import { PrismaService } from "nestjs-prisma"
import { MailService } from "../mail/mail.service"

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) { }

  /**
      * This will create and run cron-job everyday at midnight. It should clean-up db from old stock-orders.
      * Orders valid max 1 day, if more - then user should re-create them, and we should care about db space
      * and cancel old orders.
      */

  // every day at midnight (12AM)
  @Cron("0 0 * * *")
  async handleStockOrdersCleanUp() {
    try {
      this.logger.log(
        "Starting cleanup of irrelevant stock orders at 00:00 AM",
      )

      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24)


      // filtering allOrders and find those that Date - 1 from current
      const allStockOrders = await this.prisma.orderStock.findMany({
        where: {
          createdAt: {
            lte: oneDayAgo
          },
          status: "PENDING"
        },
        orderBy: { createdAt: 'asc' }
      })

      // if founded and array is not empty - make transaction, and update order status, history in all orders
      if (allStockOrders && allStockOrders.length > 0) {
        await this.prisma.$transaction(async (prisma) => {
          const updatePromises = allStockOrders.map((order) =>
            Promise.all([
              prisma.orderStock.update({
                where: { id: order.id },
                data: { status: "CANCELED" }
              }),

              prisma.transactionHistory.create({
                data: {
                  stockId: order.stockId,
                  userId: order.userId,
                  orderId: order.id,
                  type: "REJECTION",
                  quantity: order.quantity,
                  price: order.offeredPrice
                }
              })
            ])
          )

          await Promise.all(updatePromises)
        })

        this.logger.log(
          `Successfully canceled ${allStockOrders.length} expired stock orders.`,
        )

      } else {
        this.logger.log("No expired stock orders found to cancel.")
      }
    } catch (error) {
      this.logger.error("Error cleaning up stock-orders", error)
    }
  }
}
