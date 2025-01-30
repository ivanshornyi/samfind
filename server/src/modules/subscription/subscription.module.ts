import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

import { UserModule } from "../user/user.module";
import { StripeService } from "../stripe/stripe.service";
import { UserService } from "../user/user.service";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, StripeService, PrismaService, UserService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
