import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";

import { PlanService } from "./plan.service";
import { PlanController } from "./plan.controller";
import { StripeModule } from "../stripe/stripe.module";

@Module({
  imports: [PrismaModule, StripeModule],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
