import { forwardRef, Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { SubscriptionModule } from "../subscription/subscription.module";
import { StripeModule } from "../stripe/stripe.module";

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => SubscriptionModule),
    forwardRef(() => StripeModule),
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
