import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { UserDiscountController } from "./user-discount.controller";
import { UserDiscountService } from "./user-discount.service";

@Module({
  imports: [PrismaModule],
  controllers: [UserDiscountController],
  providers: [UserDiscountService, PrismaService],
  exports: [],
})
export class DiscountModule {}