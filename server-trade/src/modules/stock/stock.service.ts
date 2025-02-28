import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"
import { OrderType } from "src/common/types/order-type"
import { CreateStockDto } from './dto/create-stock-dto'
import { UpdateStockDto } from './dto/update-stock-dto'

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) { }

  async createStockItem(CreateStockDto: CreateStockDto) {
    const { name, totalQuantity, price } = CreateStockDto

    if (!totalQuantity || !price || !name) {
      throw new BadRequestException("Body is required to create a stock.")
    }

    try {
      const stock = await this.prisma.$transaction(async (prisma) => {
        const stock = await prisma.stock.findFirst({
          where: { name }
        })

        if (stock) throw new BadRequestException("This Stock already exist.")

        return prisma.stock.create({
          data: {
            name,
            totalQuantity,
            price
          },
        })
      })

      return stock
    } catch (error) {
      throw new BadRequestException(`Failed to create stock: ${error.message}`)
    }
  }

  async getStockById(id: string) {
    if (!id) throw new BadRequestException("Id was not provided or invalid.")

    return await this.prisma.stock.findFirst({
      where: { id: id }
    })
  }

  async getAllStocksWithPagination(page: number, limit: number, order: OrderType) {
    const stocks = await this.prisma.stock.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: order }
    })

    const total = await this.prisma.stock.count()

    return {
      paging: {
        page,
        limit,
        total
      },
      data: stocks
    }
  }

  async updateStockById(id: string, body: UpdateStockDto) {
    if (!id) throw new BadRequestException("Id was not provided or invalid.")

    const { name, price, totalQuantity } = body

    return await this.prisma.stock.update({
      where: { id },
      data: {
        name: name,
        price,
        totalQuantity
      }
    })
  }

  async deleteStockById(id: string) {
    return await this.prisma.stock.delete({
      where: { id }
    })
  }
}
