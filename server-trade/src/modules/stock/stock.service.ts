import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma"
import { CreateStockDto } from './dto/create-stock-dto'
import { UpdateStockDto } from './dto/update-stock-dto'

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) { }

  async createStockItem(CreateStockDto: CreateStockDto) {
    const { stockName, firstName, lastName, email, externalUserId, price, quantity } = CreateStockDto

    if (!email) {
      throw new BadRequestException("Email is required to create a stock.")
    }

    try {
      const stock = await this.prisma.$transaction(async (prisma) => {
        let user = await prisma.user.findFirst({
          where: { email },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              firstName,
              lastName,
            },
          })
        }

        return prisma.stock.create({
          data: {
            externalUserId,
            ownerId: user.id,
            name: stockName,
            price,
            quantity,
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
      where: { id: id },
      include: { stockOwner: true }
    })
  }

  async getAllStocksWithPagination(page: number, limit: number, order: "asc" | "desc") {
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

    const { stockName, price, quantity } = body

    return await this.prisma.stock.update({
      where: { id },
      data: {
        name: stockName,
        price,
        quantity
      }
    })
  }
}
