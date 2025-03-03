import { forwardRef, Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ShareController } from "./share.controller";
import { ShareService } from "./share.service";
import { WalletModule } from "../wallet/wallet.module";
import { StripeModule } from "../stripe/stripe.module";

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => WalletModule),
    forwardRef(() => StripeModule),
  ],
  controllers: [ShareController],
  providers: [ShareService],
  exports: [ShareService],
})
export class ShareModule {}
