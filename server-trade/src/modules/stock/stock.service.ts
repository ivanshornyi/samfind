import { CreateStockDto } from './dto/create-stock-dto';
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) { }

  async createStockItem(CreateStockDto: CreateStockDto) {
    const { stockName, firstName, lastName, email, externalUserId, price, quantity } = CreateStockDto

    if (!email) {
      throw new BadRequestException("Email is required to create a stock.");
    }

    try {
      const stock = await this.prisma.$transaction(async (prisma) => {
        let user = await prisma.user.findFirst({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              firstName,
              lastName,
            },
          });
        }

        return prisma.stock.create({
          data: {
            externalUserId,
            ownerId: user.id,
            name: stockName,
            price,
            quantity,
          },
        });
      });

      return stock;
    } catch (error) {
      throw new BadRequestException(`Failed to create stock: ${error.message}`);
    }
  }
}
