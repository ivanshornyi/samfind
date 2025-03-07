import { forwardRef, Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ShareController } from "./share.controller";
import { ShareService } from "./share.service";
import { WalletModule } from "../wallet/wallet.module";
import { StripeModule } from "../stripe/stripe.module";
import { SubscriptionModule } from "../subscription/subscription.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    forwardRef(() => WalletModule),
    forwardRef(() => StripeModule),
    SubscriptionModule,
  ],
  controllers: [ShareController],
  providers: [ShareService],
  exports: [ShareService],
})
export class ShareModule {}
