import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { OrderType } from 'src/common/types/order-type'
import { CreateUserDto } from './dto/create-user-dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async createUser(createUserDto: CreateUserDto) {
    const { firstName, lastName, email, stripeCustomerId } = createUserDto

    try {
      const newUser = await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findFirst({
          where: { email }
        })

        if (user) throw new BadRequestException("User with that email already exist.")

        return prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            stripeCustomerId: stripeCustomerId ? stripeCustomerId : null
          },
        })
      })

      return newUser
    } catch (error) {
      throw new BadRequestException(`Failed to create user: ${error.message}`)
    }
  }

  async getAllUsersWithPagination(page: number, limit: number, order: OrderType) {
    const allUsers = await this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { orders: true },
      orderBy: { createdAt: order }
    })

    const total = await this.prisma.user.count()

    return {
      paging: {
        page,
        limit,
        total
      },
      data: allUsers
    }
  }

  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { orders: true, transactions: true, purchasedShares: true }
    })
  }

  async deleteUserByid(id: string) {
    return await this.prisma.user.delete({
      where: { id }
    })
  }
}
