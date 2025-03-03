import { forwardRef, Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionController } from "./subscription.controller";
import { StripeModule } from "../stripe/stripe.module";

@Module({
  imports: [PrismaModule, forwardRef(() => StripeModule)],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
