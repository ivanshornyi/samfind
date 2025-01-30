import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { PlanService } from "./plan.service";
import { PlanController } from "./plan.controller";
import { UserModule } from "../user/user.module";
import { StripeService } from "../stripe/stripe.service";
import { UserService } from "../user/user.service";

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [PlanController],
  providers: [PlanService, StripeService, PrismaService, UserService],
  exports: [PlanService],
})
export class PlanModule {}
