import { BadRequestException, Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
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
}
